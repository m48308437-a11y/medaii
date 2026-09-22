import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

// ==================== ROLES & PERMISSIONS ====================
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }),
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  language: varchar("language", { length: 10 }).default("fa").notNull(),
  roleId: integer("role_id").references(() => roles.id).default(1),
  avatar: text("avatar"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  isSuspended: boolean("is_suspended").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  healthData: jsonb("health_data").$type<Record<string, unknown>>().default({}),
  preferences: jsonb("preferences").$type<Record<string, unknown>>().default({}),
  notificationSettings: jsonb("notification_settings").$type<Record<string, unknown>>().default({}),
  privacySettings: jsonb("privacy_settings").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 50 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== CONSULTATIONS & MESSAGES ====================
export const consultations = pgTable("consultations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }),
  mainTopic: text("main_topic"),
  summary: text("summary"),
  riskLevel: varchar("risk_level", { length: 20 }).default("low"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  consultationId: uuid("consultation_id")
    .references(() => consultations.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  sources: jsonb("sources").$type<Array<{ title: string; url?: string; author?: string }>>().default([]),
  riskFlags: jsonb("risk_flags").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== SYMPTOMS & MEDICAL DATA ====================
export const symptoms = pgTable("symptoms", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  consultationId: uuid("consultation_id").references(() => consultations.id),
  name: varchar("name", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  severity: integer("severity"),
  associatedSymptoms: jsonb("associated_symptoms").$type<string[]>().default([]),
  medicalContext: jsonb("medical_context").$type<Record<string, unknown>>().default({}),
  result: jsonb("result"),
  riskLevel: varchar("risk_level", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const labResults = pgTable("lab_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  consultationId: uuid("consultation_id").references(() => consultations.id),
  title: varchar("title", { length: 255 }),
  rawText: text("raw_text"),
  parsedData: jsonb("parsed_data").$type<Array<Record<string, unknown>>>().default([]),
  analysis: jsonb("analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  genericName: varchar("generic_name", { length: 255 }),
  drugClass: varchar("drug_class", { length: 100 }),
  uses: jsonb("uses").$type<string[]>().default([]),
  forms: jsonb("forms").$type<string[]>().default([]),
  warnings: jsonb("warnings").$type<string[]>().default([]),
  sideEffects: jsonb("side_effects").$type<string[]>().default([]),
  interactions: jsonb("interactions").$type<string[]>().default([]),
  whenToTalk: jsonb("when_to_talk").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== KNOWLEDGE BASE (RAG) ====================
export const medicalSources = pgTable("medical_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  author: varchar("author", { length: 255 }),
  publisher: varchar("publisher", { length: 255 }),
  publicationDate: timestamp("publication_date"),
  url: text("url"),
  version: varchar("version", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  indexingStatus: varchar("indexing_status", { length: 20 }).default("pending"),
  addedById: uuid("added_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const knowledgeDocuments = pgTable("knowledge_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceId: uuid("source_id").references(() => medicalSources.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }),
  content: text("content").notNull(),
  chunkIndex: integer("chunk_index"),
  embedding: jsonb("embedding").$type<number[]>(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== SAFETY & AUDIT ====================
export const safetyEvents = pgTable("safety_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  consultationId: uuid("consultation_id").references(() => consultations.id),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  trigger: text("trigger"),
  input: text("input"),
  action: text("action"),
  reviewed: boolean("reviewed").default(false).notNull(),
  reviewedById: uuid("reviewed_by_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: varchar("entity_id", { length: 255 }),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: boolean("read").default(false).notNull(),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== CONTENT MANAGEMENT ====================
export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  authorId: uuid("author_id").references(() => users.id),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== HEALTH JOURNAL ====================
export const healthNotes = pgTable("health_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  entryDate: timestamp("entry_date").defaultNow().notNull(),
  type: varchar("type", { length: 30 }).default("note").notNull(), // note | symptom | mood
  title: varchar("title", { length: 255 }),
  content: text("content"),
  mood: varchar("mood", { length: 30 }),
  symptomTags: jsonb("symptom_tags").$type<string[]>().default([]),
  severity: integer("severity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== HEALTH REMINDERS ====================
export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // appointment | medication | lab_followup | general
  title: varchar("title", { length: 255 }).notNull(),
  notes: text("notes"),
  dueAt: timestamp("due_at").notNull(),
  recurring: varchar("recurring", { length: 20 }).default("none"), // none | daily | weekly | monthly
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== DOCTOR PREPARATION SUMMARIES ====================
export const healthSummaries = pgTable("health_summaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  consultationId: uuid("consultation_id").references(() => consultations.id),
  mainConcern: text("main_concern"),
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  duration: varchar("duration", { length: 100 }),
  changesOverTime: text("changes_over_time"),
  relevantNotes: text("relevant_notes"),
  questionsForDoctor: jsonb("questions_for_doctor").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
