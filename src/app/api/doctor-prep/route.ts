import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { healthSummaries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const createSchema = z.object({
  mainConcern: z.string().min(1).max(1000),
  symptoms: z.array(z.string()).default([]),
  duration: z.string().max(100).optional(),
  changesOverTime: z.string().max(2000).optional(),
  relevantNotes: z.string().max(2000).optional(),
});

function buildQuestions(symptoms: string[], mainConcern: string): string[] {
  const base = [
    "این علائم چه احتمالاتی را در بر می‌گیرند؟",
    "آیا نیاز به آزمایش یا تصویربرداری خاصی هست؟",
    "چه زمانی باید دوباره مراجعه کنم؟",
    "آیا نشانه‌های هشداری وجود دارد که باید مراقب آن‌ها باشم؟",
  ];
  if (symptoms.some((s) => s.includes("درد"))) {
    base.push("چه اقدامات خانگی برای کاهش این درد مناسب است؟");
  }
  if (mainConcern.length > 0) {
    base.push(`آیا ${mainConcern} می‌تواند با سابقه پزشکی من مرتبط باشد؟`);
  }
  return base;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ summaries: [] });

  const list = await db
    .select()
    .from(healthSummaries)
    .where(eq(healthSummaries.userId, user.id))
    .orderBy(desc(healthSummaries.createdAt));

  return NextResponse.json({ summaries: list });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { mainConcern, symptoms, duration, changesOverTime, relevantNotes } = parsed.data;
  const questionsForDoctor = buildQuestions(symptoms, mainConcern);

  const user = await getCurrentUser();
  let saved = null;
  if (user) {
    const [summary] = await db
      .insert(healthSummaries)
      .values({
        userId: user.id,
        mainConcern,
        symptoms,
        duration,
        changesOverTime,
        relevantNotes,
        questionsForDoctor,
      })
      .returning();
    saved = summary;
  }

  return NextResponse.json({
    summary: saved || {
      mainConcern,
      symptoms,
      duration,
      changesOverTime,
      relevantNotes,
      questionsForDoctor,
      createdAt: new Date().toISOString(),
    },
  });
}
