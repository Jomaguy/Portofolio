import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull(),
  category: text("category").notNull(),
  link: text("link"),
  github: text("github")
});

export const insertProjectSchema = createInsertSchema(projects);
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type ProjectCategory = "Web Apps" | "Mobile Apps" | "Chrome Extensions" | "Other";

// Static project data
export const projectData: Project[] = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "Real-time analytics platform with machine learning insights",
    image: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
    technologies: ["React", "Python", "TensorFlow", "AWS"],
    category: "Web Apps",
    link: "https://analytics.example.com",
    github: "https://github.com/example/analytics"
  },
  {
    id: 2,
    title: "Enterprise Resource Planning System",
    description: "Comprehensive ERP solution for business management",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    technologies: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
    category: "Web Apps",
    link: "https://erp.example.com",
    github: "https://github.com/example/erp"
  },
  {
    id: 3, 
    title: "E-commerce Mobile App",
    description: "Cross-platform mobile shopping application",
    image: "https://images.unsplash.com/photo-1739514984003-330f7c1d2007",
    technologies: ["React Native", "GraphQL", "MongoDB", "Firebase"],
    category: "Mobile Apps",
    link: "https://shop.example.com",
    github: "https://github.com/example/shop"
  },
  {
    id: 4,
    title: "Cloud Infrastructure Automation",
    description: "Infrastructure as code solution for cloud deployments",
    image: "https://images.unsplash.com/photo-1510759395231-72b17d622279", 
    technologies: ["Terraform", "AWS", "Kubernetes", "Go"],
    category: "Other",
    link: "https://infra.example.com",
    github: "https://github.com/example/infra"
  },
  {
    id: 5,
    title: "Tab Manager Pro",
    description: "Chrome extension for efficient tab management and organization",
    image: "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89",
    technologies: ["JavaScript", "Chrome API", "HTML", "CSS"],
    category: "Chrome Extensions",
    link: "https://chrome.google.com/webstore/example",
    github: "https://github.com/example/tab-manager"
  }
];