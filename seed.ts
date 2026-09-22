import { db } from "@/db";
import { roles, users, medications, faqs } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function seed() {
  console.log("🌱 Seeding database...");

  // Roles
  const rolesData = [
    { name: "user", description: "Default user role", permissions: ["chat:write", "profile:read", "profile:write", "consultations:read"] },
    { name: "analyst", description: "Read-only analytics access", permissions: ["admin:read", "analytics:read"] },
    { name: "support", description: "User support access", permissions: ["admin:read", "users:read", "consultations:read", "safety:read"] },
    { name: "medical_content_manager", description: "Can manage medical knowledge base", permissions: ["admin:read", "sources:write", "sources:read", "content:write"] },
    { name: "admin", description: "Administrator with most privileges", permissions: ["admin:read", "admin:write", "users:read", "users:write", "consultations:read", "safety:read", "safety:write", "sources:*", "content:*"] },
    { name: "super_admin", description: "Full system access", permissions: ["*"] },
  ];

  for (const role of rolesData) {
    const existing = await db.select().from(roles).where(eq(roles.name, role.name)).limit(1);
    if (!existing[0]) {
      await db.insert(roles).values(role);
      console.log(`  ✅ Created role: ${role.name}`);
    }
  }

  // Find super_admin and user role IDs
  const superAdminRole = await db.select().from(roles).where(eq(roles.name, "super_admin")).limit(1);
  const userRole = await db.select().from(roles).where(eq(roles.name, "user")).limit(1);

  // Demo super admin
  const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@medai.app")).limit(1);
  if (!existingAdmin[0] && superAdminRole[0]) {
    const hash = await hashPassword("Admin@1234");
    await db.insert(users).values({
      email: "admin@medai.app",
      passwordHash: hash,
      name: "مدیر ارشد",
      roleId: superAdminRole[0].id,
      language: "fa",
      emailVerified: true,
    });
    console.log("  ✅ Created super admin: admin@medai.app / Admin@1234");
  }

  // Demo user
  const existingUser = await db.select().from(users).where(eq(users.email, "demo@medai.app")).limit(1);
  if (!existingUser[0] && userRole[0]) {
    const hash = await hashPassword("Demo@1234");
    await db.insert(users).values({
      email: "demo@medai.app",
      passwordHash: hash,
      name: "کاربر نمایشی",
      roleId: userRole[0].id,
      language: "fa",
      emailVerified: true,
    });
    console.log("  ✅ Created demo user: demo@medai.app / Demo@1234");
  }

  // Medications
  const existingMeds = await db.select().from(medications).limit(1);
  if (existingMeds.length === 0) {
    await db.insert(medications).values([
      {
        name: "استامینوفن (پاراستامول)",
        genericName: "Acetaminophen",
        drugClass: "Analgesic, Antipyretic",
        uses: ["تب", "درد خفیف تا متوسط", "سردرد", "درد عضلانی"],
        forms: ["قرص", "شربت", "شیاف"],
        warnings: [
          "بیش از دوز توصیه‌شده مصرف نکنید (خطر آسیب کبدی)",
          "در صورت بیماری کبدی با پزشک مشورت کنید",
        ],
        sideEffects: ["عموماً خوب تحمل می‌شود", "به ندرت واکنش آلرژیک"],
        interactions: ["الکل", "کاربامازپین"],
        whenToTalk: ["تب بیش از ۳ روز", "درد بیش از ۱۰ روز", "علائم آلرژی"],
      },
      {
        name: "ایبوپروفن",
        genericName: "Ibuprofen",
        drugClass: "NSAID",
        uses: ["درد", "التهاب", "تب", "درد قاعدگی"],
        forms: ["قرص", "کپسول", "شربت"],
        warnings: [
          "در صورت زخم معده احتیاط شود",
          "مصرف در سه‌ماهه سوم بارداری ممنوع",
        ],
        sideEffects: ["ناراحتی معده", "سوزش سردل"],
        interactions: ["آسپرین", "وارفارین", "لیتیوم"],
        whenToTalk: ["درد معده مداوم", "مدفوع سیاه", "واکنش آلرژیک"],
      },
      {
        name: "آموکسی‌سیلین",
        genericName: "Amoxicillin",
        drugClass: "Penicillin Antibiotic",
        uses: ["عفونت‌های باکتریایی گلو", "عفونت گوش", "عفونت ادراری"],
        forms: ["کپسول", "شربت"],
        warnings: [
          "فقط برای عفونت باکتریایی (روی ویروس اثری ندارد)",
          "در صورت آلرژی به پنی‌سیلین مصرف نشود",
          "دوره درمان را کامل کنید",
        ],
        sideEffects: ["اسهال", "حالت تهوع", "جوش پوستی"],
        interactions: ["متوترکسات"],
        whenToTalk: ["اسهال شدید", "جوش", "تنگی نفس"],
      },
    ]);
    console.log("  ✅ Seeded medications");
  }

  // FAQs
  const existingFaqs = await db.select().from(faqs).limit(1);
  if (existingFaqs.length === 0) {
    await db.insert(faqs).values([
      { question: "آیا مد‌ای‌آی پزشک واقعی است؟", answer: "خیر. مد‌ای‌آی یک ابزار اطلاع‌رسانی است و جایگزین پزشک نیست.", category: "عمومی", order: 1 },
      { question: "آیا پاسخ‌های مد‌ای‌آی دقیق هستند؟", answer: "ما تمام تلاش خود را می‌کنیم پاسخ‌ها بر اساس منابع معتبر پزشکی باشند، اما هیچ تضمینی برای صحت کامل وجود ندارد. همیشه با پزشک مشورت کنید.", category: "عمومی", order: 2 },
      { question: "آیا داده‌های من خصوصی می‌مانند؟", answer: "بله. ما از رمزنگاری و اصول حداقل داده استفاده می‌کنیم. می‌توانید در هر زمان حساب و داده‌های خود را حذف کنید.", category: "حریم خصوصی", order: 3 },
    ]);
    console.log("  ✅ Seeded FAQs");
  }

  console.log("✅ Seed completed successfully.");
}

// Run if called directly
if (typeof require !== "undefined" && require.main === module) {
  seed().then(() => process.exit(0)).catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
}
