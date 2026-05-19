import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock Database
const branches = [
  { id: "br-1", name: "Downtown Mart", address: "123 Main St, Central", city: "Metropolis", location: { lat: 40.7128, lng: -74.0060 }, deliveryRadius: 5 },
  { id: "br-2", name: "Westside Hub", address: "456 West Ave, Suburbia", city: "Metropolis", location: { lat: 40.7589, lng: -73.9851 }, deliveryRadius: 8 },
  { id: "br-3", name: "North Park Station", address: "789 North Dr, Gardens", city: "Metropolis", location: { lat: 40.8506, lng: -73.9352 }, deliveryRadius: 4 },
];

const categories = [
  { id: "cat-1", name: "Grocery", icon: "ShoppingBasket" },
  { id: "cat-2", name: "Fruits & Veggies", icon: "Apple" },
  { id: "cat-3", name: "Dairy & Bakery", icon: "Milk" },
  { id: "cat-4", name: "Beverages", icon: "Coffee" },
  { id: "cat-5", name: "Personal Care", icon: "User" },
  { id: "cat-6", name: "Electronics", icon: "Smartphone" },
  { id: "cat-7", name: "Household", icon: "Home" },
];

const products = [
  // Grocery
  { id: "p1", name: "Premium Basmati Rice", price: 1250, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", category: "cat-1", brand: "Harvest Gold", unit: "5kg", stock: 50 },
  { id: "p2", name: "Organic Brown Sugar", price: 450, image: "https://images.unsplash.com/photo-1622340322744-9387f34085e7?w=400&q=80", category: "cat-1", brand: "EcoPure", unit: "1kg", stock: 30 },
  // Fruits
  { id: "p3", name: "Fresh Royal Gala Apples", price: 399, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=400&q=80", category: "cat-2", brand: "FarmDirect", unit: "1kg", stock: 100 },
  { id: "p4", name: "Organic Hass Avocado", price: 250, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80", category: "cat-2", brand: "NatureBloom", unit: "1pc", stock: 45 },
  // Dairy
  { id: "p5", name: "Full Cream Milk", price: 180, image: "https://images.unsplash.com/photo-1550583724-1255818c0533?w=400&q=80", category: "cat-3", brand: "DairyFresh", unit: "1L", stock: 80 },
  { id: "p6", name: "Artisanal Sourdough Bread", price: 525, image: "https://images.unsplash.com/photo-1585478286653-ef3707f1523e?w=400&q=80", category: "cat-3", brand: "Baker's Pride", unit: "500g", stock: 20 },
  // Beverages
  { id: "p7", name: "Cold Brew Coffee", price: 400, image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&q=80", category: "cat-4", brand: "BrewMaster", unit: "250ml", stock: 60 },
  { id: "p8", name: "Green Tea Multipack", price: 650, image: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400&q=80", category: "cat-4", brand: "ZenLeaf", unit: "20 bags", stock: 40 },
];

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
