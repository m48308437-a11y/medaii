import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { healthNotes } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

const createSchema = z.object({
  type: z.enum(["note", "symptom", "mood"]).default("note"),
  title: z.string().max(255).optional(),
  content: z.string().max(4000).optional(),
  mood: z.string().max(30).optional(),
  symptomTags: z.array(z.string()).default([]),
  severity: z.number().min(1).max(10).optional(),
  entryDate: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ entries: [] });

  const entries = await db
    .select()
    .from(healthNotes)
    .where(eq(healthNotes.userId, user.id))
    .orderBy(desc(healthNotes.entryDate));

  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { entryDate, ...rest } = parsed.data;
  const [entry] = await db
    .insert(healthNotes)
    .values({
      userId: user.id,
      ...rest,
      entryDate: entryDate ? new Date(entryDate) : new Date(),
    })
    .returning();

  return NextResponse.json({ entry });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.delete(healthNotes).where(and(eq(healthNotes.id, id), eq(healthNotes.userId, user.id)));
  return NextResponse.json({ success: true });
}
