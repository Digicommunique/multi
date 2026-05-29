import { ShoppingBasket, Apple, Milk, Coffee, User, Smartphone, Home } from 'lucide-react';

export const BRANCHES = [
  { id: "br-1", name: "Downtown Mart", address: "123 Main St, Central", city: "Metropolis", location: { lat: 40.7128, lng: -74.0060 }, deliveryRadius: 5 },
  { id: "br-2", name: "Westside Hub", address: "456 West Ave, Suburbia", city: "Metropolis", location: { lat: 40.7589, lng: -73.9851 }, deliveryRadius: 8 },
  { id: "br-3", name: "North Park Station", address: "789 North Dr, Gardens", city: "Metropolis", location: { lat: 40.8506, lng: -73.9352 }, deliveryRadius: 4 },
];

export const CATEGORIES = [
  { id: "cat-1", name: "Grocery", icon: "ShoppingBasket" },
  { id: "cat-2", name: "Fruits & Veggies", icon: "Apple" },
  { id: "cat-3", name: "Dairy & Bakery", icon: "Milk" },
  { id: "cat-4", name: "Beverages", icon: "Coffee" },
  { id: "cat-5", name: "Personal Care", icon: "User" },
  { id: "cat-6", name: "Electronics", icon: "Smartphone" },
  { id: "cat-7", name: "Household", icon: "Home" },
];

export const PRODUCTS = [
  { id: "p1", name: "Premium Basmati Rice", price: 1250, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", category: "cat-1", brand: "Harvest Gold", unit: "5kg", stock: 50 },
  { id: "p2", name: "Organic Brown Sugar", price: 450, image: "https://images.unsplash.com/photo-1622340322744-9387f34085e7?w=400&q=80", category: "cat-1", brand: "EcoPure", unit: "1kg", stock: 30 },
  { id: "p3", name: "Fresh Royal Gala Apples", price: 399, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=400&q=80", category: "cat-2", brand: "FarmDirect", unit: "1kg", stock: 100 },
  { id: "p4", name: "Organic Hass Avocado", price: 250, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80", category: "cat-2", brand: "NatureBloom", unit: "1pc", stock: 45 },
  { id: "p5", name: "Full Cream Milk", price: 180, image: "https://images.unsplash.com/photo-1550583724-1255818c0533?w=400&q=80", category: "cat-3", brand: "DairyFresh", unit: "1L", stock: 80 },
  { id: "p6", name: "Artisanal Sourdough Bread", price: 525, image: "https://images.unsplash.com/photo-1585478286653-ef3707f1523e?w=400&q=80", category: "cat-3", brand: "Baker's Pride", unit: "500g", stock: 20 },
  { id: "p7", name: "Cold Brew Coffee", price: 400, image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&q=80", category: "cat-4", brand: "BrewMaster", unit: "250ml", stock: 60 },
  { id: "p8", name: "Green Tea Multipack", price: 650, image: "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400&q=80", category: "cat-4", brand: "ZenLeaf", unit: "20 bags", stock: 40 },
  { id: "p9", name: "Organic Bananas", price: 80, image: "https://images.unsplash.com/photo-1603833665858-e81b1c7e4460?w=400&q=80", category: "cat-2", brand: "FarmDirect", unit: "1kg", stock: 120 },
  { id: "p10", name: "Dark Chocolate 70%", price: 299, image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80", category: "cat-1", brand: "CocoaGolds", unit: "100g", stock: 75 },
  { id: "p11", name: "Wireless Headphones", price: 2499, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", category: "cat-6", brand: "AudioZen", unit: "1pc", stock: 15 },
  { id: "p12", name: "Smart Watch S3", price: 5999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", category: "cat-6", brand: "TechCore", unit: "1pc", stock: 10 },
  { id: "p13", name: "Hydrating Shampoo", price: 350, image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80", category: "cat-5", brand: "SilkPro", unit: "400ml", stock: 40 },
  { id: "p14", name: "Charcoal Toothpaste", price: 120, image: "https://images.unsplash.com/photo-1559594861-16383c899060?w=400&q=80", category: "cat-5", brand: "FreshMint", unit: "150g", stock: 85 },
  { id: "p15", name: "Liquid Detergent", price: 499, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80", category: "cat-7", brand: "CleanMax", unit: "2L", stock: 25 },
  { id: "p16", name: "Dishwash Gel Lemon", price: 105, image: "https://images.unsplash.com/photo-1622467827417-30230239634e?w=400&q=80", category: "cat-7", brand: "Sparkle", unit: "500ml", stock: 65 },
];
