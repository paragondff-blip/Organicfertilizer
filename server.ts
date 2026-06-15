import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Biscuit Store API is healthy" });
  });

  // Proxy for Gemini AI (if needed)
  app.post("/api/ai/recommendations", async (req, res) => {
    // Potential implementation for smart recommendations
    res.json({ recommendations: [] });
  });

  // Admin Seeding Route (In-app trigger)
  app.post("/api/admin/seed", async (req, res) => {
    // This would typically involve firebase-admin to seed Firestore
    // For now, it's a placeholder for the seed logic
    res.json({ status: "success", message: "Seeding logic triggered" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
