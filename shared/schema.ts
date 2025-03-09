import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin user schema
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

// Stats schema
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  visitorCount: integer("visitor_count").notNull().default(0),
});

// Profile schema
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  aboutText: text("about_text").notNull(),
  approachText: text("approach_text").notNull(),
  avatar: text("avatar").notNull(),
  workspaceImage: text("workspace_image").notNull(),
  skills: text("skills").array().notNull(),
  socials: jsonb("socials").notNull(),
});

// Projects schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url").notNull(),
});

// Friends/network schema
export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  avatar: text("avatar").notNull(),
  website: text("website").notNull(),
});

// Contact messages schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull(),
});

// Create Zod schemas
export const profileSchema = createInsertSchema(profile);
export const projectSchema = createInsertSchema(projects);
export const friendSchema = createInsertSchema(friends);
export const contactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Define types
export type AdminType = typeof admins.$inferSelect;
export type InsertAdminType = z.infer<typeof insertAdminSchema>;

export type ProfileType = typeof profile.$inferSelect;
export type ProjectType = typeof projects.$inferSelect;
export type FriendType = typeof friends.$inferSelect;
export type ContactMessageType = typeof contactMessages.$inferSelect;
export type InsertContactMessageType = z.infer<typeof contactMessageSchema>;
