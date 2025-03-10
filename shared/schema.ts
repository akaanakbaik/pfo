import { pgTable, text, serial, integer, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  count: integer("count").notNull().default(0),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  pageView: varchar("page_view", { length: 100 }).notNull(),
  count: integer("count").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website settings
export const websiteSettings = pgTable("website_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 100 }).notNull().default("Aka's Portfolio"),
  siteDescription: text("site_description").notNull().default("Professional Portfolio for Aka - Junior Developer from Indonesia"),
  siteKeywords: text("site_keywords").notNull().default("developer, portfolio, indonesia, javascript, react"),
  logoUrl: text("logo_url").default(""),
  faviconUrl: text("favicon_url").default(""),
  primaryColor: varchar("primary_color", { length: 20 }).default("#0f172a"), // Navy
  accentColor: varchar("accent_color", { length: 20 }).default("#a48111"), // Gold
  fontPrimary: varchar("font_primary", { length: 50 }).default("Playfair Display"),
  fontSecondary: varchar("font_secondary", { length: 50 }).default("Poppins"),
  showMusicPlayer: boolean("show_music_player").default(true),
  musicUrl: text("music_url").default("https://cdn.xtermai.xyz/FYDux.mp3"),
  enableAnimation: boolean("enable_animation").default(true),
  animationIntensity: varchar("animation_intensity", { length: 20 }).default("medium"), // low, medium, high
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal Information
export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().default("Aka"),
  title: varchar("title", { length: 100 }).notNull().default("Junior Developer"),
  bio: text("bio").notNull().default("15-year-old junior developer from West Sumatra, Indonesia"),
  location: varchar("location", { length: 100 }).default("West Sumatra, Indonesia"),
  email: varchar("email", { length: 100 }).default("aka@example.com"),
  phone: varchar("phone", { length: 30 }).default("+62 123 4567 890"),
  avatarUrl: text("avatar_url").default(""),
  resumeUrl: text("resume_url").default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social Links
export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(), // github, linkedin, twitter, etc.
  url: text("url").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // Font Awesome class
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").default(""),
  projectUrl: text("project_url").default(""),
  githubUrl: text("github_url").default(""),
  technologies: text("technologies").notNull().default(""),
  featured: boolean("featured").default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull().default("frontend"), // frontend, backend, tools, etc.
  proficiency: integer("proficiency").notNull().default(80), // 0-100
  icon: varchar("icon", { length: 50 }).default(""), // Font Awesome or custom icon class
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert Schemas
export const insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertWebsiteSettingsSchema = createInsertSchema(websiteSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertPersonalInfoSchema = createInsertSchema(personalInfo).omit({
  id: true,
  updatedAt: true,
});

export const insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  updatedAt: true,
});

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Export Types
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

export type InsertWebsiteSettings = z.infer<typeof insertWebsiteSettingsSchema>;
export type WebsiteSettings = typeof websiteSettings.$inferSelect;

export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
export type PersonalInfo = typeof personalInfo.$inferSelect;

export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type SocialLink = typeof socialLinks.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export type LoginCredentials = z.infer<typeof loginSchema>;
