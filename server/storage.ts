import { 
  visitors, admins, analytics, websiteSettings, personalInfo, socialLinks, projects, skills,
  type Visitor, type InsertVisitor, type Admin, type InsertAdmin, type Analytics, type InsertAnalytics, 
  type WebsiteSettings, type InsertWebsiteSettings, type PersonalInfo, type InsertPersonalInfo,
  type SocialLink, type InsertSocialLink, type Project, type InsertProject, type Skill, type InsertSkill,
  type LoginCredentials 
} from "@shared/schema";
import * as bcrypt from 'bcryptjs';

export interface IStorage {
  // Visitor methods
  getVisitorCount(): Promise<number>;
  incrementVisitorCount(): Promise<number>;
  
  // Admin methods
  createAdmin(data: InsertAdmin): Promise<Admin>;
  getAdminByUsername(username: string): Promise<Admin | null>;
  validateAdmin(credentials: LoginCredentials): Promise<Admin | null>;
  
  // Analytics methods
  recordPageView(pageView: string): Promise<Analytics>;
  getPageViews(): Promise<Analytics[]>;
  getTopPageViews(limit: number): Promise<Analytics[]>;

  // Website Settings methods
  getWebsiteSettings(): Promise<WebsiteSettings>;
  updateWebsiteSettings(data: Partial<InsertWebsiteSettings>): Promise<WebsiteSettings>;
  
  // Personal Info methods
  getPersonalInfo(): Promise<PersonalInfo>;
  updatePersonalInfo(data: Partial<InsertPersonalInfo>): Promise<PersonalInfo>;
  
  // Social Links methods
  getSocialLinks(): Promise<SocialLink[]>;
  getSocialLinkById(id: number): Promise<SocialLink | null>;
  createSocialLink(data: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, data: Partial<InsertSocialLink>): Promise<SocialLink | null>;
  deleteSocialLink(id: number): Promise<boolean>;
  
  // Projects methods
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | null>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | null>;
  deleteProject(id: number): Promise<boolean>;
  getFeaturedProjects(): Promise<Project[]>;
  
