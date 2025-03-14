import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export interface ProjectButton {
  label: string;
  url: string;
}

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull(),
  category: text("category").notNull(),
  originalCategory: text("original_category"),
  link: text("link"),
  github: text("github"),
  videoWalkthrough: text("video_walkthrough"),
  details: text("details"),
  buttons: jsonb("buttons").array().$type<ProjectButton[]>()
});

export const insertProjectSchema = createInsertSchema(projects);
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type ProjectCategory = "Featured" | "Web Apps" | "Mobile Apps" | "Chrome Extensions" | "Cybersecurity";

// User types (for backward compatibility)
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

// Sample project data for development
export const projectData: Project[] = [
  {
    id: 6,
    title: "VS Code-like Web IDE",
    description: "Modern web-based IDE using Monaco Editor and Golden Layout",
    image: "https://images.unsplash.com/photo-1592609931095-54a2168ae893",
    technologies: ["JavaScript", "Monaco Editor", "Golden Layout", "Semantic UI", "Event-Driven Architecture"],
    category: "Web Apps",
    originalCategory: null,
    link: "https://web-ide.example.com",
    github: "https://github.com/example/web-ide",
    videoWalkthrough: null,
    details: null,
    buttons: null
  }
];