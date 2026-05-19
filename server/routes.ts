import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./storage";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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
      return res.json({ id: user.id, name: user.name, email: user.email });
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

  return httpServer;
}