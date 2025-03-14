import { type Project, type InsertProject, type User, type InsertUser, projectData, type ProjectButton } from "@shared/schema.js";
import fs from 'fs/promises';
import path from 'path';
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";
// Import the projects data directly
import importedProjectsData from '../projects.json' assert { type: "json" };

export interface IStorage {
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // User operations (retained from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // New operations
  getResume(): Promise<any>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private users: Map<number, User>;
  private currentProjectId: number;
  private currentUserId: number;

  constructor() {
    this.projects = new Map();
    this.users = new Map();
    this.currentProjectId = 1;
    this.currentUserId = 1;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      link: insertProject.link || null,
      github: insertProject.github || null,
      videoWalkthrough: insertProject.videoWalkthrough || null,
      details: insertProject.details || null,
      buttons: (insertProject.buttons as ProjectButton[]) || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error('Project not found');
    }
    const updated: Project = { 
      ...existing, 
      ...updates,
      link: updates.link ?? existing.link,
      github: updates.github ?? existing.github,
      videoWalkthrough: updates.videoWalkthrough ?? existing.videoWalkthrough,
      details: updates.details ?? existing.details,
      buttons: updates.buttons ? (updates.buttons as ProjectButton[]) : existing.buttons
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getResume(): Promise<any> {
    // Implementation needed
    throw new Error("Method not implemented");
  }
}

export class FileStorage implements IStorage {
  private dataDir: string;
  private projectsFile: string;
  private usersFile: string;
  private resumePath: string;
  private projects: Project[];
  private users: User[];
  private currentProjectId: number;
  private currentUserId: number;

  constructor(dataDir: string = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'data') 
    : './data') {
    console.log(`Storage using data directory: ${dataDir}`);
    this.dataDir = dataDir;
    this.projectsFile = path.join(dataDir, 'projects.json');
    this.usersFile = path.join(dataDir, 'users.json');
    this.resumePath = path.join(dataDir, 'resume.json');
    this.projects = [];
    this.users = [];
    this.currentProjectId = 1;
    this.currentUserId = 1;
    this.initialize();
  }

  private async initialize() {
    try {
      // Create data directory if it doesn't exist
      try {
        await fs.mkdir(this.dataDir, { recursive: true });
        console.log(`Created/verified data directory: ${this.dataDir}`);
      } catch (error) {
        console.error(`Error creating data directory: ${this.dataDir}`, error);
      }
      
      console.log('Using directly imported projects data');
      // Start with the imported projects data - this will always work regardless of environment
      this.projects = [...importedProjectsData];
      this.currentProjectId = Math.max(...this.projects.map(p => p.id), 0) + 1;
      console.log(`Loaded ${this.projects.length} projects from imported data`);
      
      // We'll still try to read from files for development purposes
      // but our bundled data is now the default fallback
      let projectsLoadedFromFile = false;
      
      // Try primary data location
      try {
        console.log(`Attempting to read projects from: ${this.projectsFile}`);
        const projectsData = await fs.readFile(this.projectsFile, 'utf-8');
        console.log(`Successfully read projects data, length: ${projectsData.length}`);
        const fileProjects = JSON.parse(projectsData);
        
        // Only update if we have projects in the file
        if (fileProjects && fileProjects.length > 0) {
          this.projects = fileProjects;
          this.currentProjectId = Math.max(...this.projects.map(p => p.id), 0) + 1;
          console.log(`Loaded ${this.projects.length} projects from data directory`);
          projectsLoadedFromFile = true;
        }
      } catch (error) {
        console.error(`Error reading projects file from data dir: ${this.projectsFile}`, error);
      }
        
      // Try root directory as second fallback (only if file reading failed)
      if (!projectsLoadedFromFile) {
        try {
          const rootProjectsPath = path.join(process.cwd(), 'projects.json');
          console.log(`Attempting to read projects from root: ${rootProjectsPath}`);
          const rootProjectsData = await fs.readFile(rootProjectsPath, 'utf-8');
          console.log(`Successfully read projects from root, length: ${rootProjectsData.length}`);
          const rootProjects = JSON.parse(rootProjectsData);
          
          // Only update if we have projects in the file
          if (rootProjects && rootProjects.length > 0) {
            this.projects = rootProjects;
            this.currentProjectId = Math.max(...this.projects.map(p => p.id), 0) + 1;
            console.log(`Loaded ${this.projects.length} projects from root file`);
            // Save to the normal location for future use
            await this.saveProjects();
          }
        } catch (rootError) {
          console.error(`Error reading root projects file`, rootError);
        }
      }

      // Initialize users
      try {
        const usersData = await fs.readFile(this.usersFile, 'utf-8');
        this.users = JSON.parse(usersData);
        this.currentUserId = Math.max(...this.users.map(u => u.id), 0) + 1;
      } catch (error) {
        console.error(`Error reading users file: ${this.usersFile}`, error);
        this.users = [];
        await this.saveUsers();
      }
    } catch (error) {
      console.error('Error initializing file storage:', error);
    }
  }

  private async saveProjects() {
    await fs.writeFile(this.projectsFile, JSON.stringify(this.projects, null, 2), 'utf-8');
  }

  private async saveUsers() {
    await fs.writeFile(this.usersFile, JSON.stringify(this.users, null, 2), 'utf-8');
  }

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.find(project => project.id === id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      link: insertProject.link || null,
      github: insertProject.github || null,
      videoWalkthrough: insertProject.videoWalkthrough || null,
      details: insertProject.details || null,
      buttons: (insertProject.buttons as ProjectButton[]) || null
    };
    this.projects.push(project);
    await this.saveProjects();
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    const existing = this.projects[index];
    const updated: Project = { 
      ...existing, 
      ...updates,
      link: updates.link ?? existing.link,
      github: updates.github ?? existing.github,
      videoWalkthrough: updates.videoWalkthrough ?? existing.videoWalkthrough,
      details: updates.details ?? existing.details,
      buttons: updates.buttons ? (updates.buttons as ProjectButton[]) : existing.buttons
    };
    this.projects[index] = updated;
    await this.saveProjects();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    const index = this.projects.findIndex(project => project.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      await this.saveProjects();
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.push(user);
    await this.saveUsers();
    return user;
  }

  async getResume() {
    try {
      const content = await readFile(this.resumePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading resume:", error);
      return null;
    }
  }
}

// Use FileStorage instead of MemStorage
export const storage = new FileStorage();