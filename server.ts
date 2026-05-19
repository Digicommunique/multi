import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";
import { BRANCHES, CATEGORIES, PRODUCTS } from "./src/constants";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock Database
const branches = BRANCHES;
const categories = CATEGORIES;
const products = PRODUCTS;

const orders: any[] = [];

// Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/branches", (req, res) => {
  res.json(branches);
});

app.get("/api/categories", (req, res) => {
  res.json(categories);
});

app.get("/api/products", (req, res) => {
  const { categoryId, branchId } = req.query;
  let filtered = products;
  if (categoryId) filtered = filtered.filter(p => p.category === categoryId);
  // In a real app, products would vary by branch. For now, we return all.
  res.json(filtered);
});

app.post("/api/orders", (req, res) => {
  const order = {
    ...req.body,
    id: `ord-${Math.random().toString(36).substr(2, 9)}`,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.json(order);
});

app.get("/api/admin/stats", (req, res) => {
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  res.json({
    totalSales,
    todayOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    branchPerformance: branches.map(b => ({
      name: b.name,
      sales: orders.filter(o => o.branchId === b.id).reduce((sum, o) => sum + o.total, 0)
    }))
  });
});

app.post("/api/ai/search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  try {
    const prompt = `You are a shopping assistant for "Martly", a multi-branch shopping app. 
    User is searching for: "${query}".
    Based on the following product catalog, suggest the most relevant product IDs and a brief helpful message.
    
    Catalog:
    ${products.map(p => `- ID: ${p.id}, Name: ${p.name}, Category: ${p.category}`).join("\n")}
    
    Return JSON only: { "suggestions": ["p1", "p2"], "message": "Here are some items you might like!" }`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: "AI search failed" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
