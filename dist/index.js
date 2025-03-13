import express2 from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { createServer } from "http";
import * as bcrypt from "bcryptjs";

class MemStorage {
  visitorCount = 0;
  admins = [];
  analytics = [];
  websiteSettings;
  personalInfo;
  socialLinks = [];
  projects = [];
  skills = [];
  nextAdminId = 1;
  nextAnalyticsId = 1;
  nextSocialLinkId = 1;
  nextProjectId = 1;
  nextSkillId = 1;

  constructor() {
    const adminCredentials = {
      id: this.nextAdminId++,
      username: "akaanakbaik",

olong 
tkembangkan 





 



























      createdAt: /* @__PURE__ */ new Date()
    };
    this.admins.push(adminCredentials);

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
      updatedAt: /* @__PURE__ */ new Date()
    };

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
      updatedAt: /* @__PURE__ */ new Date()
    };

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
  async getVisitorCount() {
    return this.visitorCount;
  }

  async incrementVisitorCount() {
    this.visitorCount += 1;
    return this.visitorCount;
  }

  // Admin methods
  async createAdmin(data) {
    const existingAdmin = await this.getAdminByUsername(data.username);
    if (existingAdmin) {
      throw new Error("Admin with this username already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const admin = {
      id: this.nextAdminId++,
      username: data.username,
      password: hashedPassword,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.admins.push(admin);
    return { ...admin, password: "[HIDDEN]" };
  }

  async getAdminByUsername(username) {
    const admin = this.admins.find((a) => a.username === username);
    return admin || null;
  }

  async validateAdmin(credentials) {
    const admin = await this.getAdminByUsername(credentials.username);
    if (!admin) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(credentials.password, admin.password);
    if (!isValidPassword) {
      return null;
    }
    return { ...admin, password: "[HIDDEN]" };
  }

  // Analytics methods
  async recordPageView(pageView) {
    const existingPageView = this.analytics.find((a) => a.pageView === pageView);
    if (existingPageView) {
      existingPageView.count += 1;
      return existingPageView;
    }
    const newPageView = {
      id: this.nextAnalyticsId++,
      pageView,
      count: 1,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.analytics.push(newPageView);
    return newPageView;
  }

  async getPageViews() {
    return this.analytics;
  }

  async getTopPageViews(limit) {
    return [...this.analytics].sort((a, b) => b.count - a.count).slice(0, limit);
  }

  // Website Settings methods
  async getWebsiteSettings() {
    return this.websiteSettings;
  }

  async updateWebsiteSettings(data) {
    this.websiteSettings = {
      ...this.websiteSettings,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.websiteSettings;
  }

  // Personal Info methods
  async getPersonalInfo() {
    return this.personalInfo;
  }

  async updatePersonalInfo(data) {
    this.personalInfo = {
      ...this.personalInfo,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.personalInfo;
  }

  // Social Links methods
  async getSocialLinks() {
    return [...this.socialLinks].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getSocialLinkById(id) {
    const socialLink = this.socialLinks.find((s) => s.id === id);
    return socialLink || null;
  }

  async createSocialLink(data) {
    const socialLink = {
      id: this.nextSocialLinkId++,
      platform: data.platform,
      url: data.url,
      icon: data.icon,
      displayOrder: data.displayOrder || 0,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.socialLinks.push(socialLink);
    return socialLink;
  }

  async updateSocialLink(id, data) {
    const index = this.socialLinks.findIndex((s) => s.id === id);
    if (index === -1) {
      return null;
    }
    this.socialLinks[index] = {
      ...this.socialLinks[index],
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.socialLinks[index];
  }

  async deleteSocialLink(id) {
    const initialLength = this.socialLinks.length;
    this.socialLinks = this.socialLinks.filter((s) => s.id !== id);
    return initialLength > this.socialLinks.length;
  }

  // Projects methods
  async getProjects() {
    return [...this.projects].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getProjectById(id) {
    const project = this.projects.find((p) => p.id === id);
    return project || null;
  }

  async createProject(data) {
    const project = {
      id: this.nextProjectId++,
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl || "",
      projectUrl: data.projectUrl || "",
      githubUrl: data.githubUrl || "",
      technologies: data.technologies || "",
      featured: data.featured || false,
      displayOrder: data.displayOrder || 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.push(project);
    return project;
  }

  async updateProject(id, data) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    this.projects[index] = {
      ...this.projects[index],
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.projects[index];
  }

  async deleteProject(id) {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    return initialLength > this.projects.length;
  }

  async getFeaturedProjects() {
    return this.projects.filter((p) => p.featured);
  }

  // Skills methods
  async getSkills() {
    return [...this.skills].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getSkillsByCategory(category) {
    return this.skills.filter((s) => s.category === category).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getSkillById(id) {
    const skill = this.skills.find((s) => s.id === id);
    return skill || null;
  }

  async createSkill(data) {
    const skill = {
      id: this.nextSkillId++,
      name: data.name,
      category: data.category || "frontend",
      proficiency: data.proficiency || 80,
      icon: data.icon || "",
      displayOrder: data.displayOrder || 0,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.skills.push(skill);
    return skill;
  }

  async updateSkill(id, data) {
    const index = this.skills.findIndex((s) => s.id === id);
    if (index === -1) {
      return null;
    }
    this.skills[index] = {
      ...this.skills[index],
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    return this.skills[index];
  }

  async deleteSkill(id) {
    const initialLength = this.skills.length;
    this.skills = this.skills.filter((s) => s.id !== id);
    return initialLength > this.skills.length;
  }
}

const storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  count: integer("count").notNull().default(0)
});
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  pageView: varchar("page_view", { length: 100 }).notNull(),
  count: integer("count").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});
var websiteSettings = pgTable("website_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 100 }).notNull().default("Aka's Portfolio"),
  siteDescription: text("site_description").notNull().default("Professional Portfolio for Aka - Junior Developer from Indonesia"),
  siteKeywords: text("site_keywords").notNull().default("developer, portfolio, indonesia, javascript, react"),
  logoUrl: text("logo_url").default(""),
  faviconUrl: text("favicon_url").default(""),
  primaryColor: varchar("primary_color", { length: 20 }).default("#0f172a"),
  // Navy
  accentColor: varchar("accent_color", { length: 20 }).default("#a48111"),
  // Gold
  fontPrimary: varchar("font_primary", { length: 50 }).default("Playfair Display"),
  fontSecondary: varchar("font_secondary", { length: 50 }).default("Poppins"),
  showMusicPlayer: boolean("show_music_player").default(true),
  musicUrl: text("music_url").default("https://cdn.xtermai.xyz/FYDux.mp3"),
  enableAnimation: boolean("enable_animation").default(true),
  animationIntensity: varchar("animation_intensity", { length: 20 }).default("medium"),
  // low, medium, high
  updatedAt: timestamp("updated_at").defaultNow()
});
var personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().default("Aka"),
  title: varchar("title", { length: 100 }).notNull().default("Junior Developer"),
  bio: text("bio").notNull().default("15-year-old junior developer from West Sumatra, Indonesia"),
  location: varchar("location", { length: 100 }).default("West Sumatra, Indonesia"),
  email: varchar("email", { length: 100 }).default("aka@example.com"),
  phone: varchar("phone", { length: 30 }).default("+62 123 4567 890"),
  avatarUrl: text("avatar_url").default(""),
  resumeUrl: text("resume_url").default(""),
  updatedAt: timestamp("updated_at").defaultNow()
});
var socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(),
  // github, linkedin, twitter, etc.
  url: text("url").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  // Font Awesome class
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var projects = pgTable("projects", {
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
  updatedAt: timestamp("updated_at").defaultNow()
});
var skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull().default("frontend"),
  // frontend, backend, tools, etc.
  proficiency: integer("proficiency").notNull().default(80),
  // 0-100
  icon: varchar("icon", { length: 50 }).default(""),
  // Font Awesome or custom icon class
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true
});
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true
});
var insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true
});
var insertWebsiteSettingsSchema = createInsertSchema(websiteSettings).omit({
  id: true,
  updatedAt: true
});
var insertPersonalInfoSchema = createInsertSchema(personalInfo).omit({
  id: true,
  updatedAt: true
});
var insertSocialLinkSchema = createInsertSchema(socialLinks).omit({
  id: true,
  updatedAt: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  updatedAt: true
});
var loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

