/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBasket, 
  Search, 
  MapPin, 
  User, 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  ChevronRight,
  TrendingUp,
  Package,
  Clock,
  LayoutDashboard,
  Apple,
  Milk,
  Coffee,
  Smartphone,
  Home,
  CheckCircle2,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Award,
  Truck,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch, Category, Product, CartItem, Order, AdminStats } from './types';

// Icon Map for Categories
const ICON_MAP: Record<string, any> = {
  ShoppingBasket, Apple, Milk, Coffee, User, Smartphone, Home
};

export default function App() {
  const [view, setView] = useState<'shop' | 'admin'>('shop');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    const saved = localStorage.getItem('martly_branch');
    return saved ? JSON.parse(saved) : null;
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('martly_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('martly_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('martly_branch', JSON.stringify(selectedBranch));
    }
  }, [selectedBranch]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchBranches(), fetchCategories()]);
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchProducts();
    }
  }, [selectedBranch, selectedCategory]);

  useEffect(() => {
    if (view === 'admin') {
      fetchAdminStats();
    }
  }, [view]);

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      if (!res.ok) throw new Error('API Sync Failed');
      const data = await res.json();
      setBranches(data);
      if (data.length > 0) setSelectedBranch(data[0]);
    } catch (err) {
      console.error("Connectivity issue:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('API Sync Failed');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Connectivity issue:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const url = new URL('/api/products', window.location.origin);
      if (selectedCategory) url.searchParams.append('categoryId', selectedCategory);
      if (selectedBranch) url.searchParams.append('branchId', selectedBranch.id);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('API Sync Failed');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Connectivity issue:", err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('API Sync Failed');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Connectivity issue:", err);
    }
  };

  const handleAiSearch = async () => {
    if (!searchQuery) return;
    const res = await fetch('/api/ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    });
    const data = await res.json();
    if (data.suggestions) {
      setAiSuggestions(data.suggestions);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    if (!selectedBranch) return;
    setIsOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: subtotal + 20, // plus delivery in ₹
          branchId: selectedBranch.id
        })
      });
      await res.json();
      setCart([]);
      setIsCartOpen(false);
      setOrderComplete(true);
      setTimeout(() => setOrderComplete(false), 5000);
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (aiSuggestions.length > 0 && searchQuery) {
      return products.filter(p => aiSuggestions.includes(p.id));
    }
    if (searchQuery) {
      return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return products;
  }, [products, searchQuery, aiSuggestions]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex cursor-pointer flex-col" onClick={() => {
              setView('shop');
              setSelectedCategory(null);
              setSearchQuery('');
              setAiSuggestions([]);
            }}>
              <div className="text-2xl font-black tracking-tighter text-brand-navy">MART.OS</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Enterprise Edition</div>
            </div>

            {/* Branch Selector */}
            {view === 'shop' && (
              <div className="hidden items-center gap-3 rounded-lg bg-slate-100 px-4 py-2 md:flex">
                <MapPin className="h-4 w-4 text-slate-400" />
                <select 
                  className="bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none"
                  value={selectedBranch?.id || ''}
                  onChange={(e) => setSelectedBranch(branches.find(b => b.id === e.target.value) || null)}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {view === 'shop' && (
            <div className="relative mx-4 flex-1 max-w-md hidden sm:block">
              <input
                type="text"
                placeholder="SEARCH SKU, ORDER, PRODUCT..."
                className="w-full rounded-full border-none bg-slate-100 py-2.5 pl-11 pr-4 text-xs font-bold uppercase tracking-widest placeholder:text-slate-400 focus:ring-2 focus:ring-brand-green focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-brand-navy text-brand-green shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
              onClick={() => setView(view === 'shop' ? 'admin' : 'shop')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:block">Operator</span>
            </button>
            <button className="relative rounded-lg bg-slate-100 p-2.5 text-brand-navy hover:bg-slate-200" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-black text-brand-navy border-2 border-white">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-green"></div>
          </div>
        )}
        
        {!isLoading && orderComplete && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex items-center justify-between rounded-2xl bg-brand-green p-5 text-brand-navy shadow-xl shadow-green-200/50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-black/10 p-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Logistics Update</div>
                <div className="text-sm font-black uppercase tracking-tight">Order deployed. Estimated T-Minus 12 minutes.</div>
              </div>
            </div>
            <button onClick={() => setOrderComplete(false)} className="rounded-lg p-2 hover:bg-black/5 opacity-40"><X className="h-4 w-4" /></button>
          </motion.div>
        )}

        {view === 'shop' ? (
          <>
            {/* Hero Section */}
            {!selectedCategory && !searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-12 overflow-hidden rounded-[32px] bg-brand-navy p-8 h-[300px] flex flex-col justify-center sm:p-12"
              >
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-l from-brand-green/30 to-transparent" />
                  <ShoppingBasket className="absolute -right-8 top-1/2 -translate-y-1/2 h-64 w-64 rotate-12" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-green/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-green border border-brand-green/30">
                    <Clock className="h-3 w-3" />
                    Ultrafast Delivery
                  </div>
                  <h1 className="mb-4 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
                    Groceries in <span className="text-brand-green">12 Minutes</span>.
                  </h1>
                  <p className="mb-8 text-sm font-medium text-slate-400 max-w-md">
                    Fresh produce, household essentials, and electronics delivered 
                    from your local Mumbai hubs before your coffee gets cold.
                  </p>
                  <div className="flex gap-4">
                    <button className="rounded-2xl bg-brand-green px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-navy shadow-lg shadow-green-400/20 active:scale-95 transition-transform">
                      Order Now
                    </button>
                    <button className="rounded-2xl border-2 border-slate-700 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                      View Offers
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sub-Banners */}
            {!selectedCategory && !searchQuery && (
              <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-3xl bg-amber-100 p-8 flex items-center justify-between border border-amber-200">
                  <div className="z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Seasonal Collection</div>
                    <h3 className="text-2xl font-black text-amber-900 mb-4">Summer Fruits</h3>
                    <button className="flex items-center gap-2 text-xs font-black uppercase text-amber-900">
                      Shop Now <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <Apple className="h-20 w-20 text-amber-300 absolute -right-4 -bottom-4 rotate-12 transition-transform group-hover:scale-125" />
                </div>
                <div className="group relative overflow-hidden rounded-3xl bg-blue-100 p-8 flex items-center justify-between border border-blue-200">
                  <div className="z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-1">Tech Express</div>
                    <h3 className="text-2xl font-black text-blue-900 mb-4">Mobile Hub</h3>
                    <button className="flex items-center gap-2 text-xs font-black uppercase text-blue-900">
                      Explore <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <Smartphone className="h-20 w-20 text-blue-300 absolute -right-4 -bottom-4 rotate-12 transition-transform group-hover:scale-125" />
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="mb-12 overflow-x-auto pb-4 scrollbar-none">
              <div className="flex gap-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`group relative flex min-w-[100px] flex-col items-center gap-3 transition-all`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-3xl transition-all shadow-sm ${!selectedCategory ? 'bg-brand-navy text-brand-green shadow-xl shadow-slate-200' : 'bg-white border border-slate-200 group-hover:border-brand-green'}`}>
                    <Package className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${!selectedCategory ? 'text-brand-navy' : 'text-slate-400'}`}>All SKU</span>
                </button>
                {categories.map(cat => {
                  const IconComp = ICON_MAP[cat.icon] || ShoppingBasket;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="group relative flex min-w-[100px] flex-col items-center gap-3 transition-all"
                    >
                      <div className={`flex h-16 w-16 items-center justify-center rounded-3xl transition-all shadow-sm ${selectedCategory === cat.id ? 'bg-brand-navy text-brand-green shadow-xl shadow-slate-200' : 'bg-white border border-slate-200 group-hover:border-brand-green'}`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${selectedCategory === cat.id ? 'text-brand-navy' : 'text-slate-400'}`}>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-4 transition-all hover:shadow-2xl hover:shadow-slate-200/60"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-slate-400 backdrop-blur-sm">
                      {product.unit}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="mb-1 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{product.brand}</div>
                    <h3 className="line-clamp-1 text-sm font-bold tracking-tight text-brand-navy mb-4">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-black tracking-tighter text-brand-navy">₹{product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="rounded-xl bg-brand-green px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brand-navy shadow-lg shadow-green-100 transition-all hover:scale-105 active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32">
                <Search className="h-16 w-16 mb-6 text-slate-200" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Inventory Sync Fault: Zero Results</p>
              </div>
            )}

            {/* Brands Marquee */}
            {!selectedCategory && !searchQuery && (
              <div className="mt-20 border-y border-slate-100 py-10">
                <div className="text-center mb-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Global Partners</div>
                  <h2 className="text-2xl font-black tracking-tighter text-brand-navy">Trusted by Industry Titans</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="text-xl font-black tracking-tighter">APPLE</div>
                  <div className="text-xl font-black tracking-tighter">NESTLE</div>
                  <div className="text-xl font-black tracking-tighter">PEPSICO</div>
                  <div className="text-xl font-black tracking-tighter">PROCTER & GAMBLE</div>
                  <div className="text-xl font-black tracking-tighter">HUL</div>
                  <div className="text-xl font-black tracking-tighter">SAMSUNG</div>
                </div>
              </div>
            )}

            {/* Value Props Section */}
            {!selectedCategory && !searchQuery && (
              <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <ValueCard icon={<Truck />} title="Zero Lag Delivery" desc="Proprietary logistics engine ensures <12 min delivery." />
                <ValueCard icon={<ShieldCheck />} title="Verified Quality" desc="Every SKU passes a rigorous 15-point audit." />
                <ValueCard icon={<Award />} title="Direct Supply" desc="Straight from manufacturers to our hubs." />
                <ValueCard icon={<Leaf />} title="Eco Logistics" desc="100% EV fleet for carbon-neutral transport." />
              </div>
            )}

            {/* Newsletter Section */}
            {!selectedCategory && !searchQuery && (
              <div className="mt-32 rounded-[40px] bg-brand-navy p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                   <div className="absolute top-0 left-1/4 w-px h-full bg-white" />
                   <div className="absolute top-0 right-1/4 w-px h-full bg-white" />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                   <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-green">Inteligence Network</div>
                   <h2 className="text-4xl font-black tracking-tighter text-white mb-6">Gain the Tactical Edge</h2>
                   <p className="text-slate-400 mb-8 font-medium">Join 50,000+ users receiving exclusive drop alerts and stock updates directly to their hub.</p>
                   <div className="flex max-w-md mx-auto gap-3">
                      <input 
                        type="email" 
                        placeholder="TERMINAL@EMAIL.COM" 
                        className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-brand-green"
                      />
                      <button className="rounded-2xl bg-brand-green px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-navy active:scale-95 transition-transform">
                        Sync
                      </button>
                   </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Admin View */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <header className="flex items-end justify-between">
               <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Central Intelligence</div>
                  <h1 className="text-5xl font-black tracking-tighter text-brand-navy">Dashboard</h1>
               </div>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2 rounded bg-brand-green/20 px-3 py-1 text-[10px] font-black uppercase text-brand-green">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
                    Network Active
                  </div>
               </div>
            </header>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Daily Revenue" value={`₹${stats?.totalSales.toFixed(2)}`} icon={<TrendingUp className="text-emerald-500" />} change="↑ 14.2%" />
              <StatCard title="Active Orders" value={stats?.todayOrders.toString() || '0'} icon={<ShoppingCart className="text-blue-500" />} change="+5" />
              <StatCard title="Rider Fleet" value="482" icon={<Package className="text-orange-500" />} change="88% UTIL" />
              <StatCard title="Stock Alerts" value={stats?.pendingOrders.toString() || '0'} icon={<Clock className="text-rose-500" />} />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/30">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Branch Performance Metrics</h2>
                  <button className="text-[10px] font-black uppercase tracking-widest text-brand-green">Full Audit</button>
                </div>
                <div className="space-y-8">
                  {stats?.branchPerformance.map(branch => (
                    <div key={branch.name} className="flex flex-col gap-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">{branch.name}</div>
                          <div className="text-2xl font-black tracking-tighter text-brand-navy">₹{branch.sales.toFixed(2)}</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Target: ₹1L</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (branch.sales / (stats.totalSales || 1)) * 100)}%` }}
                          className="h-full bg-brand-navy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-3xl bg-brand-green p-8 text-brand-navy shadow-xl shadow-green-200">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Inventory Sync</div>
                  <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                           <span>Grocery & FMCG</span>
                           <span>98.2%</span>
                        </div>
                        <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                          <div className="w-[98%] h-full bg-black" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                           <span>Electronics & Apparal</span>
                           <span>64.5%</span>
                        </div>
                        <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                          <div className="w-[64%] h-full bg-black" />
                        </div>
                    </div>
                  </div>
                  <button className="mt-8 w-full rounded-2xl bg-brand-navy py-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-green transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/20">
                    Manual Audit Run
                  </button>
                </div>
                
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Action Command</div>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center gap-3 rounded-2xl bg-slate-100 p-6 transition-all hover:bg-slate-200">
                        <Plus className="text-brand-navy" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">New SKU</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 rounded-2xl bg-slate-100 p-6 transition-all hover:bg-slate-200">
                        <MapPin className="text-brand-navy" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Add Hub</span>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-slate-200 bg-white pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-20">
            <div>
              <div className="text-2xl font-black tracking-tighter text-brand-navy mb-4">MART.OS</div>
              <p className="text-sm font-medium text-slate-500 mb-6 max-w-xs">
                The next-generation hyperlocal fulfillment operating system. 
                Redefining speed, scale, and supply chain integrity.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Twitter />} />
                <SocialIcon icon={<Facebook />} />
                <SocialIcon icon={<Instagram />} />
                <SocialIcon icon={<Youtube />} />
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Operations</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-brand-navy/60 hover:text-brand-navy transition-colors">
                <li><a href="#">Active Hubs</a></li>
                <li><a href="#">Delivery Fleet</a></li>
                <li><a href="#">Merchant Portal</a></li>
                <li><a href="#">Real-time Logs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-brand-navy/60 hover:text-brand-navy transition-colors">
                <li><a href="#">API Documentation</a></li>
                <li><a href="#">Security Hub</a></li>
                <li><a href="#">Brand Assets</a></li>
                <li><a href="#">Enterprise SOW</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Headquarters</h4>
              <div className="text-sm font-medium text-slate-500">
                <p>99 Terminal Way, BKC Hub</p>
                <p>Mumbai, Maharashtra, 400051</p>
                <p className="mt-4 font-black text-brand-navy">ops@mart-os.com</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <div>© 2026 MART.OS CORE. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-navy">Protocol</a>
              <a href="#" className="hover:text-brand-navy">Privacy</a>
              <a href="#" className="hover:text-brand-navy">Nodes</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)} 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-screen w-full max-w-sm border-l border-slate-200 bg-white shadow-[0_0_100px_rgba(0,0,0,0.2)]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cart Manifest</div>
                    <h2 className="text-xl font-black tracking-tight text-brand-navy">Order Summary</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                      <ShoppingBasket className="h-16 w-16 mb-6 text-slate-200" />
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Payload: Null</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-4 rounded-3xl border border-slate-100 p-4 bg-slate-50/50">
                        <img src={item.image} className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
                        <div className="flex flex-1 flex-col">
                          <h4 className="text-sm font-bold text-brand-navy">{item.name}</h4>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">₹{item.price.toFixed(2)} / {item.unit}</span>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-4 rounded-xl bg-white border border-slate-200 px-3 py-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-brand-navy"><Minus className="h-3 w-3" /></button>
                              <span className="font-mono font-bold text-xs w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-brand-navy"><Plus className="h-3 w-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-100 bg-slate-50 p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-brand-navy">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>Logistics Fee</span>
                      <span className="text-brand-navy">{cart.length > 0 ? '₹20.00' : '₹0.00'}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Final Gross</span>
                      <span className="text-3xl font-black tracking-tighter text-brand-navy">₹{(cart.length > 0 ? subtotal + 20 : 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    disabled={cart.length === 0 || isOrdering}
                    onClick={checkout}
                    className="group w-full rounded-2xl bg-brand-green py-5 text-xs font-black uppercase tracking-[0.2em] text-brand-navy shadow-xl shadow-green-200/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
                  >
                    {isOrdering ? 'DEPLOYING...' : 'INITIATE DEPLOYMENT'}
                    {!isOrdering && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl border border-slate-100 transition-all hover:border-brand-green">
      <div className="rounded-2xl bg-slate-50 p-4 w-fit text-brand-navy">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
      <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-brand-navy hover:text-brand-green transition-all">
      {React.cloneElement(icon as React.ReactElement, { size: 18 })}
    </a>
  );
}

function StatCard({ title, value, icon, change }: { title: string, value: string, icon: React.ReactNode, change?: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</span>
        <div className="rounded-2xl bg-slate-50 p-3 text-slate-400">{icon}</div>
      </div>
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-black tracking-tighter text-brand-navy">{value}</span>
        {change && (
          <span className={`text-[10px] font-black tracking-widest px-2 py-1 rounded border ${change.includes('↑') ? 'text-brand-green border-brand-green/20 bg-brand-green/5' : 'text-slate-500 border-slate-100 bg-slate-50'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

