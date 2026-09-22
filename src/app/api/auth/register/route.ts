import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession } from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing[0]) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Get default user role
    let userRole = await db.select().from(roles).where(eq(roles.name, "user")).limit(1);
    if (!userRole[0]) {
      const [role] = await db
        .insert(roles)
        .values({ name: "user", description: "Default user role", permissions: [] })
        .returning();
      userRole = [role];
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        name,
        roleId: userRole[0].id,
        language: "fa",
      })
      .returning({ id: users.id, email: users.email, name: users.name });

    // Get IP and user agent
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || null;
    const userAgent = req.headers.get("user-agent");

    await createSession(newUser.id, userAgent || undefined, ipAddress || undefined);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
  }
}