  // Skills methods
  getSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  getSkillById(id: number): Promise<Skill | null>;
  createSkill(data: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | null>;
  deleteSkill(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private visitorCount: number = 0;
  private admins: Admin[] = [];
  private analytics: Analytics[] = [];
  private websiteSettings: WebsiteSettings;
  private personalInfo: PersonalInfo;
  private socialLinks: SocialLink[] = [];
  private projects: Project[] = [];
  private skills: Skill[] = [];
  
  private nextAdminId: number = 1;
  private nextAnalyticsId: number = 1;
  private nextSocialLinkId: number = 1;
  private nextProjectId: number = 1;
  private nextSkillId: number = 1;

  constructor() {
    // Create default admin user - using non-hashed password directly in constructor
    // Using direct method for constructor to ensure password is consistent
    const adminCredentials = {
      id: this.nextAdminId++,
      username: 'akaanakbaik',
      password: '$2a$10$xRBp5BgXZ9V.K9U.c9SFAOEjv4XlKUTpGCbL5NJZEcFxiQJJPE7fO', // pre-hashed 'akaanakbaik17!'
      createdAt: new Date()
    };
    
    this.admins.push(adminCredentials);
    
    // Initialize website settings with default values
    this.websiteSettings = {
      id: 1,
      siteName: "Aka's Portfolio",
      siteDescription: "Professional Portfolio for Aka - Junior Developer from Indonesia",
      siteKeywords: "developer, portfolio, indonesia, javascript, react",
      logoUrl: "",
      faviconUrl: "",
      primaryColor: "#0f172a", // Navy
      accentColor: "#a48111", // Gold
      fontPrimary: "Playfair Display",
      fontSecondary: "Poppins",
      showMusicPlayer: true,
      musicUrl: "https://cdn.xtermai.xyz/FYDux.mp3",
      enableAnimation: true,
      animationIntensity: "medium",
      updatedAt: new Date()
    };
    
    // Initialize personal info with default values
    this.personalInfo = {
      id: 1,
      name: "Aka",
      title: "Junior Developer",
      bio: "15-year-old junior developer from West Sumatra, Indonesia",
      location: "West Sumatra, Indonesia",
      email: "aka@example.com",
      phone: "+62 123 4567 890",
      avatarUrl: "",
      resumeUrl: "",
      updatedAt: new Date()
    };
    
    // Add demo social links
    this.createSocialLink({
      platform: "GitHub",
      url: "https://github.com/aka",
      icon: "fab fa-github",
      displayOrder: 1
    });
    
    this.createSocialLink({
      platform: "LinkedIn",
      url: "https://linkedin.com/in/aka",
      icon: "fab fa-linkedin",
      displayOrder: 2
    });
    
    // Add demo projects
    this.createProject({
      title: "Personal Portfolio",
      description: "A professional portfolio website showcasing my skills and projects.",
      thumbnailUrl: "",
      projectUrl: "",
      githubUrl: "https://github.com/aka/portfolio",
      technologies: "React, TypeScript, Tailwind CSS",
      featured: true,
      displayOrder: 1
    });
    
    // Add demo skills
    this.createSkill({
      name: "HTML/CSS",
      category: "frontend",
      proficiency: 90,
      icon: "fab fa-html5",
      displayOrder: 1
    });
    
    this.createSkill({
      name: "JavaScript",
      category: "frontend",
      proficiency: 85,
      icon: "fab fa-js",
      displayOrder: 2
    });
    
    this.createSkill({
      name: "React",
      category: "frontend",
      proficiency: 80,
      icon: "fab fa-react",
      displayOrder: 3
    });
  }

  // Visitor methods
  async getVisitorCount(): Promise<number> {
    return this.visitorCount;
  }

  async incrementVisitorCount(): Promise<number> {
    this.visitorCount += 1;
    return this.visitorCount;
  }
  
  // Admin methods
  async createAdmin(data: InsertAdmin): Promise<Admin> {
    // Check if admin already exists
    const existingAdmin = await this.getAdminByUsername(data.username);
    if (existingAdmin) {
      throw new Error('Admin with this username already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const admin: Admin = {
      id: this.nextAdminId++,
      username: data.username,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    this.admins.push(admin);
    return { ...admin, password: '[HIDDEN]' } as Admin;
  }
  
  async getAdminByUsername(username: string): Promise<Admin | null> {
    const admin = this.admins.find(a => a.username === username);
    return admin || null;
  }
  
  async validateAdmin(credentials: LoginCredentials): Promise<Admin | null> {
    const admin = await this.getAdminByUsername(credentials.username);
    
    if (!admin) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(credentials.password, admin.password);
    
    if (!isValidPassword) {
      return null;
    }
    
    return { ...admin, password: '[HIDDEN]' } as Admin;
  }
  
  // Analytics methods
  async recordPageView(pageView: string): Promise<Analytics> {
    // Check if page view already exists
    const existingPageView = this.analytics.find(a => a.pageView === pageView);
    
    if (existingPageView) {
      existingPageView.count += 1;
      return existingPageView;
    }
    
    const newPageView: Analytics = {
      id: this.nextAnalyticsId++,
      pageView,
      count: 1,
      createdAt: new Date()
    };
    
    this.analytics.push(newPageView);
    return newPageView;
  }
  
  async getPageViews(): Promise<Analytics[]> {
    return this.analytics;
  }
  
  async getTopPageViews(limit: number): Promise<Analytics[]> {
    return [...this.analytics]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  // Website Settings methods
  async getWebsiteSettings(): Promise<WebsiteSettings> {
    return this.websiteSettings;
  }
  
  async updateWebsiteSettings(data: Partial<InsertWebsiteSettings>): Promise<WebsiteSettings> {
    this.websiteSettings = {
      ...this.websiteSettings,
      ...data,
      updatedAt: new Date()
    };
    
    return this.websiteSettings;
  }
  
  // Personal Info methods
  async getPersonalInfo(): Promise<PersonalInfo> {
    return this.personalInfo;
  }
  
  async updatePersonalInfo(data: Partial<InsertPersonalInfo>): Promise<PersonalInfo> {
    this.personalInfo = {
      ...this.personalInfo,
      ...data,
      updatedAt: new Date()
    };
    
    return this.personalInfo;
  }
  
  // Social Links methods
  async getSocialLinks(): Promise<SocialLink[]> {
    return [...this.socialLinks].sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getSocialLinkById(id: number): Promise<SocialLink | null> {
    const socialLink = this.socialLinks.find(s => s.id === id);
    return socialLink || null;
  }
  
  async createSocialLink(data: InsertSocialLink): Promise<SocialLink> {
    const socialLink: SocialLink = {
      id: this.nextSocialLinkId++,
      platform: data.platform,
      url: data.url,
      icon: data.icon,
      displayOrder: data.displayOrder || 0,
      updatedAt: new Date()
    };
    
    this.socialLinks.push(socialLink);
    return socialLink;
  }
  
  async updateSocialLink(id: number, data: Partial<InsertSocialLink>): Promise<SocialLink | null> {
    const index = this.socialLinks.findIndex(s => s.id === id);
    
    if (index === -1) {
      return null;
    }
    
    this.socialLinks[index] = {
      ...this.socialLinks[index],
      ...data,
      updatedAt: new Date()
    };
    
    return this.socialLinks[index];
  }
  
  async deleteSocialLink(id: number): Promise<boolean> {
    const initialLength = this.socialLinks.length;
    this.socialLinks = this.socialLinks.filter(s => s.id !== id);
    
    return initialLength > this.socialLinks.length;
  }
  
  // Projects methods
  async getProjects(): Promise<Project[]> {
    return [...this.projects].sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getProjectById(id: number): Promise<Project | null> {
    const project = this.projects.find(p => p.id === id);
    return project || null;
  }
  
  async createProject(data: InsertProject): Promise<Project> {
    const project: Project = {
      id: this.nextProjectId++,
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl || "",
      projectUrl: data.projectUrl || "",
      githubUrl: data.githubUrl || "",
      technologies: data.technologies || "",
      featured: data.featured || false,
      displayOrder: data.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.projects.push(project);
    return project;
  }
  
  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | null> {
    const index = this.projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updatedAt: new Date()
    };
    
    return this.projects[index];
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    
    return initialLength > this.projects.length;
  }
  
  async getFeaturedProjects(): Promise<Project[]> {
    return this.projects.filter(p => p.featured);
  }
  
  // Skills methods
  async getSkills(): Promise<Skill[]> {
    return [...this.skills].sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return this.skills
      .filter(s => s.category === category)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  
  async getSkillById(id: number): Promise<Skill | null> {
    const skill = this.skills.find(s => s.id === id);
    return skill || null;
  }
  
  async createSkill(data: InsertSkill): Promise<Skill> {
    const skill: Skill = {
      id: this.nextSkillId++,
      name: data.name,
      category: data.category || "frontend",
      proficiency: data.proficiency || 80,
      icon: data.icon || "",
      displayOrder: data.displayOrder || 0,
      updatedAt: new Date()
    };
    
    this.skills.push(skill);
    return skill;
  }
  
  async updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | null> {
    const index = this.skills.findIndex(s => s.id === id);
    
    if (index === -1) {
      return null;
    }
    
    this.skills[index] = {
      ...this.skills[index],
      ...data,
      updatedAt: new Date()
    };
    
    return this.skills[index];
  }
  
  async deleteSkill(id: number): Promise<boolean> {
    const initialLength = this.skills.length;
    this.skills = this.skills.filter(s => s.id !== id);
    
    return initialLength > this.skills.length;
  }
}

export const storage = new MemStorage();