// server/routes.ts
var isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
var recordPageView = async (req, res, next) => {
  try {
    const path3 = req.path;
    if (!path3.includes("/api/") && !path3.endsWith(".js") && !path3.endsWith(".css")) {
      await storage.recordPageView(path3);
    }
  } catch (error) {
    console.error("Failed to record page view:", error);
  }
  next();
};
async function registerRoutes(app2) {
  app2.use(recordPageView);
  app2.get("/api/visitors", async (req, res) => {
    try {
      const count = await storage.getVisitorCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get visitor count" });
    }
  });
  app2.post("/api/visitors/increment", async (req, res) => {
    try {
      const newCount = await storage.incrementVisitorCount();
      res.json({ count: newCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment visitor count" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const admin = await storage.validateAdmin(result.data);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.admin = admin;
      res.json({ message: "Login successful", admin });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  app2.post("/api/admin/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logout successful" });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to logout" });
    }
  });
  app2.get("/api/admin/analytics", isAuthenticated, async (req, res) => {
    try {
      const pageViews = await storage.getPageViews();
      res.json({ pageViews });
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });
  app2.get("/api/admin/analytics/top", isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const topPageViews = await storage.getTopPageViews(limit);
      res.json({ topPageViews });
    } catch (error) {
      res.status(500).json({ message: "Failed to get top page views" });
    }
  });
  app2.get("/api/admin/check", async (req, res) => {
    try {
      if (req.session && req.session.admin) {
        return res.json({ authenticated: true, admin: req.session.admin });
      }
      res.json({ authenticated: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to check authentication" });
    }
  });
  app2.get("/api/website-settings", async (req, res) => {
    try {
      const settings = await storage.getWebsiteSettings();
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ message: "Failed to get website settings" });
    }
  });
  app2.put("/api/admin/website-settings", isAuthenticated, async (req, res) => {
    try {
      const result = insertWebsiteSettingsSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const updatedSettings = await storage.updateWebsiteSettings(result.data);
      res.json({ message: "Website settings updated successfully", settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Failed to update website settings" });
    }
  });
  app2.get("/api/personal-info", async (req, res) => {
    try {
      const info = await storage.getPersonalInfo();
      res.json({ info });
    } catch (error) {
      res.status(500).json({ message: "Failed to get personal info" });
    }
  });
  app2.put("/api/admin/personal-info", isAuthenticated, async (req, res) => {
    try {
      const result = insertPersonalInfoSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const updatedInfo = await storage.updatePersonalInfo(result.data);
      res.json({ message: "Personal info updated successfully", info: updatedInfo });
    } catch (error) {
      res.status(500).json({ message: "Failed to update personal info" });
    }
  });
  app2.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json({ links });
    } catch (error) {
      res.status(500).json({ message: "Failed to get social links" });
    }
  });
  app2.post("/api/admin/social-links", isAuthenticated, async (req, res) => {
    try {
      const result = insertSocialLinkSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const newLink = await storage.createSocialLink(result.data);
      res.status(201).json({ message: "Social link created successfully", link: newLink });
    } catch (error) {
      res.status(500).json({ message: "Failed to create social link" });
    }
  });
  app2.put("/api/admin/social-links/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertSocialLinkSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const updatedLink = await storage.updateSocialLink(id, result.data);
      if (!updatedLink) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json({ message: "Social link updated successfully", link: updatedLink });
    } catch (error) {
      res.status(500).json({ message: "Failed to update social link" });
    }
  });
  app2.delete("/api/admin/social-links/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSocialLink(id);
      if (!success) {
        return res.status(404).json({ message: "Social link not found" });
      }
      res.json({ message: "Social link deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social link" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json({ projects: projects2 });
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });
  app2.get("/api/projects/featured", async (req, res) => {
    try {
      const featuredProjects = await storage.getFeaturedProjects();
      res.json({ projects: featuredProjects });
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ project });
    } catch (error) {
      res.status(500).json({ message: "Failed to get project" });
    }
  });
  app2.post("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const newProject = await storage.createProject(result.data);
      res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  app2.put("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertProjectSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const updatedProject = await storage.updateProject(id, result.data);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project updated successfully", project: updatedProject });
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  app2.delete("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  app2.get("/api/skills", async (req, res) => {
    try {
      const skills2 = await storage.getSkills();
      res.json({ skills: skills2 });
    } catch (error) {
      res.status(500).json({ message: "Failed to get skills" });
    }
  });
  app2.get("/api/skills/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const skills2 = await storage.getSkillsByCategory(category);
      res.json({ skills: skills2 });
    } catch (error) {
      res.status(500).json({ message: "Failed to get skills by category" });
    }
  });
  app2.get("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skill = await storage.getSkillById(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json({ skill });
    } catch (error) {
      res.status(500).json({ message: "Failed to get skill" });
    }
  });
  app2.post("/api/admin/skills", isAuthenticated, async (req, res) => {
    try {
      const result = insertSkillSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const newSkill = await storage.createSkill(result.data);
      res.status(201).json({ message: "Skill created successfully", skill: newSkill });
    } catch (error) {
      res.status(500).json({ message: "Failed to create skill" });
    }
  });
  app2.put("/api/admin/skills/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertSkillSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      const updatedSkill = await storage.updateSkill(id, result.data);
      if (!updatedSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json({ message: "Skill updated successfully", skill: updatedSkill });
    } catch (error) {
      res.status(500).json({ message: "Failed to update skill" });
    }
  });
  app2.delete("/api/admin/skills/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSkill(id);
      if (!success) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
var sessionStore = MemoryStore(session);
app.use(session({
  secret: "akaanakbaik-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  },
  store: new sessionStore({
    checkPeriod: 864e5
    // 24 hours
  })
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
