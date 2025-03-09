import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword } from "./utils";
import MemoryStore from "memorystore";

// Create memory store for sessions
const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portfolio-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const admin = await storage.getAdminByUsername(username);
        if (!admin) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    })
  );
  
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const admin = await storage.getAdmin(id);
      done(null, admin);
    } catch (error) {
      done(error);
    }
  });
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // Track visitor
  app.post("/api/stats/visit", async (req, res) => {
    try {
      await storage.incrementVisitorCount();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track visit" });
    }
  });
  
  // Get visitor stats
  app.get("/api/stats", async (req, res) => {
    try {
      const visitorCount = await storage.getVisitorCount();
      res.status(200).json({ visitorCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to get stats" });
    }
  });
  
  // Get profile data
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile data" });
    }
  });
  
  // Get projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to get projects" });
    }
  });
  
  // Get friends/network
  app.get("/api/friends", async (req, res) => {
    try {
      const friends = await storage.getFriends();
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ error: "Failed to get friends data" });
    }
  });
  
  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      await storage.saveContactMessage({ name, email, subject, message });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save contact message" });
    }
  });
  
  // ===== Admin routes =====
  
  // Login route
  app.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json({ success: true });
  });
  
  // Logout route
  app.post("/api/admin/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ success: true });
    });
  });
  
  // Check authentication status
  app.get("/api/admin/check-auth", (req, res) => {
    res.status(200).json({ authenticated: req.isAuthenticated() });
  });
  
  // Get admin stats
  app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
    try {
      const visitorCount = await storage.getVisitorCount();
      const messages = await storage.getContactMessages();
      
      res.status(200).json({
        visitorCount,
        messageCount: messages.length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get admin stats" });
    }
  });
  
  // Reset visitor count
  app.post("/api/admin/reset-visitors", isAuthenticated, async (req, res) => {
    try {
      await storage.resetVisitorCount();
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset visitor count" });
    }
  });
  
  // Update profile
  app.post("/api/admin/profile", isAuthenticated, async (req, res) => {
    try {
      await storage.updateProfile(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  // Update projects
  app.post("/api/admin/projects", isAuthenticated, async (req, res) => {
    try {
      await storage.updateProjects(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update projects" });
    }
  });
  
  // Update friends
  app.post("/api/admin/friends", isAuthenticated, async (req, res) => {
    try {
      await storage.updateFriends(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update friends" });
    }
  });
  
  // Get contact messages
  app.get("/api/admin/messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
