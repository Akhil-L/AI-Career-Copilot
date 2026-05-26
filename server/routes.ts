import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./storage";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
      }
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const [user] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
      }).returning();
      req.session.userId = user.id;
      req.session.save((err) => {
  if (err) return res.status(500).json({ error: "Session error" });
  return res.json({ id: user.id, name: user.name, email: user.email });
});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.userId = user.id;
      return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const [user] = await db.select().from(users).where(eq(users.id, req.session.userId));
    if (!user) return res.status(401).json({ error: "User not found" });
    return res.json({ id: user.id, name: user.name, email: user.email });
  });

  app.post("/api/resume/upload", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const chunks: Buffer[] = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const { extractTextFromPDF } = await import("./pdf");
          const text = await extractTextFromPDF(buffer);
          return res.json({ text, length: text.length });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to parse PDF" });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/resume/analyze", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { resumeText } = req.body;
      if (!resumeText) {
        return res.status(400).json({ error: "Resume text required" });
      }
      const { calculateATSScore } = await import("./ats");
      const result = calculateATSScore(resumeText);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  });

  return httpServer;
}