import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMedicalResponse, type ChatMessage } from "@/lib/ai/service";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { consultations, messages, safetyEvents } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { Locale } from "@/lib/i18n";

const sendSchema = z.object({
  message: z.string().min(1).max(4000),
  consultationId: z.string().uuid().optional(),
  locale: z.enum(["fa", "en", "de"]).default("fa"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { message, consultationId, locale } = parsed.data;
    const user = await getCurrentUser();

    let consultation;

    if (user) {
      if (consultationId) {
        const existing = await db
          .select()
          .from(consultations)
          .where(and(eq(consultations.id, consultationId), eq(consultations.userId, user.id)))
          .limit(1);
        consultation = existing[0];
      }

      if (!consultation) {
        const [newConsultation] = await db
          .insert(consultations)
          .values({
            userId: user.id,
            title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
            mainTopic: message.slice(0, 200),
          })
          .returning();
        consultation = newConsultation;
      }

      // Save user message
      await db.insert(messages).values({
        consultationId: consultation.id,
        role: "user",
        content: message,
      });
    }

    // Load previous messages for context
    let history: ChatMessage[] = [];
    if (consultation) {
      const prevMessages = await db
        .select({ role: messages.role, content: messages.content })
        .from(messages)
        .where(eq(messages.consultationId, consultation.id))
        .orderBy(messages.createdAt)
        .limit(20);
      history = prevMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));
    } else {
      history = [{ role: "user", content: message }];
    }

    // Generate AI response (with built-in safety layer)
    const startTime = Date.now();
    const aiResponse = await generateMedicalResponse(history, locale as Locale);
    const latencyMs = Date.now() - startTime;

    // Save safety event if risk is high/critical
    if (user && (aiResponse.riskLevel === "high" || aiResponse.riskLevel === "critical")) {
      await db.insert(safetyEvents).values({
        userId: user.id,
        consultationId: consultation?.id,
        eventType: aiResponse.riskLevel === "critical" ? "urgent_referral" : "risk_detected",
        severity: aiResponse.riskLevel,
        trigger: message,
        input: message,
        action: aiResponse.riskLevel === "critical" ? "blocked_flow_urgent_referral" : "flagged_high_risk",
      });
    }

    // Save assistant message
    if (consultation) {
      await db.insert(messages).values({
        consultationId: consultation.id,
        role: "assistant",
        content: aiResponse.content,
        sources: aiResponse.sources as any,
        riskFlags: aiResponse.riskLevel === "critical" ? ["critical"] : aiResponse.riskLevel === "high" ? ["high"] : [],
      });

      // Update consultation risk level
      await db
        .update(consultations)
        .set({
          riskLevel: aiResponse.riskLevel,
          summary: aiResponse.content.slice(0, 500),
          updatedAt: new Date(),
        })
        .where(eq(consultations.id, consultation.id));
    }

    return NextResponse.json({
      response: aiResponse,
      consultationId: consultation?.id,
      latencyMs,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ consultations: [] });
  }

  const url = new URL(req.url);
  const consultationId = url.searchParams.get("id");

  if (consultationId) {
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.consultationId, consultationId as any))
      .orderBy(messages.createdAt);
    return NextResponse.json({ messages: msgs });
  }

  const userConsultations = await db
    .select()
    .from(consultations)
    .where(eq(consultations.userId, user.id))
    .orderBy(desc(consultations.updatedAt))
    .limit(50);

  return NextResponse.json({ consultations: userConsultations });
}
