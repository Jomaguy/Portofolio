import { type Project, type InsertProject, type Admin, type InsertAdmin, type User, type InsertUser, projectData } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

export interface IStorage {
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // User operations (retained from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private admins: Map<number, Admin>;
  private users: Map<number, User>;
  private currentProjectId: number;
  private currentAdminId: number;
  private currentUserId: number;

  constructor() {
    this.projects = new Map();
    this.admins = new Map();
    this.users = new Map();
    this.currentProjectId = 1;
    this.currentAdminId = 1;
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
      github: insertProject.github || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) {
      throw new Error('Project not found');
    }
    const updated = { ...existing, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
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
}

export class FileStorage implements IStorage {
  private dataDir: string;
  private projectsFile: string;
  private adminsFile: string;
  private usersFile: string;
  private projects: Project[];
  private admins: Admin[];
  private users: User[];
  private currentProjectId: number;
  private currentAdminId: number;
  private currentUserId: number;

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
    this.projectsFile = path.join(dataDir, 'projects.json');
    this.adminsFile = path.join(dataDir, 'admins.json');
    this.usersFile = path.join(dataDir, 'users.json');
    this.projects = [];
    this.admins = [];
    this.users = [];
    this.currentProjectId = 1;
    this.currentAdminId = 1;
    this.currentUserId = 1;
    this.initialize();
  }

  private async initialize() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize projects
      try {
        const projectsData = await fs.readFile(this.projectsFile, 'utf-8');
        this.projects = JSON.parse(projectsData);
        // Find the highest project ID to set the next ID
        this.currentProjectId = Math.max(...this.projects.map(p => p.id), 0) + 1;
      } catch (error) {
        // If file doesn't exist or is invalid, initialize with sample data
        this.projects = [...projectData];
        await this.saveProjects();
      }

      // Initialize admins
      try {
        const adminsData = await fs.readFile(this.adminsFile, 'utf-8');
        this.admins = JSON.parse(adminsData);
        this.currentAdminId = Math.max(...this.admins.map(a => a.id), 0) + 1;
      } catch (error) {
        this.admins = [];
        await this.saveAdmins();
      }

      // Initialize users
      try {
        const usersData = await fs.readFile(this.usersFile, 'utf-8');
        this.users = JSON.parse(usersData);
        this.currentUserId = Math.max(...this.users.map(u => u.id), 0) + 1;
      } catch (error) {
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

  private async saveAdmins() {
    await fs.writeFile(this.adminsFile, JSON.stringify(this.admins, null, 2), 'utf-8');
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
      github: insertProject.github || null
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
    const updated = { ...this.projects[index], ...updates };
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

  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.find(admin => admin.id === id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return this.admins.find(admin => admin.username === username);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const admin: Admin = { ...insertAdmin, id };
    this.admins.push(admin);
    await this.saveAdmins();
    return admin;
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
}

// Use FileStorage instead of MemStorage
export const storage = new FileStorage();