import { 
  ProfileType, 
  ProjectType, 
  FriendType, 
  AdminType, 
  ContactMessageType, 
  InsertContactMessageType 
} from "@shared/schema";
import { hashPassword } from "./utils";

export interface IStorage {
  // Admin functions
  getAdmin(id: number): Promise<AdminType | undefined>;
  getAdminByUsername(username: string): Promise<AdminType | undefined>;
  createAdmin(username: string, password: string): Promise<AdminType>;
  
  // Stats functions
  incrementVisitorCount(): Promise<void>;
  getVisitorCount(): Promise<number>;
  resetVisitorCount(): Promise<void>;
  
  // Profile functions
  getProfile(): Promise<ProfileType | null>;
  updateProfile(profileData: Partial<ProfileType>): Promise<ProfileType>;
  
  // Projects functions
  getProjects(): Promise<ProjectType[]>;
  updateProjects(projects: ProjectType[]): Promise<void>;
  
  // Friends/network functions
  getFriends(): Promise<FriendType[]>;
  updateFriends(friends: FriendType[]): Promise<void>;
  
  // Contact functions
  saveContactMessage(message: InsertContactMessageType): Promise<ContactMessageType>;
  getContactMessages(): Promise<ContactMessageType[]>;
}

export class MemStorage implements IStorage {
  private admins: Map<number, AdminType>;
  private visitorCount: number;
  private profile: ProfileType | null;
  private projects: ProjectType[];
  private friends: FriendType[];
  private contactMessages: ContactMessageType[];
  private currentAdminId: number;
  private currentMessageId: number;

  constructor() {
    this.admins = new Map();
    this.visitorCount = 0;
    this.profile = null;
    this.projects = [];
    this.friends = [];
    this.contactMessages = [];
    this.currentAdminId = 1;
    this.currentMessageId = 1;
    
    // Initialize with default admin account
    this.initializeDefault();
  }

  private async initializeDefault() {
    // Add default admin
    await this.createAdmin("admin", "admin123");
    
    // Add default profile
    this.profile = {
      id: 1,
      name: "John Doe",
      title: "Creative Developer & Designer",
      email: "contact@example.com",
      phone: "+1 (234) 567-890",
      location: "New York, NY, USA",
      tagline: "Welcome to my portfolio",
      description: "I craft stunning digital experiences with modern technologies, focusing on clean design and powerful functionality.",
      aboutText: "I am a passionate web developer with over 5 years of experience creating beautiful, functional, and user-friendly websites. I specialize in front-end development and UI/UX design, with a strong focus on creating seamless user experiences.",
      approachText: "My approach combines technical expertise with creative design principles to deliver websites that not only look amazing but also perform exceptionally well. I'm constantly exploring new technologies and design trends to stay at the cutting edge of web development.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      workspaceImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
      skills: [
        "HTML5 & CSS3",
        "JavaScript",
        "React.js",
        "UI/UX Design",
        "GSAP",
        "Tailwind CSS"
      ],
      socials: [
        { name: "Twitter", url: "#", icon: "fab fa-twitter" },
        { name: "LinkedIn", url: "#", icon: "fab fa-linkedin-in" },
        { name: "GitHub", url: "#", icon: "fab fa-github" },
        { name: "Instagram", url: "#", icon: "fab fa-instagram" },
        { name: "Dribbble", url: "#", icon: "fab fa-dribbble" }
      ]
    };
    
    // Add default projects
    this.projects = [
      {
        id: 1,
        title: "E-commerce Platform",
        description: "A full-featured e-commerce solution with custom animations and seamless checkout experience.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80",
        category: "Web App",
        technologies: ["React", "Node.js", "GSAP"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com"
      },
      {
        id: 2,
        title: "Portfolio Website",
        description: "A premium portfolio website with advanced animations and interactive elements.",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        category: "UI Design",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com"
      },
      {
        id: 3,
        title: "Task Management App",
        description: "A productivity application with clean UI and smooth transitions between screens.",
        image: "https://images.unsplash.com/photo-1551651653-c5dcb914d809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        category: "Mobile App",
        technologies: ["React Native", "Firebase", "Framer Motion"],
        githubUrl: "https://github.com",
        liveUrl: "https://example.com"
      }
    ];
    
    // Add default friends
    this.friends = [
      {
        id: 1,
        name: "Alex Johnson",
        title: "UX Designer",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        website: "https://example.com"
      },
      {
        id: 2,
        name: "Sarah Miller",
        title: "Web Developer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        website: "https://example.com"
      },
      {
        id: 3,
        name: "James Wilson",
        title: "Product Manager",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        website: "https://example.com"
      },
      {
        id: 4,
        name: "Emily Chen",
        title: "UI Designer",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
        website: "https://example.com"
      },
      {
        id: 5,
        name: "David Park",
        title: "Full-stack Developer",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=734&q=80",
        website: "https://example.com"
      }
    ];
  }

  // Admin functions
  async getAdmin(id: number): Promise<AdminType | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<AdminType | undefined> {
    // Convert Map.values() iterator to array to avoid TypeScript errors
    const admins = Array.from(this.admins.values());
    return admins.find(admin => admin.username === username);
  }

  async createAdmin(username: string, password: string): Promise<AdminType> {
    const hashedPassword = await hashPassword(password);
    const id = this.currentAdminId++;
    const admin: AdminType = { id, username, password: hashedPassword };
    this.admins.set(id, admin);
    return admin;
  }

  // Stats functions
  async incrementVisitorCount(): Promise<void> {
    this.visitorCount += 1;
  }

  async getVisitorCount(): Promise<number> {
    return this.visitorCount;
  }

  async resetVisitorCount(): Promise<void> {
    this.visitorCount = 0;
  }

  // Profile functions
  async getProfile(): Promise<ProfileType | null> {
    return this.profile;
  }

  async updateProfile(profileData: Partial<ProfileType>): Promise<ProfileType> {
    if (!this.profile) {
      throw new Error("Profile not initialized");
    }
    
    this.profile = { ...this.profile, ...profileData };
    return this.profile;
  }

  // Projects functions
  async getProjects(): Promise<ProjectType[]> {
    return this.projects;
  }

  async updateProjects(projects: ProjectType[]): Promise<void> {
    this.projects = projects.map((project, index) => ({
      ...project,
      id: index + 1,
    }));
  }

  // Friends/network functions
  async getFriends(): Promise<FriendType[]> {
    return this.friends;
  }

  async updateFriends(friends: FriendType[]): Promise<void> {
    this.friends = friends.map((friend, index) => ({
      ...friend,
      id: index + 1,
    }));
  }

  // Contact functions
  async saveContactMessage(message: InsertContactMessageType): Promise<ContactMessageType> {
    const id = this.currentMessageId++;
    const newMessage: ContactMessageType = {
      id,
      ...message,
      createdAt: new Date(),
      read: false,
    };
    
    this.contactMessages.push(newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessageType[]> {
    return this.contactMessages;
  }
}

export const storage = new MemStorage();
