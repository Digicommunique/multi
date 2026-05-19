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
  ArrowRight
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
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Admin State
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchBranches();
    fetchCategories();
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
          total: subtotal + 1.99, // plus delivery
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
            <div className="flex cursor-pointer flex-col" onClick={() => setView('shop')}>
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
        {orderComplete && (
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
                      <span className="text-xl font-black tracking-tighter text-brand-navy">${product.price.toFixed(2)}</span>
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
              <StatCard title="Daily Revenue" value={`$${stats?.totalSales.toFixed(2)}`} icon={<TrendingUp className="text-emerald-500" />} change="↑ 14.2%" />
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
                          <div className="text-2xl font-black tracking-tighter text-brand-navy">${branch.sales.toFixed(2)}</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Target: $10k</span>
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
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">${item.price.toFixed(2)} / {item.unit}</span>
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
                      <span className="text-brand-navy">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>Logistics Fee</span>
                      <span className="text-brand-navy">{cart.length > 0 ? '$1.99' : '$0.00'}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Final Gross</span>
                      <span className="text-3xl font-black tracking-tighter text-brand-navy">${(cart.length > 0 ? subtotal + 1.99 : 0).toFixed(2)}</span>
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

