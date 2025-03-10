import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  loginSchema, 
  insertWebsiteSettingsSchema, 
  insertPersonalInfoSchema,
  insertSocialLinkSchema,
  insertProjectSchema,
  insertSkillSchema
} from "@shared/schema";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore - session is added by express-session
  if (req.session && req.session.admin) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Middleware to record page view
const recordPageView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = req.path;
    if (!path.includes('/api/') && !path.endsWith('.js') && !path.endsWith('.css')) {
      await storage.recordPageView(path);
    }
  } catch (error) {
    console.error('Failed to record page view:', error);
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Add page view tracking middleware
  app.use(recordPageView);
  
  // Visitor counter API endpoint
  app.get("/api/visitors", async (req, res) => {
    try {
      const count = await storage.getVisitorCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to get visitor count" });
    }
  });

  app.post("/api/visitors/increment", async (req, res) => {
    try {
      const newCount = await storage.incrementVisitorCount();
      res.json({ count: newCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment visitor count" });
    }
  });
  
  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input", errors: result.error.format() });
      }
      
      const admin = await storage.validateAdmin(result.data);
      
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      // @ts-ignore - session is added by express-session
      req.session.admin = admin;
      
      res.json({ message: "Login successful", admin });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  app.post("/api/admin/logout", async (req, res) => {
    try {
      // @ts-ignore - session is added by express-session
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logout successful" });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to logout" });
    }
  });
  
  // Admin analytics routes (protected)
  app.get("/api/admin/analytics", isAuthenticated, async (req, res) => {
    try {
      const pageViews = await storage.getPageViews();
      res.json({ pageViews });
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });
  
  app.get("/api/admin/analytics/top", isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const topPageViews = await storage.getTopPageViews(limit);
      res.json({ topPageViews });
    } catch (error) {
      res.status(500).json({ message: "Failed to get top page views" });
    }
  });
  
  // Check if admin is authenticated
  app.get("/api/admin/check", async (req, res) => {
    try {
      // @ts-ignore - session is added by express-session
      if (req.session && req.session.admin) {
        // @ts-ignore - session is added by express-session
        return res.json({ authenticated: true, admin: req.session.admin });
      }
      res.json({ authenticated: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to check authentication" });
    }
  });

  // Website Settings API Endpoints (Protected)
  app.get("/api/website-settings", async (req, res) => {
    try {
      const settings = await storage.getWebsiteSettings();
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ message: "Failed to get website settings" });
    }
  });

  app.put("/api/admin/website-settings", isAuthenticated, async (req, res) => {
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

  // Personal Info API Endpoints (Protected)
  app.get("/api/personal-info", async (req, res) => {
    try {
      const info = await storage.getPersonalInfo();
      res.json({ info });
    } catch (error) {
      res.status(500).json({ message: "Failed to get personal info" });
    }
  });

  app.put("/api/admin/personal-info", isAuthenticated, async (req, res) => {
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

  // Social Links API Endpoints (Protected for writes)
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json({ links });
    } catch (error) {
      res.status(500).json({ message: "Failed to get social links" });
    }
  });

  app.post("/api/admin/social-links", isAuthenticated, async (req, res) => {
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

  app.put("/api/admin/social-links/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/admin/social-links/:id", isAuthenticated, async (req, res) => {
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

  // Projects API Endpoints (Protected for writes)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const featuredProjects = await storage.getFeaturedProjects();
      res.json({ projects: featuredProjects });
    } catch (error) {
      res.status(500).json({ message: "Failed to get featured projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
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

  app.post("/api/admin/projects", isAuthenticated, async (req, res) => {
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

  app.put("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/admin/projects/:id", isAuthenticated, async (req, res) => {
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

  // Skills API Endpoints (Protected for writes)
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json({ skills });
    } catch (error) {
      res.status(500).json({ message: "Failed to get skills" });
    }
  });

  app.get("/api/skills/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const skills = await storage.getSkillsByCategory(category);
      res.json({ skills });
    } catch (error) {
      res.status(500).json({ message: "Failed to get skills by category" });
    }
  });

  app.get("/api/skills/:id", async (req, res) => {
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

  app.post("/api/admin/skills", isAuthenticated, async (req, res) => {
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

  app.put("/api/admin/skills/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/admin/skills/:id", isAuthenticated, async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
