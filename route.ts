import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { reminders } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";

const createSchema = z.object({
  type: z.enum(["appointment", "medication", "lab_followup", "general"]),
  title: z.string().min(1).max(255),
  notes: z.string().max(1000).optional(),
  dueAt: z.string(),
  recurring: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ reminders: [] });

  const list = await db
    .select()
    .from(reminders)
    .where(eq(reminders.userId, user.id))
    .orderBy(asc(reminders.dueAt));

  return NextResponse.json({ reminders: list });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const [reminder] = await db
    .insert(reminders)
    .values({
      userId: user.id,
      ...parsed.data,
      dueAt: new Date(parsed.data.dueAt),
    })
    .returning();

  return NextResponse.json({ reminder });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, isCompleted } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db
    .update(reminders)
    .set({ isCompleted: !!isCompleted })
    .where(and(eq(reminders.id, id), eq(reminders.userId, user.id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.delete(reminders).where(and(eq(reminders.id, id), eq(reminders.userId, user.id)));
  return NextResponse.json({ success: true });
}
