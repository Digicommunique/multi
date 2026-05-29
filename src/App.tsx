/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ShieldCheck,
  Gift,
  Tag,
  Heart,
  Mic,
  QrCode,
  MessageSquare,
  Briefcase,
  Barcode,
  Layers,
  Boxes,
  ClipboardList,
  Star,
  Globe,
  Wallet,
  Sparkles,
  Send,
  Coins,
  History,
  Languages,
  Trash2,
  Settings,
  Percent,
  RefreshCw,
  Building,
  Power,
  Lock,
  UserCheck,
  Check,
  BarChart3,
  Brain,
  Fingerprint,
  Zap,
  AlertTriangle,
  ScanLine,
  Eye,
  EyeOff,
  Map,
  Activity,
  TrendingDown,
  Utensils,
  Store,
  Receipt,
  CalendarRange,
  KeyRound,
  ShieldAlert,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch, Category, Product, CartItem, Order, AdminStats } from './types';
import { BRANCHES, CATEGORIES, PRODUCTS } from './constants';

// Icon Map for Categories
const ICON_MAP: Record<string, any> = {
  ShoppingBasket, Apple, Milk, Coffee, User, Smartphone, Home
};

const HERO_COLOR_COMBOS = [
  {
    groceriesColor: 'text-brand-navy', 
    minutesColor: 'text-[#c82a5c]',    
    groceriesHex: '#0F172A',
    minutesHex: '#c82a5c',
    name: 'Classic Navy & Brand Rose'
  },
  {
    groceriesColor: 'text-[#1e1b4b]', 
    minutesColor: 'text-[#0284c7]',    
    groceriesHex: '#1e1b4b',
    minutesHex: '#0284c7',
    name: 'Midnight & Sky Breeze'
  },
  {
    groceriesColor: 'text-[#350f4a]', 
    minutesColor: 'text-[#d97706]',    
    groceriesHex: '#350f4a',
    minutesHex: '#d97706',
    name: 'Plum & Golden Sun'
  },
  {
    groceriesColor: 'text-[#064e3b]', 
    minutesColor: 'text-[#dc2626]',    
    groceriesHex: '#064e3b',
    minutesHex: '#dc2626',
    name: 'Forest Green & Ruby Glow'
  }
];

export const SIMULATED_ROLES = [
  { name: 'Super Admin', desc: 'Omnipotent system control. Access all microservices, masters, database nodes, and encryption configurations.', scope: 'dashboard, analytics, smart, mobile_apps, oms, delivery, warehouse, crm, finance, masters, products, inventory, purchase, vendor, rbac_security, qcomm_advanced, specialty_channels', badgeColor: 'bg-red-500 text-white' },
  { name: 'Corporate Admin', desc: 'Centralized holding management. Scrutinizes aggregated analytics, fiscal ledgers, and global definitions.', scope: 'dashboard, analytics, masters, products, inventory, finance, rbac_security, qcomm_advanced, specialty_channels', badgeColor: 'bg-purple-600 text-white' },
  { name: 'Branch Manager', desc: 'Oversees local BKC Dark Store. Coordinates real-time dispatching queues, stock tallies, and client disputes.', scope: 'dashboard, oms, delivery, warehouse, crm, inventory, qcomm_advanced, rbac_security, specialty_channels', badgeColor: 'bg-blue-600 text-white' },
  { name: 'Cashier', desc: 'Facilitates fast physical checkouts, processes offline sales journals, and reconciles desk registers.', scope: 'dashboard, oms, rbac_security, specialty_channels', badgeColor: 'bg-indigo-600 text-white' },
  { name: 'Warehouse Staff', desc: 'Schedules bulk receiving, manages temperature zones, and operates SKU optical scan terminal arrays.', scope: 'warehouse, qcomm_advanced, dashboard, rbac_security', badgeColor: 'bg-emerald-600 text-white' },
  { name: 'Delivery Rider', desc: 'Responsible for 10-minute micro-transit dispatching, telemetry routing, battery management, and OTP verification.', scope: 'delivery, qcomm_advanced, dashboard, rbac_security', badgeColor: 'bg-amber-600 text-white' },
  { name: 'Vendor', desc: 'Staples and farm supply provider. Submits PO invoices, tracks transit supply trucks, and audits settlement margins.', scope: 'vendor, dashboard, rbac_security', badgeColor: 'bg-teal-600 text-white' },
  { name: 'Customer', desc: 'Selects branch, manages active shopping lists, modifies wallet and tracks real-time order countdowns.', scope: 'rbac_security', badgeColor: 'bg-pink-600 text-white' },
  { name: 'Accountant', desc: 'Aggregates double-entry ledgers, monitors tax compliance vectors, and validates GRN fiscal matches.', scope: 'finance, purchase, dashboard, rbac_security', badgeColor: 'bg-cyan-600 text-white' },
  { name: 'CRM Executive', desc: 'Controls discount coupon triggers, loyalty rewards ratios, support chats, and automated SMS marketing alerts.', scope: 'crm, dashboard, rbac_security, specialty_channels', badgeColor: 'bg-orange-600 text-white' }
];

export const isTabAllowed = (role: string, tabId: string): boolean => {
  const matchingRole = SIMULATED_ROLES.find(r => r.name === role);
  if (!matchingRole) return false;
  // split and trim
  const scopes = matchingRole.scope.split(',').map(s => s.trim());
  return scopes.includes(tabId);
};

export const getTranslatedProductName = (name: string, lang: 'en' | 'hi' | 'mr'): string => {
  if (lang === 'en') return name;
  const dict: Record<string, Record<'hi' | 'mr', string>> = {
    "Premium Basmati Rice": { hi: "प्रीमियम बासमती चावल (Basmati Rice)", mr: "प्रीमियम बासमती तांदूळ (Basmati Rice)" },
    "Organic Brown Sugar": { hi: "ऑर्गेनिक ब्राउन शुगर (Brown Sugar)", mr: "सेंद्रिय ब्राऊन शुगर (Brown Sugar)" },
    "Fresh Royal Gala Apples": { hi: "ताजे रॉयल गाला सेब (Gala Apples)", mr: "ताजे रॉयल गाला सफरचंद (Gala Apples)" },
    "Organic Hass Avocado": { hi: "ऑर्गेनिक हास एवोकैडो (Avocado)", mr: "सेंद्रिय हास अ‍ॅव्होकाडो (Avocado)" },
    "Full Cream Milk": { hi: "फुल क्रीम दूध (Full Cream Milk)", mr: "फुल क्रीम दूध (Full Cream Milk)" },
    "Artisanal Sourdough Bread": { hi: "कारीगरी खट्टी ब्रेड (Sourdough Bread)", mr: "कारागीर आंबट ब्रेड (Sourdough Bread)" },
    "Cold Brew Coffee": { hi: "कोल्ड ब्रू कॉफी (Cold Brew Coffee)", mr: "कोल्ड ब्रू कॉफी (Cold Brew Coffee)" },
    "Green Tea Multipack": { hi: "ग्रीन टी मल्टीपैक (Green Tea)", mr: "ग्रीन टी मल्टीपॅक (Green Tea)" },
    "Organic Bananas": { hi: "जैविक केले (Organic Bananas)", mr: "सेंद्रिय केळी (Organic Bananas)" },
    "Dark Chocolate 70%": { hi: "डार्क चॉकलेट ७०% (Dark Chocolate)", mr: "डार्क चॉकलेट ७०% (Dark Chocolate)" },
    "Wireless Headphones": { hi: "वायरलेस हेडफ़ोन (Headphones)", mr: "वायरलेस हेडफोन (Headphones)" },
    "Smart Watch S3": { hi: "स्मार्ट वॉच S3 (Smart Watch)", mr: "स्मार्ट वॉच S3 (Smart Watch)" },
    "Hydrating Shampoo": { hi: "हाइड्रेटिंग शैम्पू (Shampoo)", mr: "हायड्रेटिंग शाम्पू (Shampoo)" },
    "Charcoal Toothpaste": { hi: "चारकोल टूथपेस्ट (Toothpaste)", mr: "चारकोल टूथपेस्ट (Toothpaste)" },
    "Liquid Detergent": { hi: "तरल डिटर्जेंट (Liquid Detergent)", mr: "लिक्विड डिटर्जंट (Liquid Detergent)" },
    "Dishwash Gel Lemon": { hi: "डिशवॉश जेल नींबू (Dishwash Gel)", mr: "डिशवॉश जेल लिंबू (Dishwash Gel)" }
  };
  return dict[name]?.[lang] || name;
};

export const getTranslatedCategoryName = (name: string, lang: 'en' | 'hi' | 'mr'): string => {
  if (lang === 'en') return name;
  const dict: Record<string, Record<'hi' | 'mr', string>> = {
    "Grocery": { hi: "किराना (Grocery)", mr: "किराणा (Grocery)" },
    "Fruits & Veggies": { hi: "फल और सब्जियां (Fruits & Veggies)", mr: "फळे आणि भाज्या (Fruits & Veggies)" },
    "Dairy & Bakery": { hi: "डेयरी और बेकरी (Dairy & Bakery)", mr: "डेअरी आणि बेकरी (Dairy & Bakery)" },
    "Beverages": { hi: "पेय पदार्थ (Beverages)", mr: "पेये (Beverages)" },
    "Personal Care": { hi: "पर्सनल केयर (Personal Care)", mr: "वैयक्तिक काळजी (Personal Care)" },
    "Electronics": { hi: "इलेक्ट्रॉनिक्स (Electronics)", mr: "इलेक्ट्रॉनिक्स (Electronics)" },
    "Household": { hi: "घरेलू सामान (Household)", mr: "घरगुती वस्तू (Household)" }
  };
  return dict[name]?.[lang] || name;
};

export const getTranslation = (key: string, lang: 'en' | 'hi' | 'mr'): string => {
  if (lang === 'en') return key;
  const dict: Record<string, Record<'hi' | 'mr', string>> = {
    "All SKU": { hi: "सभी उत्पाद (All SKU)", mr: "सर्व उत्पादने (All SKU)" },
    "Categories": { hi: "श्रेणियाँ (Categories)", mr: "श्रेण्या (Categories)" },
    "Featured Products": { hi: "विशेष उत्पाद (Featured Products)", mr: "वैशिष्ट्यीकृत उत्पादने (Featured Our Products)" },
    "Cart": { hi: "कार्ट (Cart)", mr: "कार्ट (Cart)" },
    "Wallet Balance": { hi: "वॉलेट बैलेंस (Wallet Balance)", mr: "वॉलेट बॅलन्स (Wallet Balance)" },
    "Add to Cart": { hi: "कार्ट में जोड़ें (Add to Cart)", mr: "कार्टमध्ये जोडा (Add to Cart)" },
    "Added": { hi: "जोड़ दिया गया (Added)", mr: "जोडले (Added)" },
    "Search": { hi: "खोजें (Search)", mr: "शोधा (Search)" },
    "Checkout": { hi: "चेकआउट (Checkout)", mr: "चेकआऊट (Checkout)" },
    "Select Branch": { hi: "शाखा चुनें (Select Branch)", mr: "शाखा निवडा (Select Branch)" },
    "GPS AUTO": { hi: "जीपीएस ऑटो (GPS AUTO)", mr: "जीपीएस ऑटो (GPS AUTO)" },
    "10 mins": { hi: "१० मिनट (10 mins)", mr: "१० मिनिटे (10 mins)" },
    "10 Minute Delivery": { hi: "१० मिनट में डिलीवरी (10M Delivery)", mr: "१० मिनिटात डिलिव्हरी (10M Delivery)" },
    "FREE DELIVERY": { hi: "मुफ़्त डिलीवरी (FREE)", mr: "मोफत डिलिव्हरी (FREE)" },
    "BEST PRICES": { hi: "सर्वोत्तम मूल्य (BEST PRICES)", mr: "सर्वोत्तम दर (BEST PRICES)" },
    "100% ORGANIC": { hi: "सौ प्रतिशत जैविक (100% ORGANIC)", mr: "१००% सेंद्रिय (100% ORGANIC)" },
    "My Wishlist": { hi: "मेरी विशलिस्ट (My Wishlist)", mr: "माझी विशलिस्ट (My Wishlist)" },
    "Explore Offers": { hi: "ऑफर देखें (Explore Offers)", mr: "ऑफर पहा (Explore Offers)" },
    "Empty Cart": { hi: "आपकी कार्ट खाली है! (Empty Cart)", mr: "तुमची कार्ट रिकामी आहे! (Empty Cart)" },
    "Subtotal": { hi: "उप-योग (Subtotal)", mr: "उपयोग (Subtotal)" },
    "Delivery Fee": { hi: "डिलिव्हरी शुल्क (Delivery Fee)", mr: "डिलिव्हरी शुल्क (Delivery Fee)" },
    "Tax (GST 18%)": { hi: "कर ( जीएसटी १८% - Tax)", mr: "कर ( जीएसटी १८% - Tax)" },
    "Grand Total": { hi: "कुल योग (Grand Total)", mr: "एकूण बेरीज (Grand Total)" },
    "Secure Instant Dispatch": { hi: "सुरक्षित त्वरित प्रेषण (Secure Checkout)", mr: "सुरक्षित त्वरित पाठवणे (Secure Checkout)" },
    "Select Payment Gateway": { hi: "भुगतान गेटवे चुनें (Select Payment Gateway)", mr: "पेमेंट गेटवे निवडा (Select Payment Gateway)" },
    "Payment Gateway Sandbox": { hi: "भुगतान गेटवे सिम्युलेटर (Payment Sandbox)", mr: "पेमेंट गेटवे सिम्युलेटर (Payment Sandbox)" },
    "Seasonal Collection": { hi: "मौसमी संग्रह (Seasonal Collection)", mr: "मोसमी संग्रह (Seasonal Collection)" },
    "Summer Fruits": { hi: "गर्मियों के फल (Summer Fruits)", mr: "उन्हाळ्यातील फळे (Summer Fruits)" },
    "Shop Now": { hi: "अभी खरीदें (Shop Now)", mr: "आता खरेदी करा (Shop Now)" },
    "Tech Express": { hi: "टेक एक्सप्रेस (Tech Express)", mr: "टेक एक्सप्रेस (Tech Express)" },
    "Mobile Hub": { hi: "मोबाइल हब (Mobile Hub)", mr: "मोबाईल हब (Mobile Hub)" },
    "Explore": { hi: "खोजें (Explore)", mr: "शोधा (Explore)" },
    "Order Summary": { hi: "ऑर्डर संक्षेप (Order Summary)", mr: "ऑर्डर सारांश (Order Summary)" },
    "Cart Manifest": { hi: "कार्ट सूची (Cart Manifest)", mr: "कार्ट सूची (Cart Manifest)" },
    "Payload: Null": { hi: "खाली है (Payload: Null)", mr: "रिकामे आहे (Payload: Null)" },
    "Voucher / Code": { hi: "कूपन कोड / वाउचर (Voucher Code)", mr: "कूपन कोड (Voucher Code)" },
    "Apply": { hi: "लागू करें (Apply)", mr: "लागू करा (Apply)" },
    "Add more items to unlock free delivery": { hi: "मुफ़्त डिलीवरी के लिए और सामान जोड़ें", mr: "मोफत डिलिव्हरीसाठी आणखी वस्तू जोडा" },
    "Add more items": { hi: "और सामान जोड़ें (Add more)", mr: "आणखी वस्तू जोडा (Add more)" }
  };
  return dict[key]?.[lang] || key;
};

export default function App() {
  const [view, setView] = useState<'shop' | 'admin' | 'login'>('shop');
  const [branches, setBranches] = useState<Branch[]>(BRANCHES);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    const saved = localStorage.getItem('martly_branch');
    return saved ? JSON.parse(saved) : BRANCHES[0];
  });
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
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
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Offers & Promo System
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // --- NEW CUSTOMER STATES FOR COMPLETE ECOSYSTEM ---
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('martly_wishlist');
    return saved ? JSON.parse(saved) : ['p1', 'p5'];
  });
  const [searchType, setSearchType] = useState<'text' | 'voice' | 'barcode'>('text');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);
  
  // Real-time Order lifecycle simulation state
  const [activeOrderTrack, setActiveOrderTrack] = useState<any | null>(null);
  const [orderLogs, setOrderLogs] = useState<string[]>([]);
  
  // Wallet & User profiling
  const [userAuth, setUserAuth] = useState({
    isLoggedIn: true,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@mumbai.io",
    phone: "+91 98200 12345",
    walletBalance: 1450.00,
    loyaltyPoints: 360,
    referralCode: "MART-MUM-982"
  });
  const [walletTxLogs, setWalletTxLogs] = useState<any[]>([
    { id: 'tx-1', date: '2026-05-18', desc: 'Referral Bonus', amount: +250 },
    { id: 'tx-2', date: '2026-05-19', desc: 'Order #33190 Refund', amount: +450 }
  ]);
  const [referralCount, setReferralCount] = useState(3);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  // Support chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState<any[]>([
    { id: 'c1', sender: 'bot', text: 'Namaste! I am your MART.OS concierge. How can I help you with your order fulfillment or delivery today?', time: '13:19' }
  ]);

  // Scheduled Delivery / Subscription setup 
  const [isSubscribingItem, setIsSubscribingItem] = useState<Product | null>(null);
  const [subInterval, setSubInterval] = useState<'weekly' | 'daily' | 'monthly'>('weekly');
  const [subDeliveriesCount, setSubDeliveriesCount] = useState(4);
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([
    { id: 'sub-1', product: PRODUCTS[4], interval: 'daily', nextDate: '2026-05-21', status: 'Active' }
  ]);

  // Order Ratings & reviews (stored locally)
  const [ratings, setRatings] = useState<Record<string, { rating: number, comment: string }>>({
    'p1': { rating: 5, comment: 'Scented Basmati grain is long and beautifully aged.' },
    'p5': { rating: 4, comment: 'Sealed properly, very fresh milk.' }
  });
  const [payMethod, setPayMethod] = useState<'wallet' | 'card' | 'cod'>('wallet');

  // --- NEW CENTRAL PORTAL & MASTER MODULE STATES ---
  const [adminTab, setAdminTab] = useState<any>('dashboard');
  const [masterSubtab, setMasterSubtab] = useState<'company' | 'branches' | 'brands' | 'categories'>('company');
  const [inventorySubtab, setInventorySubtab] = useState<'sync' | 'warehouses' | 'expiry' | 'transfer' | 'analytics'>('sync');
  const [purchaseSubtab, setPurchaseSubtab] = useState<'vendors' | 'po' | 'grn' | 'ledger' | 'return'>('vendors');
  const [vendorSubtab, setVendorSubtab] = useState<'dashboard' | 'upload' | 'orders' | 'dispatch' | 'commission'>('dashboard');
  
  // Analytics & BI Tabs
  const [biTab, setBiTab] = useState<'dashboard' | 'heatmap' | 'trends' | 'comparison' | 'riders' | 'retention' | 'revenue-forecast' | 'inventory-forecast' | 'peak' | 'geo'>('dashboard');
  // AI / Smart Features Tabs
  const [aiTab, setAiTab] = useState<'recs' | 'search' | 'tagging' | 'demand' | 'pricing' | 'delivery' | 'fraud' | 'cart-recovery'>('recs');
  // Mobile Simulator Tabs
  const [selectedMobileApp, setSelectedMobileApp] = useState<'customer' | 'delivery-boy' | 'manager' | 'vendor' | 'pda'>('customer');
  const [mobilePlatform, setMobilePlatform] = useState<'android' | 'ios'>('android');
  
  // AI module interactive inputs
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [dynamicPricingActive, setDynamicPricingActive] = useState(true);
  const [cartRecoveryDiscount, setCartRecoveryDiscount] = useState('15%');
  const [pdaLaserOn, setPdaLaserOn] = useState(false);
  const [pdaScannedBarcode, setPdaScannedBarcode] = useState('');

  // Banner dynamic auto combinations states
  const [bannerColorCombo, setBannerColorCombo] = useState<number>(0);
  const [bannerAutoPlay, setBannerAutoPlay] = useState<boolean>(true);

  // --- STATE FOR ROLE-BASED ACCESS CONTROL & SECURITY HUB ---
  const [activeRole, setActiveRole] = useState<'Super Admin' | 'Corporate Admin' | 'Branch Manager' | 'Cashier' | 'Warehouse Staff' | 'Delivery Rider' | 'Vendor' | 'Customer' | 'Accountant' | 'CRM Executive'>('Super Admin');
  const [securityMfaVerified, setSecurityMfaVerified] = useState<boolean>(true);
  const [securityJwtToken, setSecurityJwtToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYWplc2gua3VtYXJAIn0.security_sig');
  const [securityDeviceTracking, setSecurityDeviceTracking] = useState<any>({
    deviceId: 'dev_mac_3092',
    browser: 'Chrome 114.0.0',
    ipAddress: '103.45.2.14',
    location: 'Mumbai (BKC Hub Region)',
    sslSecured: true,
    lastBackup: '2026-05-20 14:35:19 UTC'
  });

  // --- DYNAMIC PASSCODES & SECURITY MANAGEMENT (ADMIN EDITABLE) ---
  const [rolePins, setRolePins] = useState<Record<string, { pin: string; id: string; authMethod: 'pin' | 'otp' | 'social_direct' }>>(() => {
    const defaultPins = {
      'Super Admin': { pin: '12345', id: 'ADMIN-CORE-001', authMethod: 'pin' },
      'Corporate Admin': { pin: '12345', id: 'CORP-CENTRAL-002', authMethod: 'pin' },
      'Branch Manager': { pin: '12345', id: 'BRANCH-BKC-003', authMethod: 'pin' },
      'Cashier': { pin: '12345', id: 'CASH-REG-004', authMethod: 'pin' },
      'Warehouse Staff': { pin: '12345', id: 'WH-BKC-005', authMethod: 'pin' },
      'Delivery Rider': { pin: '12345', id: 'RIDER-881', authMethod: 'pin' },
      'Vendor': { pin: '12345', id: 'VEND-BOMBAYAGRO', authMethod: 'pin' },
      'Accountant': { pin: '12345', id: 'ACC-LEDGER-008', authMethod: 'pin' },
      'CRM Executive': { pin: '12345', id: 'CRM-DISCOUNT-009', authMethod: 'pin' },
      'Customer': { pin: '1234', id: 'CUST-RAJESH-982', authMethod: 'social_direct' }
    };
    const saved = localStorage.getItem('martly_role_pins');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultPins,
          ...parsed
        };
      } catch (e) {}
    }
    return defaultPins;
  });

  const updateRolePin = (role: string, newPin: string, method?: 'pin' | 'otp' | 'social_direct') => {
    setRolePins(prev => {
      const updated = {
        ...prev,
        [role]: {
          ...prev[role],
          pin: newPin,
          ...(method ? { authMethod: method } : {})
        }
      };
      localStorage.setItem('martly_role_pins', JSON.stringify(updated));
      return updated;
    });
  };

  const [securityAdminEditingRole, setSecurityAdminEditingRole] = useState<string | null>(null);
  const [securityAdminNewPin, setSecurityAdminNewPin] = useState<string>('');
  const [securityAdminNewId, setSecurityAdminNewId] = useState<string>('');
  const [securityAdminNewMethod, setSecurityAdminNewMethod] = useState<'pin' | 'otp' | 'social_direct'>('pin');
  const [securityAdminRevealPins, setSecurityAdminRevealPins] = useState<boolean>(false);

  // --- STATE FOR CENTRAL ENTERPRISE PORTAL & MULTI-ROLE LOGIN ---
  const [loginSelectedRole, setLoginSelectedRole] = useState<string>('Super Admin');
  const [loginPasscode, setLoginPasscode] = useState<string>('');
  const [loginPhone, setLoginPhone] = useState<string>('+91 98200 12345');
  const [isBiometricScanning, setIsBiometricScanning] = useState<boolean>(false);
  const [securityMfaTokenInput, setSecurityMfaTokenInput] = useState<string>('');
  const [authHandshakeLogs, setAuthHandshakeLogs] = useState<string[]>([
    "SEC_CORE_SYS: System Online, monitoring ports [3000].",
    "SEC_CORE_SYS: Standard SSL-TLS connection routed securely.",
    "SEC_CORE_SYS: Cryptography engine initialized successfully."
  ]);
  const [fraudThreatScore, setFraudThreatScore] = useState<number>(3); // 0-100 scale, low is safe
  const [auditLogsRegistry, setAuditLogsRegistry] = useState<any[]>([
    { timestamp: '14:35:24', event: 'SYS_AUTH', desc: 'Secure session established using JWT Bearer schema.', level: 'INFO', module: 'AUTH' },
    { timestamp: '14:35:19', event: 'MFA_CHECK', desc: 'OTP verification matched with simulated active device OTP hash: 8812.', level: 'SUCCESS', module: 'MFA' },
    { timestamp: '14:35:01', event: 'SSL_HANDSHAKE', desc: 'TLSv1.3 connection negotiated cleanly on Client-Agent pipeline.', level: 'SECURE', module: 'NETWORK' },
    { timestamp: '14:34:44', event: 'AUDIT_INIT', desc: 'Cryptographically-signed audit database initialized securely.', level: 'INFO', module: 'AUDIT' }
  ]);
  
  
  // --- STATE FOR SPECIALTY COMMERCIAL CHANNELS ---
  const [specialtySubtab, setSpecialtySubtab] = useState<'restaurant' | 'wholesale' | 'corporate' | 'subscription' | 'pos'>('restaurant');
  
  // Restaurant Ordering states
  const [restaurantOrders, setRestaurantOrders] = useState<any[]>([
    { id: 'KOT-712', client: 'Bungalow 9 Bistro', items: 'Basmati Rice bulk (50kg), Garlic Crates (5kg)', status: 'Prepping', created: '14:42' },
    { id: 'KOT-713', client: 'Tandoor Grill', items: 'Fresh Mint Bunches (20 qty), Full Cream Milk (20L)', status: 'Received', created: '14:48' },
    { id: 'KOT-714', client: 'Subway BKC', items: 'Royal Gala Apples (10kg), Lettuce Box (2 qty)', status: 'Dispatched', created: '14:30' }
  ]);
  const [restaurantMaterialThreshold, setRestaurantMaterialThreshold] = useState<number>(45);

  // B2B Wholesale states
  const [wholesaleVolumeTier, setWholesaleVolumeTier] = useState<number>(500); 
  const [wholesaleBuyerCompany, setWholesaleBuyerCompany] = useState<string>('Om Sairam Grocery Mart');
  const [wholesaleCreditTerms, setWholesaleCreditTerms] = useState<string>('NET_30');
  const [wholesaleInvoicePrinted, setWholesaleInvoicePrinted] = useState<boolean>(false);

  // Corporate Supply states
  const [corpEmployeeCount, setCorpEmployeeCount] = useState<number>(120);
  const [corpPantryActiveItems, setCorpPantryActiveItems] = useState<string[]>(['Coffee Beans', 'Snack Bar Multi', 'Premium Milk', 'Sparkling Soda']);
  const [corpGstin, setCorpGstin] = useState<string>('27AAAAA1111A1Z1');

  // Subscription Grocery states
  const [specialtySubscriptions, setSpecialtySubscriptions] = useState<any[]>([
    { id: 'SUB-101', customer: 'Amit Sharma', item: 'Full Cream Milk (2L)', frequency: 'Daily (Morning)', status: 'Active' },
    { id: 'SUB-102', customer: 'Priya Deshmukh', item: 'Fresh Gala Apples (1kg)', frequency: 'Mon / Wed / Fri', status: 'Paused' },
    { id: 'SUB-103', customer: 'Vikram Joshi', item: 'Artisanal Sourdough Bread', frequency: 'Weekends Only', status: 'Active' }
  ]);

  // Smart POS states
  const [posScannerInput, setPosScannerInput] = useState<string>('');
  const [posTerminalCart, setPosTerminalCart] = useState<any[]>([
    { id: 'p1', name: 'Premium Basmati Rice', price: 120, qty: 1 },
    { id: 'p5', name: 'Full Cream Milk', price: 68, qty: 3 }
  ]);
  const [posCashAmount, setPosCashAmount] = useState<number>(500);

  // --- STATE FOR ADVANCED QUICK COMMERCE FEATURES ---
  const [qcommActiveDarkStore, setQcommActiveDarkStore] = useState<string>('Central Dark Store BKC-01');
  const [qcommRiderBattery, setQcommRiderBattery] = useState<number>(94);
  const [qcommTempMin, setQcommTempMin] = useState<number>(4.2); // Sourdough/Groceries frozen temp
  const [qcommSplitOrders, setQcommSplitOrders] = useState<any[]>([
    { id: 'split-s01A', parentId: 'ord-88321', zone: 'Staples Tier A', status: 'Picked', items: 'Premium Basmati Rice (5kg)', riderId: 'Rider Amit Patel' },
    { id: 'split-s01B', parentId: 'ord-88321', zone: 'Produce Chilled Zone', status: 'Packing', items: 'Organic Hass Avocado (2 units)', riderId: 'Rider Sanjay Ram' }
  ]);
  const [qcommRouteProgress, setQcommRouteProgress] = useState<number>(35); // 0-100 along mapped route
  const [qcommWeatherIndex, setQcommWeatherIndex] = useState<string>('Clear Skies (31°C)');
  const [qcommTrafficState, setQcommTrafficState] = useState<'Clear' | 'Heavy' | 'Rerouted'>('Clear');
  const [paymentGatewaySelected, setPaymentGatewaySelected] = useState<'Razorpay' | 'Paytm' | 'PhonePe' | 'Cashfree' | 'UPI' | 'Wallet' | 'COD'>('Razorpay');
  const [apiTerminalLogs, setApiTerminalLogs] = useState<string[]>([
    "[Gateway] Intializing merchant keys matching PhonePe Merchant ID PG_MUM_903...",
    "[Razorpay] Checkout modal configured dynamically with custom callback webhook...",
    "[Integrations] Google Maps API reverse-geocoded branch BKC location successfully."
  ]);

  // --- COMPREHENSIVE ERP ECOSYSTEM MOCK DATA STATES ---
  const [ordersList, setOrdersList] = useState<any[]>([
    {
      id: "ord-88321",
      customer: "Rajesh Kumar",
      phone: "+91 98200 12345",
      branch: "Downtown Mumbai Hub",
      items: [
        { id: "p1", name: "Premium Basmati Rice", price: 1250, quantity: 1, unit: "5kg" },
        { id: "p4", name: "Organic Hass Avocado", price: 180, quantity: 2, unit: "1pc" }
      ],
      total: 1610,
      paymentMethod: "wallet",
      status: "Payment Verified",
      date: "2026-05-20",
      step: 1, // s=1 in 9 stages (0 to 8)
      gpsCoords: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: "ord-29931",
      customer: "Arpita Mehta",
      phone: "+91 91223 33412",
      branch: "Westside Suburb Center",
      items: [
        { id: "p3", name: "Fresh Royal Gala Apples", price: 399, quantity: 1, unit: "1kg" },
        { id: "p4", name: "Organic Hass Avocado", price: 250, quantity: 2, unit: "1pc" }
      ],
      total: 898,
      paymentMethod: "cod",
      status: "New Order",
      date: "2026-05-20",
      step: 0,
      gpsCoords: { lat: 19.0596, lng: 72.8295 }
    },
    {
      id: "ord-12495",
      customer: "Amit Shukla",
      phone: "+91 99300 88211",
      branch: "Thane East Depot",
      items: [
        { id: "p3", name: "Fresh Royal Gala Apples", price: 399, quantity: 2, unit: "1kg" }
      ],
      total: 798,
      paymentMethod: "cod",
      status: "Delivered",
      date: "2026-05-19",
      step: 8,
      gpsCoords: { lat: 19.2183, lng: 72.9781 }
    }
  ]);

  // OMS Status Pipeline
  const omsSteps = [
    { s: 0, label: "New Order", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { s: 1, label: "Payment Verified", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { s: 2, label: "Store Accepted", color: "bg-violet-50 text-violet-700 border-violet-200" },
    { s: 3, label: "Picker Assigned", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { s: 4, label: "Packing Started", color: "bg-pink-50 text-pink-700 border-pink-200" },
    { s: 5, label: "Ready For Delivery", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { s: 6, label: "Rider Assigned", color: "bg-sky-50 text-sky-700 border-sky-200" },
    { s: 7, label: "Out For Delivery", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { s: 8, label: "Delivered", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
  ];

  // Rider Boy App States (RMS)
  const [riderAuth, setRiderAuth] = useState({
    isLoggedIn: true,
    username: "RIDER-881",
    name: "Amit Patel (Rider #881)",
    kycVerified: true,
    isClockedIn: true,
    fuelAllowanceRate: 4.5, // per KM
    kmsDriven: 42,
    baseRateCheck: 15,
    cashCollected: 798,
    tips: 50,
    attendanceLogs: [
      { date: "2026-05-20", clockIn: "08:00 AM", clockOut: "--", shift: "Morning Active" },
      { date: "2026-05-19", clockIn: "08:00 AM", clockOut: "04:30 PM", shift: "8.5 Hrs" }
    ]
  });

  const [otpConfirmVal, setOtpConfirmVal] = useState("");
  const [tempRiderName, setTempRiderName] = useState("RIDER-881");
  const [tempRiderPass, setTempRiderPass] = useState("•••••");

  // WMS Warehouse bin allocation list
  const [wmsSubtab, setWmsSubtab] = useState<'bin' | 'barcode' | 'picklist' | 'packing' | 'audit'>('bin');
  const [binShelves, setBinShelves] = useState<any[]>([
    { zone: "A1", shelf: "Row 5 - Tier 2", bin: "Bin #882-B", SKU: "SKU-BR-101", desc: "Premium Basmati Rice", qty: 150, maxCapacity: 200 },
    { zone: "B2", shelf: "Row 12 - Tier 1", bin: "Bin #124-C", SKU: "SKU-SD-021", desc: "Artisanal Sourdough Bread", qty: 12, maxCapacity: 50 },
    { zone: "C1", shelf: "Row 3 - Tier 4", bin: "Bin #411-A", SKU: "SKU-FM-201", desc: "Full Cream Milk", qty: 45, maxCapacity: 100 }
  ]);
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [barcodeScanResult, setBarcodeScanResult] = useState<any>(null);

  // CRM Module Coupns / SEGMENTATION
  const [crmSubtab, setCrmSubtab] = useState<'segments' | 'coupons' | 'campaigns' | 'membership'>('segments');
  const [customerSegments, setCustomerSegments] = useState<any[]>([
    { id: "seg-1", name: "VIP High Spenders", criteria: "Total spend > ₹5000", count: 184, conversion: "74% Click-thru" },
    { id: "seg-2", name: "Discount Hunters", criteria: "Coupon usage > 70%", count: 480, conversion: "41% Click-thru" },
    { id: "seg-3", name: "Organic-Only Basket", criteria: "FarmDirect product affinity", count: 96, conversion: "58% Click-thru" },
    { id: "seg-4", name: "At-Risk Sleepers", criteria: "0 orders in 30 days", count: 112, conversion: "12% Active" }
  ]);
  const [couponsList, setCouponsList] = useState<any[]>([
    { code: "MUMBAI30", disc: 30, type: "percent", maxCap: 150, minOrder: 300, desc: "30% Off standard Mumbai orders" },
    { code: "FREEDROP", disc: 45, type: "shipping", maxCap: 45, minOrder: 150, desc: "Waives 100% of standard delivery fees" },
    { code: "FESTIVE500", disc: 500, type: "flat", maxCap: 500, minOrder: 1500, desc: "Flat ₹500 rebate off massive core baskets" }
  ]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDisc, setNewCouponDisc] = useState("30");
  const [newCouponType, setNewCouponType] = useState("percent");

  // WhatsApp Campaigns states
  const [campaignLog, setCampaignLog] = useState<any[]>([
    { id: "camp-1", channel: "WhatsApp", title: "Monsoon Super Discount Blitz", target: "VIP High Spenders", sentCount: 184, delivered: 181, clicks: 136 },
    { id: "camp-2", channel: "SMS", title: "Come Back and Save ₹100", target: "At-Risk Sleepers", sentCount: 112, delivered: 109, clicks: 14 }
  ]);
  const [campaignTitleInput, setCampaignTitleInput] = useState("");
  const [campaignChannelInput, setCampaignChannelInput] = useState("WhatsApp");
  const [campaignSegmentInput, setCampaignSegmentInput] = useState("VIP High Spenders");

  // CRM Loyalty Benefits
  const loyaltyMemberships = [
    { type: "Silver", color: "from-slate-200 to-slate-400 text-slate-900 border-slate-200", perks: "5% cashback on groceries and Priority support." },
    { type: "Gold", color: "from-amber-400 to-amber-500 text-amber-950 border-amber-300", perks: "10% cashback + free shipping over ₹200. Priority support threshold." },
    { type: "Platinum", color: "from-teal-300 to-teal-500 text-teal-950 border-teal-200", perks: "15% flat cashback. Zero order fee caps. Assigned 1-to-1 concierge desk." },
    { type: "Premium", color: "from-indigo-600 to-rose-600 text-white border-violet-500", perks: "24/7 priority support, 20% on brand partners, and free lightning delivery." }
  ];

  // Finance Ledger states
  const [financeSubtab, setFinanceSubtab] = useState<'sales' | 'purchase' | 'taxes' | 'pl' | 'balance'>('sales');
  const [financeLedger, setFinanceLedger] = useState<any[]>([
    { id: "ledger-001", date: "2026-05-20", refId: "ord-88321", desc: "Sales Receipt (Customer Rajesh K.)", debit: 1610, credit: 0, balance: 1610 },
    { id: "ledger-002", date: "2026-05-20", refId: "PO-2026-001", desc: "Purchase Payment to Bombay Agro", debit: 0, credit: 20000, balance: -18390 },
    { id: "ledger-003", date: "2026-05-19", refId: "ord-12495", desc: "Cash Collected (COD Settlement)", debit: 798, credit: 0, balance: -17592 }
  ]);
  const [taxReports, setTaxReports] = useState({
    cgstOutput: 16840.50,
    sgstOutput: 16840.50,
    cgstInputCredit: 5210.10,
    sgstInputCredit: 5210.10,
    netPayableGST: 23260.80,
    tdsCollected: 4120.00
  });

  const [expenses, setExpenses] = useState<any[]>([
    { desc: "Petroleum Fuel Reimbursement", cat: "Fulfillment Costs", amount: 1890, date: "2026-05-20" },
    { desc: "Dry Ice & Cold Liner Sacks", cat: "Warehouse Supplies", amount: 4500, date: "2026-05-19" },
    { desc: "Hub Bandwidth & AWS Router Space", cat: "IT & Telemetry", amount: 12400, date: "2026-05-18" }
  ]);

  // Analytics Forecasting & Heatmaps
  const revenueForecastData = [
    { day: "W1 (May 1-7)", rev: 112000 },
    { day: "W2 (May 8-14)", rev: 145000 },
    { day: "W3 (May 15-21)", rev: 188350 },
    { day: "W4 (May 22-28 Forecast)", rev: 215000 },
    { day: "W5 (May 29+ Forecast)", rev: 240000 },
  ];

  // A. Company Master
  const [companyMaster, setCompanyMaster] = useState({
    name: "MART.OS Logistics Private Limited",
    gst: "27AAECM1234F1Z5",
    pan: "AAECM1234F",
    address: "Tower B, BKC Capital Arcade, Bandra East, Mumbai, MH - 400051",
    logo: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=100",
    bank: "HDFC Bank - A/C 50100293188201 (IFSC HDFC0000012)",
    prefix: "MOS-MUM-"
  });

  // B. Branch Master Extension
  const [branchMaster, setBranchMaster] = useState<any[]>([
    { id: "br-1", name: "Downtown Mumbai Hub", code: "HUB-MUM-01", address: "Commercial Plaza, BKC", city: "Mumbai", state: "Maharashtra", pin: "400051", lat: 19.0760, lng: 72.8777, manager: "Pranav Deshmukh", contact: "+91 91234 56789", hours: "06:00 AM - 11:30 PM", radius: 5, warehouse: "Main Transit WH-A" },
    { id: "br-2", name: "Westside Suburb Center", code: "HUB-MUM-02", address: "Main Link Rd, Bandra", city: "Mumbai", state: "Maharashtra", pin: "400050", lat: 19.0596, lng: 72.8295, manager: "Sophia Alvares", contact: "+91 98765 43210", hours: "07:00 AM - 11:00 PM", radius: 8, warehouse: "Main Transit WH-A" },
    { id: "br-3", name: "Thane East Depot", code: "HUB-THN-03", address: "Ghodbunder Road, Thane", city: "Thane", state: "Maharashtra", pin: "400607", lat: 19.2183, lng: 72.9781, manager: "Aniket Shinde", contact: "+91 93456 78901", hours: "06:00 AM - 10:00 PM", radius: 4, warehouse: "Thane Regional WH-B" }
  ]);

  // C. Brand Master
  const [brandMaster, setBrandMaster] = useState<any[]>([
    { id: "b-1", name: "Harvest Gold", manufacturer: "Harvest Agro Corp", logo: "HG", category: "Groceries", gst: 5, commission: 8, priority: "High" },
    { id: "b-2", name: "EcoPure", manufacturer: "Organic Earth Ltd", logo: "EP", category: "Organic Essentials", gst: 0, commission: 10, priority: "Medium" },
    { id: "b-3", name: "FarmDirect", manufacturer: "Shetkari Farmers Co-op", logo: "FD", category: "Fruits & Vegetables", gst: 0, commission: 5, priority: "High" },
    { id: "b-4", name: "DairyFresh", manufacturer: "Unified Milk Distributors", logo: "DF", category: "Dairy & Eggs", gst: 5, commission: 7, priority: "High" },
    { id: "b-5", name: "TechCore", manufacturer: "Core Electronics Assembly", logo: "TC", category: "Accessories", gst: 18, commission: 15, priority: "Medium" }
  ]);

  // Product Master extended fields for SKU form
  const [onboardProduct, setOnboardProduct] = useState({
    name: "", SKU: "", barcode: "", HSN: "", category: "cat-1", subcategory: "Pulses & Grains",
    brand: "Harvest Gold", unit: "1kg", weight: "1.0 kg", description: "Standard grade food security grains.",
    MRP: 150, sellingPrice: 120, offerPrice: 110, purchasePrice: 85, taxRate: 5, margin: 29,
    batchNo: "BATCH-2026-A", expiryDate: "2027-12-30", minStock: 10, reorderLevel: 25,
    currentStock: 150, reservedStock: 0, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    videoUrl: "", seoUrl: "premium-grain-groceries", seoTitle: "Buy premium grade grains online - MART.OS",
    seoKeywords: "rice, grain, groceries, organic", seoTags: "organic, whole food, staples"
  });

  // --- NEW INVENTORY LOGS ---
  const [warehouseList, setWarehouseList] = useState<any[]>([
    { id: "wh-1", name: "BKC Core Warehouse Plaza", zone: "West Zone A", manager: "R. Sharma", capacity: "88% Utilized", stockItems: 42000 },
    { id: "wh-2", name: "Noida Regional Fulfillment", zone: "North Zone C", manager: "A. Dwivedi", capacity: "45% Utilized", stockItems: 18000 },
    { id: "wh-3", name: "Thane Transit Hub", zone: "Central Zone B", manager: "G. Kamble", capacity: "92% Utilized", stockItems: 31000 }
  ]);
  const [expiryAlerts, setExpiryAlerts] = useState<any[]>([
    { id: "e1", productName: "Artisanal Sourdough Bread", SKU: "SKU-SD-021", batch: "B-SOUR-99", expiry: "2026-05-23", daysRemaining: 3, stock: 12, actionRequired: "Liquidation Sale 50% Off" },
    { id: "e2", productName: "Full Cream Milk", SKU: "SKU-FM-201", batch: "B-MILK-12", expiry: "2026-05-24", daysRemaining: 4, stock: 45, actionRequired: "Instant Dispatch to BKC Branch" },
    { id: "e3", productName: "Fresh Royal Gala Apples", SKU: "SKU-AP-011", batch: "B-FRU-09", expiry: "2026-05-29", daysRemaining: 9, stock: 80, actionRequired: "Standard Display Rotation" }
  ]);
  const [damageReports, setDamageReports] = useState<any[]>([
    { id: "dmg-1", date: "2026-05-19", productName: "Charcoal Toothpaste", SKU: "SKU-TP-32", quantity: 5, damageType: "Leaking Tubes / Transit Crush", valueLoss: 600, writeOffStatus: "Approved by Manager" }
  ]);
  const [stockTransfers, setStockTransfers] = useState<any[]>([
    { id: "trn-101", date: "2026-05-18", fromBranch: "Thane East Depot", toBranch: "Downtown Mumbai Hub", SKU: "SKU-BR-11", product: "Premium Basmati Rice", qty: 20, status: "Delivered & Verified" }
  ]);

  // --- NEW PURCHASE LOGS ---
  const [vendorList, setVendorList] = useState<any[]>([
    { id: "v-1", name: "Bombay Agro Foods", contact: "Sunil Gupta", email: "agro@bombayfoods.in", phone: "+91 99231 22341", balanceDue: 45000, ledgerRating: 4.8 },
    { id: "v-2", name: "Unified Dairy Co-op", contact: "Meera Deshpande", email: "meera@dairyfresh.co", phone: "+91 98201 54322", balanceDue: 18200, ledgerRating: 4.9 },
    { id: "v-3", name: "Core Electronics Trading", contact: "Jimmy Mehta", email: "mehta@coreelec.com", phone: "+91 91233 44556", balanceDue: 125000, ledgerRating: 4.2 }
  ]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([
    { id: "PO-2026-001", vendorId: "v-1", date: "2026-05-17", expectedDate: "2026-05-23", total: 85200, status: "Submitted to Vendor", itemLines: "Premium Basmati Rice x50, Brown Sugar x100" },
    { id: "PO-2026-002", vendorId: "v-2", date: "2026-05-19", expectedDate: "2026-05-21", total: 12600, status: "On Way", itemLines: "Full Cream Milk x200 Litres" }
  ]);
  const [grnList, setGrnList] = useState<any[]>([
    { id: "GRN-99821", poId: "PO-2026-001", date: "2026-05-19", receivedQty: 150, acceptedQty: 148, rejectedQty: 2, rejectedReason: "Damp Sacks", verifiedBy: "Amit K. (Store Supervisor)" }
  ]);
  const [purchaseReturns, setPurchaseReturns] = useState<any[]>([
    { id: "PR-201", date: "2026-05-19", vendorId: "v-1", product: "Premium Basmati Rice", qty: 2, value: 2500, status: "Credit Note Issued" }
  ]);
  const [vendorLedgers, setVendorLedgers] = useState<any[]>([
    { id: "led-101", date: "2026-05-15", vendorId: "v-1", particulars: "Opening balance", debit: 0, credit: 45000, balance: 45000 },
    { id: "led-102", date: "2026-05-18", vendorId: "v-1", particulars: "Cheque Pyamt HDFC #1128", debit: 20000, credit: 0, balance: 25000 }
  ]);

  // --- NEW VENDOR ACTIONS ---
  const [vendorAuthCode, setVendorAuthCode] = useState("VEND-BOMBAYAGRO");
  const [vendorCommissionLogs, setVendorCommissionLogs] = useState<any[]>([
    { id: "com-1", orderId: "ord-8832", product: "Premium Basmati Rice", saleVal: 1250, pct: 8, commissionPaid: 100, payoutStatus: "Transferred" }
  ]);

  // Interactive Footer States
  const [activeFooterTab, setActiveFooterTab] = useState<string | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('cat-1');
  const [newProdUnit, setNewProdUnit] = useState('1kg');
  const [newProdStock, setNewProdStock] = useState('50');
  const [logStream, setLogStream] = useState<string[]>([]);

  // Protocol, Privacy and Nodes Custom States
  const [protocolMode, setProtocolMode] = useState<string>('standard');
  const [protocolSecureKey, setProtocolSecureKey] = useState<string>('AES-256-GCM-MUMBAI-ACTIVE');
  const [privacySessionCaching, setPrivacySessionCaching] = useState<boolean>(true);
  const [privacyConsentStandard, setPrivacyConsentStandard] = useState<string>('GDPR+CCPA');
  const [clusterNodes, setClusterNodes] = useState<any[]>([
    { id: 'node-mum-1', name: 'Mumbai BKC Core', city: 'Mumbai', latency: 4, txCount: 14201, load: 74, status: 'Healthy', ip: '192.168.10.12' },
    { id: 'node-mum-2', name: 'Mumbai West Terminal', city: 'Mumbai', latency: 8, txCount: 8905, load: 38, status: 'Healthy', ip: '192.168.10.15' },
    { id: 'node-pne-1', name: 'Pune Central Gate', city: 'Pune', latency: 14, txCount: 6140, load: 42, status: 'Healthy', ip: '192.168.12.8' },
    { id: 'node-del-1', name: 'Delhi NCR Hub node', city: 'Delhi', latency: 28, txCount: 19445, load: 88, status: 'Healthy', ip: '192.168.14.3' },
    { id: 'node-blr-1', name: 'Bengaluru Tech corridor', city: 'Bengaluru', latency: 19, txCount: 12550, load: 52, status: 'Healthy', ip: '192.168.16.24' },
    { id: 'node-hyd-1', name: 'Hyderabad Cybercity Depot', city: 'Hyderabad', latency: 22, txCount: 5122, load: 15, status: 'Maintenance', ip: '192.168.18.9' }
  ]);
  const [nodeFilterCity, setNodeFilterCity] = useState<string>('All');

  // Simulated log streaming in background
  useEffect(() => {
    setLogStream([
      `[${new Date().toLocaleTimeString()}] OS ROUTER: Interface bound to interface 0.0.0.0`,
      `[${new Date().toLocaleTimeString()}] MEMORY CONTROLLER: Preloaded ${CATEGORIES.length} cache catalogs`,
      `[${new Date().toLocaleTimeString()}] NETWORK MANAGER: Active link initialized securely`
    ]);
  }, []);

  useEffect(() => {
    if (activeFooterTab !== 'real-time-logs') return;
    const items = [
      "INBOUND: Received package routing signal",
      "METRICS: Query payload computed in 14ms",
      "DISPATCH: Courier coordinated with Hub #1",
      "OS CONTROLLER: Cache compiled in standby memory",
      "SECURITY: TLS Handshake check succeeded with SHA256",
      "STORAGE: Synced 16 core assets offline"
    ];
    const timer = setInterval(() => {
      setLogStream(prev => [
        `[${new Date().toLocaleTimeString()}] ${items[Math.floor(Math.random() * items.length)]}`,
        ...prev.slice(0, 15)
      ]);
    }, 2000);
    return () => clearInterval(timer);
  }, [activeFooterTab]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('martly_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('martly_branch', JSON.stringify(selectedBranch));
    }
  }, [selectedBranch]);

  // Dynamic automatic color rotation index switcher
  useEffect(() => {
    if (!bannerAutoPlay) return;
    const interval = setInterval(() => {
      setBannerColorCombo(prev => (prev + 1) % 4);
    }, 4500); // Shift every 4.5 seconds peacefully
    return () => clearInterval(interval);
  }, [bannerAutoPlay]);

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

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const updated = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('martly_wishlist', JSON.stringify(updated));
      return updated;
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

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'FAST15') {
      return subtotal * 0.15;
    }
    if (appliedPromo === 'MART50') {
      return subtotal >= 300 ? 50 : 0;
    }
    if (appliedPromo === 'WELCOME100') {
      return subtotal >= 500 ? 100 : 0;
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const shippingFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (appliedPromo === 'FREESHIP') return 0;
    return 20;
  }, [appliedPromo, cart.length]);

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const checkout = async (paymentMethod: 'wallet' | 'card' | 'cod' = 'wallet') => {
    if (!selectedBranch) return;
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    let currentWalletBalance = userAuth.walletBalance;
    // Check wallet balance if selected - Auto top-up for flawless experience
    if (paymentMethod === 'wallet' && currentWalletBalance < finalTotal) {
      const neededExtra = Math.ceil(finalTotal - currentWalletBalance + 1000);
      alert(`💡 Wallet Auto-Authorize: Added ₹${neededExtra.toFixed(2)} to your e-wallet automatically from your authorized payment source so you can complete this transaction seamlessly!`);
      currentWalletBalance += neededExtra;
    }

    setIsOrdering(true);
    const orderId = `ord-${Math.floor(Math.random() * 90000 + 10000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          items: cart,
          total: finalTotal,
          appliedPromo,
          discountAmount,
          branchId: selectedBranch.id
        })
      });
      await res.json();

      // Deduct wallet balance if appropriate
      let updatedWallet = currentWalletBalance;
      if (paymentMethod === 'wallet') {
        updatedWallet = Math.max(0, currentWalletBalance - finalTotal);
        setWalletTxLogs(prev => [
          { id: `tx-${Math.random().toString(36).substr(2,6)}`, date: new Date().toISOString().split('T')[0], desc: `Fulfillment Order ${orderId}`, amount: -finalTotal },
          ...prev
        ]);
      }

      // Add loyalty points (+10 loyalty points per 100 spent)
      const pointsEarned = Math.floor(finalTotal / 10);
      const updatedPoints = userAuth.loyaltyPoints + pointsEarned;

      setUserAuth(prev => ({
        ...prev,
        walletBalance: updatedWallet,
        loyaltyPoints: updatedPoints
      }));

      // Initialize the real-time order tracking pipeline structure.
      const initialLogs = [
        `[${new Date().toLocaleTimeString()}] ORDER DISPATCHED: Registered session ${orderId} successfully via ${paymentMethod.toUpperCase()}.`,
        `[${new Date().toLocaleTimeString()}] GPS AUTO-DETECT: Querying nearest hub matching latitude: ${selectedBranch.lat}, longitude: ${selectedBranch.lng}...`,
        `[${new Date().toLocaleTimeString()}] BRIDGE STABILIZED: Secured channel to ${selectedBranch.name}`
      ];
      setOrderLogs(initialLogs);

      setActiveOrderTrack({
        id: orderId,
        items: [...cart],
        subtotal,
        discountAmount,
        shippingFee,
        total: finalTotal,
        paymentMethod,
        branch: selectedBranch,
        step: 0, // Order processing
        rider: { name: "Amit Patel (Rider #881)", contact: "+91 99300 11202", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
        picker: { name: "Suresh Patil (BKC Picker)", rating: "4.9 ★" },
        packer: { name: "Ketan Kadam (BKC Packer)", rating: "4.8 ★" }
      });

      setCart([]);
      setAppliedPromo(null);
      setIsCartOpen(false);
      setOrderComplete(true);
      setTimeout(() => setOrderComplete(false), 5000);
    } catch (err) {
      console.error("Checkout issue:", err);
      alert("Order could not be registered on database server.");
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'wishlist') {
      return products.filter(p => wishlist.includes(p.id));
    }
    if (aiSuggestions.length > 0 && searchQuery) {
      return products.filter(p => aiSuggestions.includes(p.id));
    }
    if (searchQuery) {
      return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return products;
  }, [products, searchQuery, aiSuggestions, selectedCategory, wishlist]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {view === 'login' ? (
        <div 
          className="min-h-screen text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-[#F2CA04] overflow-x-hidden relative"
          style={{ 
            backgroundColor: '#F2CA04',
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.08) 2px, transparent 2px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.08) 2px, transparent 2px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.08) 2px, transparent 2px)
            `,
            backgroundSize: '120px 45px, 120px 45px, 120px 45px',
            backgroundPosition: '0 0, 0 0, 60px 22.5px'
          }}
        >
          
          {/* Subtle industrial shadow depth vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

          {/* Central content container */}
          <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center relative z-10">
            
            {/* Core Header Bar on Login screen */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-black/10 pb-8">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="rounded-3xl bg-slate-950 p-3 shadow-lg shadow-black/30 border border-slate-900/20">
                  <ShieldCheck className="h-8 w-8 text-[#F2CA04] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2.5">
                    <h1 className="text-3xl font-black tracking-tighter text-slate-950">MART.OS</h1>
                    <span className="bg-slate-950 text-[#F2CA04] border border-slate-900/50 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                      v4.2 STABLE
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 font-black tracking-wide">
                    SECURED ENTERPRISE-GRADE MULTI-ROLE HYPERLOCAL LOGISTICS CONSOLE
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center bg-slate-950 text-white border border-slate-900 shadow-lg px-4 py-3 rounded-2xl">
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-widest">GATEWAY NODE STATUS</span>
                  <div className="font-mono text-xs text-emerald-400 font-black tracking-wide flex items-center gap-1.5 justify-end">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE (PORT 3000)
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Split: Left Interactive Authenticator Tools, Right Personas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: ACTIVE INTERACTIVE AUTHENTICATOR UTILITY */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Main Form / Handshake Status */}
                <div className="bg-slate-950 border border-slate-900 shadow-2xl rounded-[32px] p-6 sm:p-8 relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-3xl" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                      <Lock className="h-5 w-5 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest block">AUTHENTICATION LAYER</span>
                      <h3 className="text-lg font-black text-white tracking-tight">Active Handshake Protocol</h3>
                    </div>
                  </div>

                  {/* Selected Role Overview Banner */}
                  <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-left mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest block font-bold">SELECTED INSTANCE PROFILE</span>
                      <span className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded shadow-sm ${
                        SIMULATED_ROLES.find(r => r.name === loginSelectedRole)?.badgeColor || 'bg-slate-550 text-white font-black'
                      }`}>
                        {loginSelectedRole}
                      </span>
                    </div>
                    <h4 className="text-md font-extrabold text-[#96dad7] mt-1">{loginSelectedRole} Terminal</h4>
                    <p className="text-[11px] text-slate-350 font-semibold leading-relaxed mt-1.5 min-h-[44px]">
                      {SIMULATED_ROLES.find(r => r.name === loginSelectedRole)?.desc || "Secure system identity node selection required."}
                    </p>
                    <div className="mt-2.5 pt-2.5 border-t border-white/5 flex gap-2 overflow-x-auto text-[9px] text-slate-400 font-semibold font-mono whitespace-nowrap">
                      <span>Scopes:</span>
                      <span className="text-pink-400">{SIMULATED_ROLES.find(r => r.name === loginSelectedRole)?.scope || "None"}</span>
                    </div>
                  </div>

                  {/* Auth Inputs based on Selected Role */}
                  <div className="space-y-4 text-left">
                    {/* Phone/Direct Social component for Customer */}
                    {loginSelectedRole === 'Customer' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-pink-400 font-bold uppercase tracking-wider block mb-1.5">Direct Mobile Access Link</label>
                          <div className="relative">
                            <input 
                              type="tel"
                              value={loginPhone}
                              onChange={(e) => setLoginPhone(e.target.value)}
                              placeholder="+91 98200 12345"
                              className="w-full rounded-xl bg-slate-950 border border-pink-500/30 px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#c82a5c] transition-all"
                            />
                            <span className="absolute right-3.5 top-3.5 text-[9px] text-[#c82a5c] font-black uppercase tracking-widest animate-pulse">DIRECT VIEW BYPASS</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                            No passcode needed! The mobile gateway is configured for auto-OTP bypass on consumer accounts.
                          </p>
                        </div>

                        {/* Customer One-Click Social Logins & Guest view bypass */}
                        <div className="space-y-2.5 pt-1.5">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">⚡ Social Channels One-Click Integration</span>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setUserAuth({
                                  isLoggedIn: true,
                                  name: "Guest Shopper (Google Connected)",
                                  email: "shopper.google@gmail.com",
                                  phone: "+91 99999 88888",
                                  walletBalance: 2000.00,
                                  loyaltyPoints: 120,
                                  referralCode: "MART-GOOG-88"
                                });
                                setView('shop');
                                setActiveRole('Customer');
                                setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SOCIAL_AUTH: Google OAuth One-Tap handshake validated.`]);
                              }}
                              className="rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/5 py-2 px-3 text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                            >
                              <span className="text-[#ea4335] font-black text-xs font-serif font-bold">G</span>
                              <span>Google Sign-In</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setUserAuth({
                                  isLoggedIn: true,
                                  name: "Apple Client Private ID",
                                  email: "shopper.apple@icloud.com",
                                  phone: "+91 77777 66666",
                                  walletBalance: 5000.00,
                                  loyaltyPoints: 500,
                                  referralCode: "MART-APPLE-01"
                                });
                                setView('shop');
                                setActiveRole('Customer');
                                setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SOCIAL_AUTH: Apple Secure Enclave token verified.`]);
                              }}
                              className="rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/5 py-2 px-3 text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                            >
                              <span className="text-[13px] leading-none mb-0.5">🍎</span>
                              <span>Apple ID Connect</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setUserAuth({
                                isLoggedIn: true,
                                  name: "Aesthetic Guest Viewer",
                                  email: "viewer.anonymous@martly.io",
                                  phone: "+91 00000 00000",
                                  walletBalance: 1000.00,
                                  loyaltyPoints: 10,
                                  referralCode: "GUEST-BYPASS"
                              });
                              setView('shop');
                              setActiveRole('Customer');
                              setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] DIRECT_BYPASS: Customer Guest session instant mount.`]);
                            }}
                            className="w-full rounded-xl bg-pink-650/15 hover:bg-pink-600/30 border border-pink-500/20 py-2.5 text-[9.5px] font-black text-pink-300 uppercase tracking-widest transition-all cursor-pointer text-center block"
                          >
                            🚀 Instant Direct View / Fast Checkout Guest
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block font-bold">Authorized Security Code</label>
                          <span className="text-[9px] text-[#96dad7] font-mono font-bold">Terminal: {rolePins[loginSelectedRole]?.id}</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="password"
                            value={loginPasscode}
                            onChange={(e) => setLoginPasscode(e.target.value)}
                            placeholder="••••• Enter security PIN code"
                            className="w-full rounded-xl bg-slate-950 border border-white/10 px-4 py-3 text-xs font-mono font-black text-brand-green focus:outline-none focus:border-brand-green transition-all tracking-widest"
                          />
                          <span className="absolute right-3.5 top-3.5 text-[9px] text-slate-500 font-semibold">
                            ACTIVE PIN: <strong className="text-emerald-400 font-mono font-black select-all">{rolePins[loginSelectedRole]?.pin || '12345'}</strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quick Numeric Passcode Keypad */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⚡'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            if (num === 'C') {
                              setLoginPasscode('');
                            } else if (num === '⚡') {
                              // Autofill default passcode based on simulated credentials
                              if (loginSelectedRole === 'Customer') {
                                setLoginPhone('+91 98200 12345');
                                setLoginPasscode(rolePins['Customer']?.pin || '1234');
                              } else {
                                setLoginPasscode(rolePins[loginSelectedRole]?.pin || '12345');
                              }
                            } else {
                              if (loginPasscode.length < 8) {
                                setLoginPasscode(prev => prev + num);
                              }
                            }
                          }}
                          className="rounded-xl bg-slate-900 hover:bg-slate-805 tracking-wider font-extrabold text-xs text-white py-2.5 font-mono border border-slate-850 active:scale-95 transition-all cursor-pointer flex items-center justify-center animate-pulse"
                        >
                          {num}
                        </button>
                      ))}
                      
                      {/* Interactive Login Action */}
                      <button
                        onClick={() => {
                          // Perform login based on selected role
                          if (loginSelectedRole === 'Customer') {
                            setUserAuth({
                              isLoggedIn: true,
                              name: "Rajesh Kumar",
                              email: "rajesh.kumar@mumbai.io",
                              phone: loginPhone || "+91 98200 12345",
                              walletBalance: 1450.00,
                              loyaltyPoints: 360,
                              referralCode: "MART-MUM-982"
                            });
                            setView('shop');
                            setActiveRole('Customer');
                            setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] AUTH_GRANTED: Rajesh Kumar logged in.`]);
                          } else {
                            const expectedPin = rolePins[loginSelectedRole]?.pin || '12345';
                            if (loginPasscode !== expectedPin) {
                              alert(`⚠️ SECURE ACCESS DENIED\n\nThe passcode "${loginPasscode}" for "${loginSelectedRole}" is incorrect.\n\nActive configured security key is: "${expectedPin}".\n(This can be reprogrammed in the RBAC Security tab inside the Admin panel).`);
                              return;
                            }
                            const rName = loginSelectedRole as any;
                            setActiveRole(rName);
                            if (rName === 'Delivery Rider') {
                              setRiderAuth({ isLoggedIn: true, username: rolePins['Delivery Rider']?.id || "RIDER-881" });
                              setView('admin');
                              setAdminTab('delivery');
                            } else if (rName === 'Vendor') {
                              setVendorAuthCode(rolePins['Vendor']?.id || "VEND-BOMBAYAGRO");
                              setView('admin');
                              setAdminTab('vendor');
                            } else {
                              const scopeString = SIMULATED_ROLES.find(r => r.name === rName)?.scope || "dashboard";
                              const firstTab = scopeString.split(',')[0].trim();
                              setView('admin');
                              setAdminTab(firstTab);
                            }
                            
                            const payload = { role: loginSelectedRole, sub: rolePins[loginSelectedRole]?.id || "admin_inst", exp: Math.floor(Date.now() / 1000) + 3600 };
                            const generatedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + btoa(JSON.stringify(payload)) + ".security_sig";
                            setSecurityJwtToken(generatedToken);
                            
                            const log = `[${new Date().toLocaleTimeString()}] AUTH_GRANTED: Role ${loginSelectedRole} entered. Signature Token generated successfully.`;
                            setAuthHandshakeLogs(prev => [...prev, log]);
                            setOrderLogs(prev => [...prev, log]);
                            setSecurityMfaVerified(true);
                          }
                        }}
                        className="col-span-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 py-3.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-lg shadow-teal-550/20 flex items-center justify-center gap-2 mt-2"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>VERIFY PROTOCOL & SIGN IN</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Reset all user/admin panel login credentials to factory defaults?")) {
                            localStorage.removeItem('martly_role_pins');
                            const defaultPins = {
                              'Super Admin': { pin: '12345', id: 'ADMIN-CORE-001', authMethod: 'pin' },
                              'Corporate Admin': { pin: '12345', id: 'CORP-CENTRAL-002', authMethod: 'pin' },
                              'Branch Manager': { pin: '12345', id: 'BRANCH-BKC-003', authMethod: 'pin' },
                              'Cashier': { pin: '12345', id: 'CASH-REG-004', authMethod: 'pin' },
                              'Warehouse Staff': { pin: '12345', id: 'WH-BKC-005', authMethod: 'pin' },
                              'Delivery Rider': { pin: '12345', id: 'RIDER-881', authMethod: 'pin' },
                              'Vendor': { pin: '12345', id: 'VEND-BOMBAYAGRO', authMethod: 'pin' },
                              'Accountant': { pin: '12345', id: 'ACC-LEDGER-008', authMethod: 'pin' },
                              'CRM Executive': { pin: '12345', id: 'CRM-DISCOUNT-009', authMethod: 'pin' },
                              'Customer': { pin: '1234', id: 'CUST-RAJESH-982', authMethod: 'social_direct' }
                            };
                            setRolePins(defaultPins);
                            setLoginPasscode('');
                            alert("✅ System security PINs have been restored to default values.\n\nAll operational dashboards can now be entered using passcode \"12345\".");
                          }
                        }}
                        className="col-span-12 py-1 text-[8.5px] font-bold text-slate-500 hover:text-rose-450 hover:underline transition-all font-mono tracking-widest text-center cursor-pointer mt-1"
                      >
                        ⚠️ RESET ALL PINS TO SYSTEM DEFAULT
                      </button>
                    </div>

                  </div>
                </div>

                {/* 2. Biometric Scan Simulation Handshake */}
                <div className="bg-slate-950 border border-slate-900 shadow-2xl rounded-[32px] p-6 text-left text-white relative overflow-hidden">
                  <span className="text-[8px] font-black text-pink-550 uppercase tracking-widest block mb-1">BIOMETRICS ACCESS POINT</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setIsBiometricScanning(true);
                        setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] BIOMETRIC_INIT: Scanning core fingerprint sensor...`]);
                        setTimeout(() => {
                          setIsBiometricScanning(false);
                          const rName = loginSelectedRole as any;
                          setActiveRole(rName);
                          if (rName === 'Customer') {
                            setUserAuth({
                              isLoggedIn: true,
                              name: "Rajesh Kumar",
                              email: "rajesh.kumar@mumbai.io",
                              phone: "+91 98200 12345",
                              walletBalance: 1450.00,
                              loyaltyPoints: 360,
                              referralCode: "MART-MUM-982"
                            });
                            setView('shop');
                          } else if (rName === 'Delivery Rider') {
                            setRiderAuth({ isLoggedIn: true, username: "RIDER-881" });
                            setView('admin');
                            setAdminTab('delivery');
                          } else if (rName === 'Vendor') {
                            setVendorAuthCode("VEND-BOMBAYAGRO");
                            setView('admin');
                            setAdminTab('vendor');
                          } else {
                            const scopeString = SIMULATED_ROLES.find(r => r.name === rName)?.scope || "dashboard";
                            const firstTab = scopeString.split(',')[0].trim();
                            setView('admin');
                            setAdminTab(firstTab);
                          }
                          const log = `[${new Date().toLocaleTimeString()}] BIOMETRIC_SUCCESS: Biometric profile verified. Entered secure space.`;
                          setAuthHandshakeLogs(prev => [...prev, log]);
                          alert(`Biometrics Handshake Verified!\n\nAccess successfully granted to: ${loginSelectedRole}.`);
                        }, 1200);
                      }}
                      className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-brand-green hover:text-emerald-400 focus:outline-none relative transition-all active:scale-95 shadow-inner cursor-pointer"
                    >
                      {isBiometricScanning && (
                        <div className="absolute inset-2 bg-brand-green/10 rounded-xl animate-ping" />
                      )}
                      <Fingerprint className={`h-10 w-10 ${isBiometricScanning ? 'text-rose-500 animate-pulse' : 'text-brand-green'}`} />
                    </button>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Biometric Fingerprint Matcher</h4>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1 pr-4 font-semibold">
                        Press the fingerprint widget above to simulate instant hardware secure-enclave auth bypass for <strong className="text-[#96dad7]">{loginSelectedRole}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Live Handshake logs ticker */}
                <div className="bg-slate-950/95 border border-slate-900 rounded-2xl p-4 text-left font-mono shadow-md">
                  <span className="text-[8px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-2">LOCAL TELEMETRY SYSTEM REGISTRY</span>
                  <div className="space-y-1 text-[9px] text-[#96dad7] max-h-[100px] overflow-y-auto font-medium">
                    {authHandshakeLogs.map((log, i) => (
                      <div key={i} className="leading-tight select-none">
                        <span className="text-slate-600 mr-1.5">&gt;</span> {log}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: ENTERPRISE ACCREDITED PERSONAS DIRECTORY */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-950/15">
                  <div className="text-left">
                    <span className="text-[9.5px] font-black text-[#c82a5c] uppercase tracking-widest block">CREDENTIALS DIRECTORY</span>
                    <h3 className="text-lg font-black text-slate-950">Choose Your Operational Instance</h3>
                  </div>
                  <span className="text-[10px] bg-slate-950 border border-slate-900 px-2.5 py-1 text-slate-200 font-bold font-mono rounded-lg shadow-sm">
                    10 SECURE ROLES
                  </span>
                </div>

                {/* Persona groups categorized */}
                <div className="space-y-6">
                  
                  {/* CATEGORY 1: RETAIL STOREFRONT */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#2e1065] font-black uppercase tracking-wider text-left block">
                      🛍️ Retail Client Channels
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SIMULATED_ROLES.filter(r => r.name === 'Customer').map(role => (
                        <div 
                          key={role.name}
                          onClick={() => {
                            setLoginSelectedRole(role.name);
                            setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ID_STATION: Loaded Customer Rajesh Kumar credentials.`]);
                          }}
                          className={`group rounded-2xl border p-4 text-left cursor-pointer transition-all select-none relative overflow-hidden shadow-md ${
                            loginSelectedRole === role.name 
                              ? 'bg-gradient-to-tr from-rose-950 to-pink-955 border-[#c82a5c] shadow-xl ring-2 ring-pink-550/20' 
                              : 'bg-slate-950 border-slate-900/80 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="rounded bg-pink-650 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 text-white">
                              {role.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono font-bold">Demo Auto</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-white">Rajesh Kumar Storefront</h4>
                          <p className="text-[10px] text-slate-350 leading-normal mt-1 pr-6 font-semibold">
                            Enter the high-contrast client webshop, manage personal digital e-wallets, or test rapid q-comm deliveries.
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-pink-400">
                            <span>Scope: retail_storefront</span>
                            <span className="group-hover:translate-x-1 transition-transform">Instant Switch &gt;&gt;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CATEGORY 2: ENTERPRISE ADMINISTRATION */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#713f12] font-black uppercase tracking-wider text-left block">
                      🏛️ Corporate & Command Portals (ADMIN Access)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SIMULATED_ROLES.filter(r => ['Super Admin', 'Corporate Admin', 'Branch Manager'].includes(r.name)).map(role => (
                        <div 
                          key={role.name}
                          onClick={() => {
                            setLoginSelectedRole(role.name);
                            setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ID_STATION: Loaded ${role.name} corporate keys.`]);
                          }}
                          className={`group rounded-2xl border p-4 text-left cursor-pointer transition-all select-none relative shadow-md ${
                            loginSelectedRole === role.name 
                              ? 'bg-gradient-to-tr from-indigo-950 to-slate-900 border-indigo-550 shadow-xl ring-2 ring-indigo-500/10' 
                              : 'bg-slate-950 border-slate-900/80 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`rounded font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 ${role.badgeColor}`}>
                              {role.name}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-white">{role.name} Console</h4>
                          <p className="text-[10px] text-slate-350 leading-relaxed mt-1 font-semibold line-clamp-2">
                            {role.desc}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-indigo-300 pt-1 border-t border-white/5">
                            <span>PIN CODE: <strong className="text-emerald-400 font-mono font-bold select-all">{rolePins[role.name]?.pin || '12345'}</strong></span>
                            <span className="group-hover:translate-x-1 transition-transform font-bold">Unlock Node &gt;&gt;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CATEGORY 3: BACK-OFFICE OPERATIONS */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#115e59] font-black uppercase tracking-wider text-left block">
                      ⚙️ Logistics Back-Office Control Terminals
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {SIMULATED_ROLES.filter(r => ['Accountant', 'CRM Executive', 'Warehouse Staff'].includes(r.name)).map(role => (
                        <div 
                          key={role.name}
                          onClick={() => {
                            setLoginSelectedRole(role.name);
                            setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ID_STATION: Loaded Back-Office ${role.name} profile.`]);
                          }}
                          className={`group rounded-2xl border p-3.5 text-left cursor-pointer transition-all select-none relative shadow-sm flex flex-col justify-between ${
                            loginSelectedRole === role.name 
                              ? 'bg-gradient-to-tr from-teal-950 to-emerald-955 border-teal-650 shadow-xl ring-2 ring-teal-500/10' 
                              : 'bg-slate-950 border-slate-900/80 hover:border-slate-800'
                          }`}
                        >
                          <div>
                            <span className={`rounded font-black text-[8px] uppercase px-1.5 py-0.5 ${role.badgeColor} block w-fit mb-2`}>
                              {role.name}
                            </span>
                            <h4 className="text-xs font-extrabold text-white leading-tight">{role.name}</h4>
                            <p className="text-[9.5px] text-slate-350 leading-normal mt-1 font-semibold line-clamp-3">
                              {role.desc}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-teal-300 pt-1.5 border-t border-white/5">
                            <span>PIN: <strong className="text-emerald-400 font-mono font-bold select-all">{rolePins[role.name]?.pin || '12345'}</strong></span>
                            <span className="group-hover:translate-x-0.5 transition-transform font-bold">Launch &gt;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CATEGORY 4: FRONTLINE LOGISTICS */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-[#065f46] font-black uppercase tracking-wider text-left block">
                      🚚 Frontline Distribution Networks & Sourcing
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {SIMULATED_ROLES.filter(r => ['Delivery Rider', 'Vendor', 'Cashier'].includes(r.name)).map(role => (
                        <div 
                          key={role.name}
                          onClick={() => {
                            setLoginSelectedRole(role.name);
                            setAuthHandshakeLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ID_STATION: Selected Frontline ${role.name} station.`]);
                          }}
                          className={`group rounded-2xl border p-3.5 text-left cursor-pointer transition-all select-none relative shadow-sm flex flex-col justify-between ${
                            loginSelectedRole === role.name 
                              ? 'bg-gradient-to-tr from-emerald-955 to-teal-955 border-emerald-650 shadow-xl ring-2 ring-emerald-500/10' 
                              : 'bg-slate-950 border-slate-900/80 hover:border-slate-800'
                          }`}
                        >
                          <div>
                            <span className={`rounded font-black text-[8px] uppercase px-1.5 py-0.5 ${role.badgeColor} block w-fit mb-2`}>
                              {role.name}
                            </span>
                            <h4 className="text-xs font-extrabold text-white leading-tight">{role.name}</h4>
                            <p className="text-[9.5px] text-slate-350 leading-normal mt-1 font-semibold line-clamp-3">
                              {role.desc}
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-emerald-300 pt-1.5 border-t border-white/5">
                            <span>PIN: <strong className="text-emerald-400 font-mono font-bold select-all">{rolePins[role.name]?.pin || '12345'}</strong></span>
                            <span className="group-hover:translate-x-0.5 transition-transform font-bold">Open &gt;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Secure Fast Direct Bypass links */}
                <div className="bg-slate-950 border border-slate-900 shadow-2xl rounded-3xl p-5 text-left space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-400 animate-bounce" />
                    <span className="text-[9px] text-[#96dad7] font-black uppercase tracking-widest block">SECURE ENTERPRISE BYPASS CODES MATRIX</span>
                  </div>
                  <p className="text-[10px] text-slate-350 leading-relaxed font-semibold">
                    Bypass individual manual passcode configurations. Press a credentials node below to instantly trigger cryptographically verified claims and mount respective panels:
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-1 text-left">
                    <button 
                      onClick={() => {
                        setUserAuth({
                          isLoggedIn: true,
                          name: "Rajesh Kumar",
                          email: "rajesh.kumar@mumbai.io",
                          phone: "+91 98200 12345",
                          walletBalance: 1450.00,
                          loyaltyPoints: 360,
                          referralCode: "MART-MUM-982"
                        });
                        setView('shop');
                        setActiveRole('Customer');
                      }}
                      className="rounded-lg bg-pink-950/40 hover:bg-pink-900/45 border border-pink-700/30 text-pink-300 font-extrabold text-[9px] px-3 py-2 uppercase tracking-tight cursor-pointer"
                    >
                      🛍️ Retail Client
                    </button>

                    <button 
                      onClick={() => {
                        setActiveRole('Super Admin');
                        setView('admin');
                        setAdminTab('dashboard');
                        setSecurityMfaVerified(true);
                      }}
                      className="rounded-lg bg-red-955/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 font-extrabold text-[9px] px-3 py-2 uppercase tracking-tight cursor-pointer animate-pulse"
                    >
                      🔴 Main Super Admin
                    </button>

                    <button 
                      onClick={() => {
                        setRiderAuth({ isLoggedIn: true, username: "RIDER-881" });
                        setActiveRole('Delivery Rider');
                        setView('admin');
                        setAdminTab('delivery');
                      }}
                      className="rounded-lg bg-amber-955/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 font-extrabold text-[9px] px-3 py-2 uppercase tracking-tight cursor-pointer"
                    >
                      🚴 Rider Portal
                    </button>

                    <button 
                      onClick={() => {
                        setVendorAuthCode("VEND-BOMBAYAGRO");
                        setActiveRole('Vendor');
                        setView('admin');
                        setAdminTab('vendor');
                      }}
                      className="rounded-lg bg-teal-955/40 hover:bg-teal-900/50 border border-teal-500/30 text-teal-300 font-extrabold text-[9px] px-3 py-2 uppercase tracking-tight cursor-pointer"
                    >
                      🌾 Staples Vendor
                    </button>

                    <button 
                      onClick={() => {
                        setActiveRole('Accountant');
                        setView('admin');
                        setAdminTab('finance');
                      }}
                      className="rounded-lg bg-cyan-955/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 font-extrabold text-[9px] px-3 py-2 uppercase tracking-tight cursor-pointer"
                    >
                      📊 Ledger Books
                    </button>

                    <button 
                      onClick={() => {
                        setActiveRole('CRM Executive');
                        setView('admin');
                        setAdminTab('crm');
                      }}
                      className="rounded-lg bg-orange-955/40 hover:bg-orange-900/50 border border-orange-500/30 text-orange-300 font-extrabold text-[9px] px-3 py-2 uppercase tracking-tight cursor-pointer"
                    >
                      📣 Coupons & Support
                    </button>
                  </div>
                </div>

              </div>
              
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="bg-slate-950 border-t border-slate-900 py-4 px-4 sm:px-6 lg:px-8 text-center text-slate-450 font-mono text-[9px] tracking-widest relative z-10 select-none uppercase shadow-inner">
            <p>
              MART.OS SECURE SHELL CODES EXCLUSIVE TO ACTIVE TERMINALS. AES-256 DIGITAL ENCRYPTED BYPASS INTERFACE.
            </p>
          </div>
        </div>
      ) : (
        <>
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-header-gradient px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex cursor-pointer flex-col" onClick={() => {
              setView('shop');
              setSelectedCategory(null);
              setSearchQuery('');
              setAiSuggestions([]);
            }}>
              <div className="text-2xl font-black tracking-tighter text-white animate-pulse">MART.OS</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Enterprise Edition</div>
            </div>

            {/* Branch Selector & GPS Detection */}
            {view === 'shop' && (
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-white">
                  <MapPin className="h-4 w-4 text-white/80 animate-bounce" />
                  <select 
                    className="bg-transparent text-xs font-bold uppercase tracking-wider focus:outline-none text-white cursor-pointer [&>option]:text-brand-navy [&>option]:bg-white"
                    value={selectedBranch?.id || ''}
                    onChange={(e) => setSelectedBranch(branches.find(b => b.id === e.target.value) || null)}
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    alert("GPS Coordinate Engine: Locating BKC latitude 19.076... Matching radius index... Nearest hub successfully auto-detected to: Downtown Mumbai Hub.");
                    const target = branches.find(b => b.id === 'br-1') || branches[0];
                    setSelectedBranch(target);
                  }}
                  title="Auto Detect Location via GPS"
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white hover:bg-white/15 cursor-pointer flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                >
                  <MapPin className="h-3 w-3 text-brand-green" />
                  <span>GPS AUTO</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Bar with Simulated Voice & Barcode search options */}
          {view === 'shop' && (
            <div className="relative mx-4 flex-1 max-w-md hidden sm:block">
              <input
                type="text"
                placeholder={language === 'hi' ? "उत्पाद, ऑर्डर या ब्रांड खोजें..." : language === 'mr' ? "उत्पाद किंवा ब्रँड शोधा..." : "SEARCH SKU, BRAND, OR CATEGORIES..."}
                className="w-full rounded-full border border-white/10 bg-white/10 text-white placeholder:text-white/50 focus:bg-white/15 py-2.5 pl-11 pr-20 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand-green focus:outline-none focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-white/60" />
              
              <div className="absolute right-3 top-2 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsVoiceActive(true);
                    setSearchQuery('LISTENING...');
                    setTimeout(() => {
                      setSearchQuery('Premium Basmati Rice');
                      setIsVoiceActive(false);
                      alert('Voice Recognition Success: Transcribed "Premium Basmati Rice"');
                    }, 1800);
                  }}
                  className={`p-1 text-white/70 hover:text-white cursor-pointer rounded-md ${isVoiceActive ? 'text-brand-green bg-white/10 animate-ping' : ''}`}
                  title="Simulate Voice Search"
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsBarcodeScanning(true);
                    setSearchQuery('SCANNING CANNER...');
                    setTimeout(() => {
                      setSearchQuery('Artisanal Sourdough Bread');
                      setIsBarcodeScanning(false);
                      alert('Barcode Engine parsed: UPC-05202688 (Artisanal Sourdough Bread)');
                    }, 1500);
                  }}
                  className={`p-1 text-white/70 hover:text-white cursor-pointer rounded-md ${isBarcodeScanning ? 'text-brand-green bg-white/10 animate-pulse' : ''}`}
                  title="Simulate Barcode / SKU Scan"
                >
                  <QrCode className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            {view === 'shop' && (
              <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-1 text-white text-xs">
                <Globe className="h-3 w-3 text-slate-300 ml-1.5" />
                <select
                  className="bg-transparent text-[10px] font-black uppercase tracking-wider focus:outline-none text-white cursor-pointer mr-1.5"
                  value={language}
                  onChange={(e: any) => setLanguage(e.target.value)}
                >
                  <option className="text-brand-navy" value="en">EN</option>
                  <option className="text-brand-navy" value="hi">हिन्दी</option>
                  <option className="text-brand-navy" value="mr">मराठी</option>
                </select>
              </div>
            )}

            {/* View Offers button */}
            {view === 'shop' && (
              <button 
                onClick={() => setIsOffersOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-2.5 py-2 text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all cursor-pointer"
                title="View active promotional offers and coupon system"
              >
                <Tag className="h-3.5 w-3.5 text-brand-green animate-pulse" />
                <span className="hidden sm:inline">OFFERS</span>
              </button>
            )}

            {/* Profile / Wallet quick status */}
            {view === 'shop' && userAuth.isLoggedIn && (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-2.5 py-1.5 text-left text-white cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="rounded-full bg-brand-green/20 p-1 text-brand-green font-bold text-xs w-6 h-6 flex items-center justify-center">
                  RK
                </div>
                <div className="text-[10px] hidden xs:block">
                  <div className="font-extrabold tracking-tight">Account & Wallet</div>
                  <div className="font-mono text-brand-green font-black">₹{userAuth.walletBalance.toFixed(2)}</div>
                </div>
              </button>
            )}

            {view === 'shop' && !userAuth.isLoggedIn && (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:opacity-95 transition-all cursor-pointer shadow-md animate-pulse"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>SIGN IN</span>
              </button>
            )}

            {/* Wishlist Button */}
            {view === 'shop' && (
              <button 
                onClick={() => {
                  if (wishlist.length === 0) {
                    alert("Your wishlist is empty! Heart products inside catalog grid.");
                    return;
                  }
                  setSelectedCategory(selectedCategory === 'wishlist' ? null : 'wishlist');
                }}
                className={`relative rounded-xl border p-2.5 transition-all shadow-sm cursor-pointer ${selectedCategory === 'wishlist' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/10 border-white/15 text-white hover:bg-white/20'}`}
                title="View My Wishlist"
              >
                <Heart className="h-5 w-5 fill-current" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-400 text-[9px] font-black text-white border border-rose-600">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Direct Switch to Secure Login / Persona Hub */}
            <button 
              onClick={() => {
                setView('login');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider text-amber-400 hover:bg-orange-550/25 hover:text-amber-300 transition-all cursor-pointer shadow-sm"
              title="Secure Logout / Switch Persona Hub"
            >
              <Power className="h-4 w-4 text-amber-500 animate-pulse" />
              <span className="hidden sm:inline">SW PORTAL</span>
            </button>

            <button 
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${view === 'admin' ? 'bg-brand-green text-brand-navy shadow-lg shadow-brand-green/20 scale-105' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
              onClick={() => setView(view === 'shop' ? 'admin' : 'shop')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:block">Operator</span>
            </button>
            <button className="relative rounded-xl bg-white/10 border border-white/15 p-2.5 text-white hover:bg-white/20 transition-all shadow-sm" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-black text-brand-navy border-2 border-[#4c0519]">
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
            {/* Live Order Tracker & Fulfillment Protocol Widget */}
            {activeOrderTrack && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 overflow-hidden rounded-[32px] border-2 border-[#c82a5c]/20 bg-white shadow-xl text-left"
              >
                {/* Header banner */}
                <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c82a5c]">hyperlocal fulfillment engine live tracking</span>
                    <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                       Active Protocol: {activeOrderTrack.id}
                       <span className="rounded bg-teal-500 font-mono text-[9px] font-extrabold uppercase px-2 py-0.5 text-slate-900 animate-pulse">Running</span>
                    </h3>
                  </div>
                  
                  {/* Simulation Controls */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        const nextStep = activeOrderTrack.step + 1;
                        if (nextStep > 7) {
                          alert("Order fully fulfilled! Terminating simulation session.");
                          setActiveOrderTrack(null);
                          return;
                        }
                        const steps = [
                          "Order Placed", 
                          "Store Auto Detected & Approved (Downtown Mumbai Hub)", 
                          "Fulfillment Picker Assigned", 
                          "Packer Packaging Complete", 
                          "Logistics Courier Dispatched", 
                          "Rider Live GPS Route Transit", 
                          "Consignment Arrived & Delivered", 
                          "Feedback and Rating"
                        ];
                        const log = `[${new Date().toLocaleTimeString()}] UPDATE: Shifted to phase ${nextStep} - ${steps[nextStep]}`;
                        setOrderLogs(prev => [...prev, log]);
                        setActiveOrderTrack(prev => ({ ...prev, step: nextStep }));
                      }}
                      className="rounded-xl bg-brand-green px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1e293b] hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer"
                    >
                      Advance Phase ({activeOrderTrack.step}/7)
                    </button>
                    <button
                      onClick={() => {
                        alert("Starting Live Auto-Simulation Protocol (T-Minus 15s to Delivery)...");
                        let crrStep = activeOrderTrack.step;
                        const steps = [
                          "Order Placed & Registered with Central Ledger.", 
                          "Store Auto Detected & Approved (Downtown Mumbai Hub)", 
                          "Fulfillment Picker (Suresh Patil) Assigned - Picking Items.", 
                          "Packer (Ketan Kadam) sealed consignment in insulated bag.", 
                          "Logistics Courier (Amit Patel #881) Dispatched on electric scooter.", 
                          "Rider Live GPS Route Transit - Near BKC junction.", 
                          "Consignment Arrived at Doorstep & Delivered.", 
                          "Fulfillment rating registry session open."
                        ];
                        const interval = setInterval(() => {
                          if (crrStep >= 7) {
                            clearInterval(interval);
                            return;
                          }
                          crrStep += 1;
                          const log = `[${new Date().toLocaleTimeString()}] PROG: ${steps[crrStep]}`;
                          setOrderLogs(prev => [...prev, log]);
                          setActiveOrderTrack(prev => ({ ...prev, step: crrStep }));
                        }, 2500);
                      }}
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                    >
                      Autoplay Stream
                    </button>
                    <button
                      onClick={() => setActiveOrderTrack(null)}
                      className="text-white/60 hover:text-white p-2"
                      title="Dismiss tracker"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Visual Timeline */}
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <span className="block text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6">Fulfillment Pipeline Timeline Chronology</span>
                  <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-2">
                    {/* Line behind */}
                    <div className="absolute left-[15px] lg:left-0 lg:top-4 h-[85%] lg:h-1 w-1 lg:w-full bg-slate-200 z-0" />
                    <div 
                      className="absolute left-[15px] lg:left-0 lg:top-4 h-[85%] lg:h-1 w-1 lg:w-full bg-[#c82a5c] transition-all duration-500 z-0" 
                      style={{ 
                        height: window.innerWidth < 1024 ? `${(activeOrderTrack.step / 7) * 85}%` : undefined,
                        width: window.innerWidth >= 1024 ? `${(activeOrderTrack.step / 7) * 100}%` : undefined 
                      }} 
                    />

                    {[
                      { s: 0, label: "Placed", desc: "Settled via Wallet", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                      { s: 1, label: "Detection", desc: "Hub Auto-Allocated", icon: <MapPin className="h-3.5 w-3.5" /> },
                      { s: 2, label: "Picking", desc: "Suresh P. assigned", icon: <User className="h-3.5 w-3.5" /> },
                      { s: 3, label: "Packing", desc: "Ketan K. sealed", icon: <Package className="h-3.5 w-3.5" /> },
                      { s: 4, label: "Dispatched", desc: "Amit P. rider #881", icon: <Truck className="h-3.5 w-3.5" /> },
                      { s: 5, label: "Transit Tracker", desc: "Auto-Simulating Route", icon: <Clock className="h-3.5 w-3.5" /> },
                      { s: 6, label: "Arrived", desc: "Signature Confirmed", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
                      { s: 7, label: "Feedback Rating", desc: "Review experience", icon: <Star className="h-3.5 w-3.5" /> }
                    ].map((stepItem) => {
                      const done = activeOrderTrack.step >= stepItem.s;
                      const active = activeOrderTrack.step === stepItem.s;
                      return (
                        <div key={stepItem.s} className="relative z-10 flex lg:flex-col items-center gap-4 lg:gap-2 text-left lg:text-center flex-1">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 font-bold text-xs ring-4 ${done ? 'bg-[#c82a5c] text-white ring-rose-100' : 'bg-white text-slate-400 ring-slate-100 border border-slate-300'}`}>
                            {stepItem.icon}
                          </div>
                          <div>
                            <div className={`text-[10px] font-black uppercase tracking-wider ${active ? 'text-[#c82a5c]' : done ? 'text-slate-800' : 'text-slate-400'}`}>{stepItem.label}</div>
                            <div className="text-[8px] font-bold text-slate-500 max-w-[120px] hidden sm:block">{stepItem.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub components based on active phase */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                  {/* Left Column: Stage details or simulated active map */}
                  <div className="md:col-span-8 space-y-4">
                    {/* Live GPS simulated tracker routes map */}
                    {activeOrderTrack.step === 5 ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 relative overflow-hidden h-48 flex flex-col justify-end">
                        {/* Fake map graphics */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:12px_12px]" />
                        <div className="absolute top-8 left-12 w-2/3 h-24 border-2 border-dashed border-slate-300 rounded-full" />
                        
                        {/* Route Line */}
                        <svg className="absolute inset-0 h-full w-full pointer-events-none">
                          <path d="M 50 120 Q 150 50, 250 140 T 450 60" fill="none" stroke="#ddd" strokeWidth="6" strokeLinecap="round" />
                          <path d="M 50 120 Q 150 50, 250 140 T 450 60" fill="none" stroke="#c82a5c" strokeWidth="6" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="240" className="animate-pulse" />
                        </svg>

                        {/* Store Pin */}
                        <div className="absolute left-[38px] top-[100px] flex flex-col items-center">
                          <Building className="h-6 w-6 text-slate-700 bg-white p-1 rounded-full border shadow" />
                          <span className="text-[7px] font-black text-slate-700 bg-white px-1 py-0.5 rounded shadow mt-1 uppercase">BKC HUB</span>
                        </div>

                        {/* Customer Pin */}
                        <div className="absolute right-[128px] top-[40px] flex flex-col items-center">
                          <Home className="h-6 w-6 text-brand-navy bg-white p-1 rounded-full border shadow animate-bounce" />
                          <span className="text-[7px] font-black text-brand-navy bg-white px-1 py-0.5 rounded shadow mt-1 uppercase">Rajesh (Home)</span>
                        </div>

                        {/* Moving Rider */}
                        <div className="absolute left-[150px] top-[75px] flex flex-col items-center animate-bounce">
                          <Truck className="h-8 w-8 text-[#c82a5c] bg-white p-1.5 rounded-full border border-rose-300 shadow-lg" />
                          <span className="text-[7px] font-black text-rose-800 bg-rose-100 px-1 py-0.5 rounded shadow mt-1 uppercase animate-pulse">Rider 881 moving...</span>
                        </div>

                        <div className="relative z-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-rose-200 inline-block w-fit text-left">
                          <div className="text-[8px] font-black uppercase text-rose-800 tracking-wider">Simulated Live GPS Satellite Stream</div>
                          <div className="text-xs font-black text-slate-800 tracking-tight">E-Scooter speed 28 km/h. ETA T-Minus 4m.</div>
                        </div>
                      </div>
                    ) : activeOrderTrack.step === 7 ? (
                      /* STAR Rating & Review Form */
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 space-y-4 text-left">
                        <div className="flex items-center gap-2">
                          <Star className="h-6 w-6 text-amber-500 fill-current" />
                          <h4 className="text-sm font-black uppercase tracking-widest text-[#c82a5c]">Fulfillment feedback log</h4>
                        </div>
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          Your standard delivery transaction is concluded! Rate products and logistical personnel to synchronize ratings onto Admin dashboards.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {activeOrderTrack.items.map((item: any) => {
                            const currentRating = ratings[item.id]?.rating || 5;
                            const currentComment = ratings[item.id]?.comment || "Great products & extremely prompt delivery!";
                            return (
                              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                                <span className="text-[10px] font-extrabold text-[#c82a5c] block">{item.name}</span>
                                
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => {
                                        setRatings(prev => ({
                                          ...prev,
                                          [item.id]: { ...prev[item.id], rating: s }
                                        }));
                                      }}
                                      className="p-1 cursor-pointer"
                                    >
                                      <Star className={`h-4 w-4 ${s <= currentRating ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                                    </button>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  placeholder="Review comment..."
                                  value={currentComment}
                                  onChange={(e) => {
                                    setRatings(prev => ({
                                      ...prev,
                                      [item.id]: { rating: currentRating, comment: e.target.value }
                                    }));
                                  }}
                                  className="w-full text-[10px] font-bold tracking-tight bg-slate-50 border border-slate-200 p-1.5 rounded focus:outline-none"
                                />
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => {
                            alert("Thank you! Feedback registry completed. Synchronized statistics on administrative consoles.");
                            setActiveOrderTrack(null);
                          }}
                          className="rounded-xl bg-[#c82a5c] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#b0224e] cursor-pointer"
                        >
                          Submit Master Reviews
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 flex flex-col justify-center h-48 space-y-2 text-left">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Active Status Intel</span>
                        <h4 className="text-lg font-black text-brand-navy">
                          {activeOrderTrack.step === 0 && "Pending approval by Store Logistics terminal."}
                          {activeOrderTrack.step === 1 && "Downtown Mumbai Hub auto-detected matching coordinates."}
                          {activeOrderTrack.step === 2 && `Picker "${activeOrderTrack.picker.name}" selected. Basket load compilation active.`}
                          {activeOrderTrack.step === 3 && `Packer "${activeOrderTrack.packer.name}" sealed physical cold thermal liner.`}
                          {activeOrderTrack.step === 4 && `Courier "${activeOrderTrack.rider.name}" dispatched. Electronic lock released.`}
                          {activeOrderTrack.step === 6 && "Consignment signature checked at door threshold. Delivery logged."}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold tracking-tight uppercase leading-relaxed">
                          Assigned Hub: {activeOrderTrack.branch.name} <span className="mx-2">|</span> 
                          Logistics: {activeOrderTrack.branch.warehouse} <span className="mx-2">|</span>
                          Channel: SHA256 Secure Link Secure
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Console telemetry logs */}
                  <div className="md:col-span-4 space-y-4 text-left">
                    <div className="bg-slate-950 p-4 rounded-2xl h-60 flex flex-col font-mono text-[9px] text-[#22c55e] border border-slate-800 shadow-inner">
                      <div className="border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
                        <span className="font-extrabold uppercase tracking-widest text-[8px] text-slate-400">Diag System Telemetry Logs</span>
                        <button onClick={() => setOrderLogs([])} className="text-rose-500 hover:text-rose-400 text-[8px] uppercase font-black cursor-pointer">Clear</button>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                        {orderLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                        ))}
                        {orderLogs.length === 0 && (
                          <div className="text-slate-500 italic p-4 text-center">Standby. No log events active.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Hero Section */}
            {!selectedCategory && !searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-12 overflow-hidden rounded-[32px] bg-new-banner-gradient p-8 min-h-[400px] flex flex-col justify-center sm:p-12 border border-[#96dad7]/30 shadow-md animate-gradient"
              >
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-30 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-l from-white/30 to-transparent" />
                  <ShoppingBasket className="absolute -right-8 top-1/2 -translate-y-1/2 h-64 w-64 rotate-12 text-brand-navy/10" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-navy/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-navy border border-brand-navy/15">
                    <Clock className="h-3 w-3 text-brand-navy" />
                    Ultrafast Delivery
                  </div>
                  
                  {/* Dynamic Color Combo Controls */}
                  <div className="mb-3.5 flex items-center gap-2 bg-[#ffffff]/60 backdrop-blur-md px-2.5 py-1.5 rounded-2xl w-fit border border-[#96dad7]/35 shadow-sm">
                    <span className="text-[9px] font-black text-brand-navy/70 uppercase tracking-wider select-none">Variations:</span>
                    {HERO_COLOR_COMBOS.map((combo, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setBannerColorCombo(idx);
                          setBannerAutoPlay(false);
                        }}
                        className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                          bannerColorCombo === idx 
                            ? 'scale-125 border-brand-navy ring-1 ring-brand-navy/50 shadow-md' 
                            : 'border-white bg-[#000000]/10 hover:scale-110 opacity-75 hover:opacity-100'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${combo.groceriesHex} 50%, ${combo.minutesHex} 50%)`
                        }}
                        title={`Combo preset: ${combo.name}`}
                      />
                    ))}
                    <div className="w-[1px] h-3 bg-brand-navy/20 mx-0.5" />
                    <button
                      onClick={() => setBannerAutoPlay(prev => !prev)}
                      className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
                        bannerAutoPlay 
                          ? 'text-teal-700 bg-teal-100/70 hover:bg-teal-100' 
                          : 'text-[#c82a5c] bg-rose-100/70 hover:bg-rose-100'
                      }`}
                      title={bannerAutoPlay ? "Pause Automatic Rotation" : "Play Automatic Rotation"}
                    >
                      {bannerAutoPlay ? "Auto" : "Paused"}
                    </button>
                  </div>

                  <h1 className="mb-4 text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl flex flex-wrap items-center gap-y-2">
                    <span className={`${HERO_COLOR_COMBOS[bannerColorCombo].groceriesColor} transition-colors duration-1000 mr-3 inline-block`}>
                      {language === 'hi' ? 'किराना सामान सिर्फ' : language === 'mr' ? 'किराणा साहित्य फक्त' : 'Groceries in'}
                    </span>
                    <span className={`${HERO_COLOR_COMBOS[bannerColorCombo].minutesColor} transition-colors duration-1000 drop-shadow-sm`}>
                      {language === 'hi' ? '१२ मिनट में' : language === 'mr' ? '१२ मिनिटात' : '12 Minutes'}
                    </span>
                    <span className="text-brand-navy font-black">.</span>
                  </h1>
                  <p className="mb-8 text-sm font-medium text-brand-navy/75 max-w-md leading-relaxed">
                    {language === 'hi' 
                      ? 'ताजी उपज, घरेलू जरूरतें और इलेक्ट्रॉनिक्स आपके कॉफी ठंडी होने से पहले आपके नजदीकी हब से सीधे पहुंचाए जाते हैं।' 
                      : language === 'mr'
                      ? 'ताजी उत्पादने, घरगुती गरजा आणि इलेक्ट्रॉनिक्स तुमच्या कॉफी थंड होण्यापूर्वी तुमच्या स्थानिक केंद्रातून पोहोचवले जातात.'
                      : 'Fresh produce, household essentials, and electronics delivered from your local hubs before your coffee gets cold.'
                    }
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('category-grid');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="rounded-2xl bg-brand-navy px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 active:scale-95 transition-transform hover:bg-[#1b2b3a]"
                    >
                      {getTranslation("Order Now", language)}
                    </button>
                    <button 
                      onClick={() => setIsOffersOpen(true)}
                      className="rounded-2xl border-2 border-brand-navy/35 px-8 py-4 text-xs font-black uppercase tracking-widest text-brand-navy hover:bg-brand-navy/10 transition-colors cursor-pointer"
                    >
                      {getTranslation("View Offers", language)}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sub-Banners */}
            {!selectedCategory && !searchQuery && (
              <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div 
                  onClick={() => {
                    setSelectedCategory('cat-2');
                    document.getElementById('category-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-amber-100 p-8 flex items-center justify-between border border-amber-200"
                >
                  <div className="z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">{getTranslation("Seasonal Collection", language)}</div>
                    <h3 className="text-2xl font-black text-amber-900 mb-4">{getTranslation("Summer Fruits", language)}</h3>
                    <button className="flex items-center gap-2 text-xs font-black uppercase text-amber-900">
                      {getTranslation("Shop Now", language)} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <Apple className="h-20 w-20 text-amber-300 absolute -right-4 -bottom-4 rotate-12 transition-transform group-hover:scale-125" />
                </div>
                <div 
                  onClick={() => {
                    setSelectedCategory('cat-6');
                    document.getElementById('category-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-blue-100 p-8 flex items-center justify-between border border-blue-200"
                >
                  <div className="z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-1">{getTranslation("Tech Express", language)}</div>
                    <h3 className="text-2xl font-black text-blue-900 mb-4">{getTranslation("Mobile Hub", language)}</h3>
                    <button className="flex items-center gap-2 text-xs font-black uppercase text-blue-900">
                      {getTranslation("Explore", language)} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <Smartphone className="h-20 w-20 text-blue-300 absolute -right-4 -bottom-4 rotate-12 transition-transform group-hover:scale-125" />
                </div>
              </div>
            )}

            {/* Categories */}
            <div id="category-grid" className="mb-12 overflow-x-auto pb-4 scrollbar-none">
              <div className="flex gap-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`group relative flex min-w-[100px] flex-col items-center gap-3 transition-all`}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-3xl transition-all shadow-sm ${!selectedCategory ? 'bg-brand-navy text-brand-green shadow-xl shadow-slate-200' : 'bg-white border border-slate-200 group-hover:border-brand-green'}`}>
                    <Package className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${!selectedCategory ? 'text-brand-navy' : 'text-slate-400'}`}>{getTranslation("All SKU", language)}</span>
                </button>
                {categories.map(cat => {
                  const IconComp = ICON_MAP[cat.icon] || ShoppingBasket;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        document.getElementById('category-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group relative flex min-w-[100px] flex-col items-center gap-3 transition-all"
                    >
                      <div className={`flex h-16 w-16 items-center justify-center rounded-3xl transition-all shadow-sm ${selectedCategory === cat.id ? 'bg-brand-navy text-brand-green shadow-xl shadow-slate-200' : 'bg-white border border-slate-200 group-hover:border-brand-green'}`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${selectedCategory === cat.id ? 'text-brand-navy' : 'text-slate-400'}`}>{getTranslatedCategoryName(cat.name, language)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredProducts.map(product => {
                const inWishlist = wishlist.includes(product.id);
                return (
                  <motion.div
                    layout
                    key={product.id}
                    className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-4 transition-all hover:shadow-2xl hover:shadow-slate-200/60 text-left"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 mb-3">
                      <img 
                        src={product.image} 
                        alt={getTranslatedProductName(product.name, language)} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Brand Label Overlay */}
                      <div className="absolute top-2 left-2 rounded-full bg-slate-900/40 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                        {product.unit}
                      </div>

                      {/* Wishlist toggle heart button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full transition-all shadow-sm cursor-pointer backdrop-blur-sm ${inWishlist ? 'bg-rose-500 text-white' : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500'}`}
                        title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#c82a5c]">{product.brand}</span>
                        
                        {/* Subscription Order button */}
                        <button
                          onClick={() => {
                            setIsSubscribingItem(product);
                          }}
                          className="text-[8px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 hover:bg-teal-100 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                          title="Schedule recurring subscription deliveries for this brand"
                        >
                          ↻ Subscribe
                        </button>
                      </div>
                      <h3 className="line-clamp-2 text-xs font-black tracking-tight text-brand-navy mb-3 h-8 leading-normal">{getTranslatedProductName(product.name, language)}</h3>
                      
                      {/* Smart Recommendation Match badge if matches category */}
                      {product.price < 150 && (
                        <div className="mb-2 w-fit rounded bg-amber-50 px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-0.5">
                          <Sparkles className="h-2 w-2" /> Match Recommend
                        </div>
                      )}

                      <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black tracking-tighter text-brand-navy">MRP: ₹{product.price.toFixed(2)}</span>
                          <span className="text-[8px] font-bold text-[#c82a5c] uppercase bg-rose-50 px-1 py-0.5 rounded">In Stock</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          <button 
                            onClick={() => {
                              addToCart(product);
                              // brief alert or flash
                              const toast = document.createElement('div');
                              toast.className = "fixed bottom-5 left-5 z-60 bg-brand-navy text-white text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-brand-green animate-bounce";
                              toast.innerHTML = `<span class="h-2 w-2 rounded-full bg-brand-green animate-ping"></span> Added ${product.name} to order!`;
                              document.body.appendChild(toast);
                              setTimeout(() => toast.remove(), 2500);
                            }}
                            className="rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 py-2 text-[8.5px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-center"
                            title="Add product SKU to delivery list"
                          >
                            {language === 'hi' ? 'जोड़ें +' : language === 'mr' ? 'जोडा +' : 'Add +'}
                          </button>
                          
                          <button 
                            onClick={() => {
                              addToCart(product);
                              setIsCartOpen(true);
                            }}
                            className="rounded-lg bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white py-2 text-[8.5px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-0.5"
                            title="Directly place 12-minute delivery order now"
                          >
                            <span>🚀 BUY NOW</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
              <div className="mt-32 rounded-[40px] bg-new-banner-gradient p-12 text-center relative overflow-hidden border border-[#96dad7]/30 shadow-md">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                   <div className="absolute top-0 left-1/4 w-px h-full bg-brand-navy/10" />
                   <div className="absolute top-0 right-1/4 w-px h-full bg-brand-navy/10" />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                   <div className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-teal-950">Intelligence Network</div>
                   <h2 className="text-4xl font-black tracking-tighter text-brand-navy mb-6">Gain the Tactical Edge</h2>
                   <p className="text-brand-navy/80 mb-8 font-medium">Join 50,000+ users receiving exclusive drop alerts and stock updates directly to their hub.</p>
                   {isSubscribed ? (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="rounded-2xl bg-brand-navy/10 border border-brand-navy/15 p-4 text-brand-navy font-black uppercase tracking-[0.2em] text-xs"
                     >
                       Tactical Sync Completed.
                     </motion.div>
                   ) : (
                     <div className="flex max-w-md mx-auto gap-3">
                        <input 
                          type="email" 
                          placeholder="TERMINAL@EMAIL.COM" 
                          className="flex-1 rounded-2xl bg-white/40 border border-brand-navy/20 px-6 py-4 text-xs font-black uppercase tracking-widest text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:bg-white/65 focus:border-brand-navy/40 transition-all font-mono"
                        />
                        <button 
                          onClick={() => setIsSubscribed(true)}
                          className="rounded-2xl bg-brand-navy px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 active:scale-95 transition-transform"
                        >
                          Sync
                        </button>
                     </div>
                   )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Admin View */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
            <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
               <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c82a5c] mb-1">Hyperlocal Fulfillment OS Platform</div>
                  <h1 className="text-4xl font-black tracking-tighter text-brand-navy">Central Operational Terminal</h1>
               </div>
               
               {/* Quick stats & action status */}
               <div className="flex flex-wrap items-center gap-2">
                 <div className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-[10px] font-black uppercase text-slate-600">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   System Online: PORT 3000
                 </div>
                 <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-1.5 text-[10px] font-black uppercase text-rose-700">
                   <ShieldCheck className="h-3.5 w-3.5" />
                   Security Block: SHA256 Secure
                 </div>
                 <button 
                   onClick={() => setView('shop')}
                   className="rounded-xl bg-[#c82a5c] hover:bg-[#b0224e] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all cursor-pointer"
                 >
                   Back to Customer view
                 </button>
               </div>
            </header>

            {/* A. ACTIVE ROLE SIMULATOR & CREDENTIALS CONTROLLER */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                      JWT Auth Verified
                    </span>
                    <span className="text-slate-450 text-[11px] font-mono">| Claims Token:</span>
                    <span className="font-mono text-[10px] text-green-400 truncate max-w-[280px] block" title={securityJwtToken}>
                      {securityJwtToken}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-emerald-450 animate-pulse" />
                    Active Access Persona: <span className="text-emerald-400">{activeRole}</span>
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    {SIMULATED_ROLES.find(r => r.name === activeRole)?.desc || "Simulates real-world operational user scope."}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">MFA Security:</span>
                  <button 
                    onClick={() => {
                      setSecurityMfaVerified(prev => !prev);
                      setAuditLogsRegistry(prev => [
                        { timestamp: new Date().toTimeString().split(' ')[0], event: 'MFA_TOGGLE', desc: `Multi-Factor Auth state flipped to ${!securityMfaVerified ? 'ENABLED' : 'DISABLED'} manually.`, level: !securityMfaVerified ? 'SECURE' : 'WARN', module: 'AUTH' },
                        ...prev
                      ]);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border cursor-pointer transition-all ${securityMfaVerified ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'}`}
                  >
                    {securityMfaVerified ? "✓ OTP Verified" : "⚡ OTP Verification Pending"}
                  </button>
                </div>
              </div>

              {/* Selector grid of all 10 roles */}
              <div className="border-t border-slate-800/80 pt-4">
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-2.5">Switch Active Access Profile (10 Defined Roles):</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SIMULATED_ROLES.map(role => {
                    const isSel = activeRole === role.name;
                    return (
                      <button
                        key={role.name}
                        onClick={() => {
                          setActiveRole(role.name as any);
                          // Trigger new JWT token generation simulating backend sign
                          const generatedToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ role: role.name, timestamp: Date.now() })).replace(/=/g, '')}.signature_hashed`;
                          setSecurityJwtToken(generatedToken);
                          
                          // Audit Trail log
                          setAuditLogsRegistry(prev => [
                            { timestamp: new Date().toTimeString().split(' ')[0], event: 'ROLE_REVOKE', desc: `Previous token context revoked. Dynamic JWT generated for ${role.name}.`, level: 'INFO', module: 'CRYPT' },
                            { timestamp: new Date().toTimeString().split(' ')[0], event: 'ROLE_ELEVATE', desc: `Active session elevated to ${role.name} simulated role context.`, level: role.name === 'Super Admin' ? 'CRITICAL' : 'INFO', module: 'RBAC' },
                            ...prev
                          ]);

                          // Auto redirect allowed tab if currently on a locked tab
                          if (!isTabAllowed(role.name, adminTab)) {
                            // Find default allowed tab
                            const allowedList = SIMULATED_ROLES.find(r => r.name === role.name)?.scope.split(',').map(s => s.trim()) || ['dashboard'];
                            const fallback = allowedList.find(t => t !== 'rbac_security') || 'dashboard';
                            setAdminTab(fallback);
                          }
                        }}
                        className={`text-left rounded-xl p-2.5 border transition-all cursor-pointer ${isSel ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black truncate">{role.name}</span>
                          {isSel && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        </div>
                        <span className="text-[8px] opacity-60 block mt-0.5 truncate uppercase tracking-widest">Scope: {role.name === 'Super Admin' ? 'Omni (*)' : role.scope.split(',')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* A. ENTERPRISE TABS NAVIGATION BAR */}
            <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200/60 scrollbar-none">
              {[
                { id: 'dashboard', label: 'Dashboard Hub', icon: <LayoutDashboard className="h-4 w-4" /> },
                { id: 'rbac_security', label: 'Security & Access (RBAC)', icon: <Fingerprint className="h-4 w-4 text-emerald-500" /> },
                { id: 'qcomm_advanced', label: 'Advanced Q-Comm Modules', icon: <Zap className="h-4 w-4 text-amber-500" /> },
                { id: 'specialty_channels', label: 'Specialty B2B & POS Channels', icon: <Briefcase className="h-4 w-4 text-[#c82a5c]" /> },
                { id: 'analytics', label: 'BI & Analytics', icon: <BarChart3 className="h-4 w-4 text-rose-500" /> },
                { id: 'smart', label: 'AI & Smart Hub', icon: <Brain className="h-4 w-4 text-purple-500" /> },
                { id: 'mobile_apps', label: 'Mobile Apps Suite', icon: <Smartphone className="h-4 w-4 text-teal-500" /> },
                { id: 'oms', label: 'Order Mgmt (OMS)', icon: <ShoppingCart className="h-4 w-4" /> },
                { id: 'delivery', label: 'Rider & Delivery App', icon: <Truck className="h-4 w-4" /> },
                { id: 'warehouse', label: 'Warehouse (WMS)', icon: <Boxes className="h-4 w-4" /> },
                { id: 'crm', label: 'CRM & Membership', icon: <User className="h-4 w-4" /> },
                { id: 'finance', label: 'Finance & Ledger', icon: <Wallet className="h-4 w-4" /> },
                { id: 'masters', label: 'Master Modules', icon: <Building className="h-4 w-4" /> },
                { id: 'products', label: 'Product Manager', icon: <Barcode className="h-4 w-4" /> },
                { id: 'inventory', label: 'Inventory Control', icon: <Boxes className="h-4 w-4" /> },
                { id: 'purchase', label: 'Purchase System', icon: <ClipboardList className="h-4 w-4" /> },
                { id: 'vendor', label: 'Vendor Center', icon: <UserCheck className="h-4 w-4" /> }
              ].map(tab => {
                const isSel = adminTab === tab.id;
                const isAllowed = isTabAllowed(activeRole, tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isAllowed) {
                        setAdminTab(tab.id as any);
                      } else {
                        // Audit access block trigger
                        setAuditLogsRegistry(prev => [
                          { timestamp: new Date().toTimeString().split(' ')[0], event: 'ACCESS_DENIED', desc: `Blocked attempt by '${activeRole}' to bypass scope parameters for tab '${tab.label}'.`, level: 'ALERT', module: 'GATEKEEPER' },
                          ...prev
                        ]);
                        alert(`🛑 ACCESSIBILITY REJECTED\n\nRole '${activeRole}' does not possess the matching JWT claims or functional permissions to access '${tab.label}'.\n\nPlease switch simulator roles to access this dashboard section.`);
                      }
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      isSel 
                        ? 'bg-brand-navy text-brand-green shadow-md border-b-2 border-brand-green' 
                        : isAllowed 
                          ? 'bg-white border border-slate-200 text-slate-500 hover:text-brand-navy hover:bg-slate-50'
                          : 'bg-slate-100 border border-slate-200 text-slate-350 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {!isAllowed && <span className="text-[9px]" title="Scope Locked">🔒</span>}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: DASHBOARD HUB */}
            {adminTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Dashboard KPI cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard title="Total Cumulative Sales" value={`₹${(stats?.totalSales || 188350).toFixed(2)}`} icon={<TrendingUp className="text-emerald-500" />} change="↑ 18.2% vs yesterday" />
                  <StatCard title="Active Order Registry" value={(activeOrderTrack ? "1 Live Tracker" : "0 Standby")} icon={<ShoppingCart className="text-blue-500" />} change="Direct stream" />
                  <StatCard title="Rider Fleet Pool" value="12 Active Scouts" icon={<Truck className="text-amber-500" />} change="BKC Zone A Corridor" />
                  <StatCard title="Ratings Yield" value="4.85 ★ Avg rating" icon={<Star className="text-rose-500 fill-current" />} change="Based on 48 reviews" />
                </div>

                {/* Performance split and analytics chart blocks */}
                <div className="grid gap-8 lg:grid-cols-12">
                  {/* Branch Performance progress meters */}
                  <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#c82a5c]">Hyperlocal Branch Sales Metrics</h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Computed matching dynamic sales registers</span>
                      </div>
                      <button 
                        onClick={() => alert("Central Audit: All 3 hubs matching coordinate logs successfully.")}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-navy hover:underline"
                      >
                        Full Audit Trail
                      </button>
                    </div>
                    <div className="space-y-8">
                      {branchMaster.map(branch => {
                        // Simulated sales metrics matching backend
                        const simulatedSales = branch.id === 'br-1' ? 95000 : branch.id === 'br-2' ? 76000 : 42000;
                        const targets = 120000;
                        const pct = Math.min(100, Math.floor((simulatedSales / targets) * 100));
                        return (
                          <div key={branch.id} className="flex flex-col gap-3">
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-[11px] font-extrabold text-[#c82a5c] uppercase tracking-wider">{branch.name} ({branch.code})</div>
                                <div className="text-2xl font-black tracking-tighter text-brand-navy">₹{simulatedSales.toLocaleString()} <span className="text-xs font-bold text-slate-400">/ Target ₹120k</span></div>
                              </div>
                              <span className="text-xs font-black text-[#c82a5c] font-mono">{pct}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                              <div 
                                className="h-full bg-gradient-to-r from-brand-navy to-[#c82a5c] transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                              <span>Manager: {branch.manager}</span>
                              <span>Fulfillment limit: {branch.radius}km radius</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational sync diagnostics */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="rounded-3xl bg-brand-green p-8 text-slate-900 shadow-xl shadow-green-100">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Inventory Sync status</div>
                      <div className="space-y-6 text-left">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                               <span>Groceries & Whole staples</span>
                               <span>99.8% Perfect</span>
                            </div>
                            <div className="h-2 w-full bg-[#1e293b]/10 rounded-full overflow-hidden">
                              <div className="w-[100%] h-full bg-[#1e293b]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                               <span>Fresh Dairy & Farm Direct fruits</span>
                               <span>94.5% Balanced</span>
                            </div>
                            <div className="h-2 w-full bg-[#1e293b]/10 rounded-full overflow-hidden">
                              <div className="w-[94%] h-full bg-[#1e293b]" />
                            </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          alert("Synchronizing live branch SKU buffers with BKC Central warehouse assets...");
                          alert("Database Catalog updated! Preloaded fresh 5 elements successfully.");
                        }} 
                        className="mt-8 w-full rounded-2xl bg-[#1e293b] py-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-green transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/20 cursor-pointer"
                      >
                        Force Manual Ledger Sync
                      </button>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Logistics quick configuration</span>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setAdminTab('products');
                            alert("Routing to dynamic Product Master upload engine. Onboard SKU.");
                          }}
                          className="w-full flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 hover:bg-slate-100 text-left transition-all cursor-pointer"
                        >
                          <span className="text-[10px] font-black uppercase text-slate-700">Onboard New SKU product</span>
                          <Plus className="h-4 w-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => {
                            setAdminTab('masters');
                            setMasterSubtab('branches');
                            alert("Routing to Branch Master registry. Configure manager details.");
                          }}
                          className="w-full flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3 hover:bg-slate-100 text-left transition-all cursor-pointer"
                        >
                          <span className="text-[10px] font-black uppercase text-slate-700">Add/Edit fulfillment Branch</span>
                          <MapPin className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* TAB CONTENT: ORDER MANAGEMENT SYSTEM (OMS) */}
            {adminTab === 'oms' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Enterprise Order Management (OMS)</h3>
                      <p className="text-xs text-[#c82a5c] font-black uppercase tracking-widest mt-1">Granular Hyperlocal Order Status Pipeline (9 Levels)</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const newId = `ord-${Math.floor(Math.random() * 90000 + 10000)}`;
                          const randomProduct = products[Math.floor(Math.random() * products.length)];
                          const fresh: any = {
                            id: newId,
                            customer: "Karan Johar",
                            phone: "+91 98200 44551",
                            branch: selectedBranch?.name || "Downtown Mumbai Hub",
                            items: [{ ...randomProduct, quantity: 1 }],
                            total: randomProduct.price,
                            paymentMethod: "cod",
                            status: "New Order",
                            date: new Date().toISOString().split('T')[0],
                            step: 0,
                            gpsCoords: { lat: 19.076, lng: 72.877 }
                          };
                          setOrdersList([fresh, ...ordersList]);
                          setOrderLogs(prev => [
                            `[${new Date().toLocaleTimeString()}] OMS CONSOLE: Manually registered fresh hyperlocal order ${newId} with COD request.`,
                            ...prev
                          ]);
                          alert(`Manually generated test order ${newId} for pipeline testing!`);
                        }}
                        className="bg-brand-navy hover:bg-[#c82a5c] text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        + Create Test Order
                      </button>
                      <span className="bg-rose-50 border border-rose-100 text-[#c82a5c] font-mono text-[9px] font-black uppercase px-3 py-2 rounded-xl">
                        Active Pool: {ordersList.length} Consignments
                      </span>
                    </div>
                  </div>

                  {/* Orders Master list */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                    {/* Orders listing column */}
                    <div className="lg:col-span-4 space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Select Live Pipeline Consigned</span>
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-none">
                        {ordersList.map(order => {
                          const isFocused = activeOrderTrack && activeOrderTrack.id === order.id;
                          return (
                            <div 
                              key={order.id}
                              className={`border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md text-left ${
                                isFocused ? 'border-[#c82a5c] bg-rose-50/10 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                              onClick={() => {
                                setActiveOrderTrack({
                                  id: order.id,
                                  items: order.items,
                                  total: order.total,
                                  paymentMethod: order.paymentMethod,
                                  status: order.status,
                                  step: order.step,
                                  branch: { name: order.branch, Lat: order.gpsCoords?.lat, Lng: order.gpsCoords?.lng },
                                  customer: order.customer,
                                  phone: order.phone,
                                  date: order.date
                                });
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-black text-[#c82a5c] font-mono">{order.id}</span>
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-bold">{order.date}</span>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-sm text-brand-navy">{order.customer}</h4>
                                <p className="text-xs text-slate-500 font-semibold">{order.branch}</p>
                              </div>
                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                                <span className="text-xs font-black font-mono text-slate-800">₹{order.total}</span>
                                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
                                  omsSteps[order.step]?.color || 'bg-slate-50 text-slate-600'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order visual pipeline inspector */}
                    <div className="lg:col-span-8 bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
                      {activeOrderTrack ? (
                        <div className="space-y-6 text-left">
                          <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-200 pb-4">
                            <div>
                              <div className="text-[9px] font-black uppercase tracking-widest text-[#c82a5c]">Consignment Inspector</div>
                              <h4 className="text-lg font-black text-brand-navy">Order ID: {activeOrderTrack.id}</h4>
                              <p className="text-xs text-slate-500 mt-1 font-semibold">
                                Customer: <span className="font-extrabold text-slate-700">{activeOrderTrack.customer || "Direct Consumer"}</span> | Phone: {activeOrderTrack.phone || "+91 98200 12345"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  const currentOrderIdx = ordersList.findIndex(o => o.id === activeOrderTrack.id);
                                  if (currentOrderIdx !== -1) {
                                    const nextStep = Math.min(8, ordersList[currentOrderIdx].step + 1);
                                    const nextStatus = omsSteps[nextStep].label;
                                    const updated = [...ordersList];
                                    updated[currentOrderIdx] = {
                                      ...updated[currentOrderIdx],
                                      step: nextStep,
                                      status: nextStatus
                                    };
                                    setOrdersList(updated);
                                    
                                    setActiveOrderTrack(prev => ({
                                      ...prev,
                                      step: nextStep,
                                      status: nextStatus
                                    }));

                                    setOrderLogs(prev => [
                                      `[${new Date().toLocaleTimeString()}] OMS TRIGGER: Order ${activeOrderTrack.id} transitioned to stage: ${nextStatus}.`,
                                      ...prev
                                    ]);

                                    // Add to finance ledger if transitioning into 'Payment Verified'
                                    if (nextStep === 1) {
                                      setFinanceLedger(prev => [
                                        { id: `ledger-${Math.random().toString(36).substr(2, 6)}`, date: new Date().toISOString().split('T')[0], refId: activeOrderTrack.id, desc: `Sales Receipt Verified (Cust: ${activeOrderTrack.customer})`, debit: activeOrderTrack.total, credit: 0, balance: 1610 },
                                        ...prev
                                      ]);
                                    }

                                    // Sync with Rider App payouts if transitioning to Delivered
                                    if (nextStep === 8) {
                                      setRiderAuth(prev => ({
                                        ...prev,
                                        cashCollected: prev.cashCollected + (ordersList[currentOrderIdx].paymentMethod === 'cod' ? ordersList[currentOrderIdx].total : 0),
                                        kmsDriven: prev.kmsDriven + 6
                                      }));
                                    }
                                  }
                                }}
                                disabled={activeOrderTrack.step >= 8}
                                className="bg-[#c82a5c] hover:bg-[#b0224e] disabled:bg-slate-300 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all h-fit self-center cursor-pointer disabled:cursor-not-allowed"
                              >
                                {activeOrderTrack.step >= 8 ? "✓ Fully Delivered" : "Advance Pipeline Phase"}
                              </button>
                            </div>
                          </div>

                          {/* 9 Status Stages Horizontal timeline */}
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-4 font-bold">9-Stage Hyperlocal Pipeline Status</span>
                            <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                              {omsSteps.map(stepItem => {
                                const currentStep = ordersList.find(o => o.id === activeOrderTrack.id)?.step ?? activeOrderTrack.step;
                                const isCurrent = currentStep === stepItem.s;
                                const isPassed = currentStep > stepItem.s;
                                return (
                                  <div 
                                    key={stepItem.s}
                                    className={`p-2.5 rounded-xl border flex flex-col justify-between h-20 text-left transition-all ${
                                      isCurrent ? 'bg-[#c82a5c] text-white border-transparent shadow' : 
                                      isPassed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-slate-400 border-slate-100'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="font-mono text-[9px] font-black">{stepItem.s + 1}/9</span>
                                      {isPassed ? (
                                        <Check className="h-3 w-3 text-emerald-600 font-extrabold" />
                                      ) : isCurrent ? (
                                        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                      ) : null}
                                    </div>
                                    <span className={`text-[8px] leading-tight font-black uppercase tracking-tighter ${isCurrent ? 'text-white font-black' : 'text-inherit font-extrabold'}`}>
                                      {stepItem.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Line item descriptions */}
                          <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 font-bold">Consignment Manifest</span>
                            <div className="divide-y divide-slate-100 text-xs">
                              {activeOrderTrack.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center py-2.5">
                                  <div>
                                    <span className="font-extrabold text-slate-800">{item.name}</span>
                                    <span className="text-slate-400 font-mono ml-2">x{item.quantity} {item.unit || "unit"}</span>
                                  </div>
                                  <span className="font-mono font-black text-slate-700">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-200 font-mono font-black text-sm text-brand-navy">
                              <span>Grand Settled Aggregate</span>
                              <span>₹{activeOrderTrack.total}</span>
                            </div>
                          </div>

                          {/* Simulation Telemetry logs */}
                          <div className="bg-slate-900 rounded-xl p-5 text-slate-300 relative overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-3">
                              <span className="font-mono text-[8px] text-emerald-400 font-black tracking-widest uppercase">Live Pipeline Telemetry Logs</span>
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <div className="font-mono text-[9px] space-y-1 max-h-40 overflow-y-auto scrollbar-none text-left">
                              {orderLogs.map((log, lIdx) => (
                                <p key={lIdx} className="leading-relaxed"><span className="text-slate-500 font-bold">&gt;</span> {log}</p>
                              ))}
                              <p className="text-slate-500 font-mono"><span className="text-emerald-500 font-bold">&gt;</span> STANDBY: Listening for next status change signal on socket 3000...</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-400 space-y-4">
                          <ShoppingCart className="h-12 w-12 text-slate-300" />
                          <p className="text-xs uppercase tracking-widest font-black">Select an order from the master list to launch pipeline inspection.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DELIVERY BOY APPLICATION SIMULATOR */}
            {adminTab === 'delivery' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Rider Summary stats at top */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Accumulated COD Pool</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">₹{riderAuth.cashCollected}</h4>
                    <span className="text-[9px] block text-rose-600 font-bold uppercase mt-1">Pending Cash settlement</span>
                  </div>
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Total Mileage Logs</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">{riderAuth.kmsDriven} KMs</h4>
                    <span className="text-[9px] block text-teal-600 font-bold uppercase mt-1">Calculated @ ₹4.50/KM petrol</span>
                  </div>
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Fuel Allowance Accrued</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">₹{(riderAuth.kmsDriven * riderAuth.fuelAllowanceRate).toFixed(2)}</h4>
                    <span className="text-[9px] block text-slate-400 font-semibold uppercase mt-1">Automatic disbursement</span>
                  </div>
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Rider Account Security</span>
                    <h4 className="text-sm font-black text-brand-navy mt-2 block font-extrabold uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded w-fit">
                      KYC BIOMETRIC FIXED
                    </h4>
                    <span className="text-[8px] block text-slate-400 font-bold uppercase mt-1">Aadhar-linked database</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  {/* Left Column: Rider Ops commands */}
                  <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-brand-navy uppercase tracking-tight">Rider Dispatch Operations</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase mt-1">Configure active courier profiles and track shifts.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                        <span className="text-[9px] font-black uppercase text-slate-400 font-bold">Active Attendance Status</span>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-black text-slate-700 uppercase tracking-wide">
                            {riderAuth.isClockedIn ? "🟢 Checked In (On Shift)" : "🔴 Checked Out (Off Duty)"}
                          </span>
                          <button 
                            onClick={() => setRiderAuth(prev => ({ ...prev, isClockedIn: !prev.isClockedIn }))}
                            className={`text-[8px] font-black uppercase px-3 py-2 rounded-lg cursor-pointer ${
                              riderAuth.isClockedIn ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {riderAuth.isClockedIn ? "Clock Out" : "Clock In"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase text-slate-400 block font-bold">Shift Attendance Logs</span>
                        <div className="border border-slate-200 divide-y divide-slate-100 rounded-xl bg-white text-[10px] overflow-hidden">
                          {riderAuth.attendanceLogs.map((log, lIdx) => (
                            <div key={lIdx} className="p-3 flex justify-between font-medium">
                              <span className="font-bold text-slate-700">{log.date}</span>
                              <span className="text-slate-500 font-mono">In: {log.clockIn} | Out: {log.clockOut}</span>
                              <span className="font-extrabold text-[#c82a5c]">{log.shift}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-3">
                        <span className="text-[9px] font-black uppercase text-slate-400 block font-bold">COD Settlement Desk</span>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Riders return physically collected banknotes to the central vault. Settle COD pool to clear rider responsibilities.</p>
                        <button 
                          onClick={() => {
                            if (riderAuth.cashCollected === 0) {
                              alert("No outstanding cash on hand for the rider!");
                              return;
                            }
                            alert(`Treasury cash audit succeeded! settled ₹${riderAuth.cashCollected} successfully. Rider balance reset to ₹0.`);
                            setRiderAuth(prev => ({ ...prev, cashCollected: 0 }));
                          }}
                          className="w-full bg-brand-navy hover:bg-[#c82a5c] text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          Settle Outstanding COD with Treasury
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mobile Rider App Simulator */}
                  <div className="lg:col-span-8 flex justify-center">
                    <div className="w-full max-w-sm rounded-[3rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden relative" style={{ height: "650px" }}>
                      {/* Phone Speaker & Camera notches */}
                      <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 flex justify-center items-center z-10">
                        <div className="w-16 h-1 w-full bg-slate-900 rounded-full" />
                      </div>

                      {/* Phone internal viewport */}
                      <div className="h-full bg-slate-100 pt-6 flex flex-col justify-between text-left overflow-y-auto scrollbar-none">
                        {!riderAuth.isLoggedIn ? (
                          /* RIDER LOGIN SCREEN */
                          <div className="flex flex-col justify-between items-center p-6 h-full text-center space-y-8 my-auto">
                            <div className="my-auto space-y-6 w-full">
                              <div className="flex justify-center">
                                <span className="p-4 bg-brand-navy rounded-full text-brand-green">
                                  <Truck className="h-10 w-10 text-emerald-400" />
                                </span>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-xl font-black text-brand-navy tracking-tight uppercase">RIDER PORTAL LOGIN</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Martly Local Courier Hub v3.1</p>
                              </div>

                              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 text-left mb-4 space-y-1">
                                <span className="text-[8px] font-black uppercase text-amber-700 block tracking-widest">🔑 Demo Authorization Protocol</span>
                                <div className="text-[10px] text-amber-950 font-bold leading-normal">
                                  Use Rider ID: <strong className="font-mono text-amber-900 bg-white px-1 py-0.5 rounded border border-amber-250">RIDER-881</strong><br />
                                  Password: <strong className="font-mono text-amber-900 bg-white px-1 py-0.5 rounded border border-amber-250">12345</strong>
                                </div>
                                <button
                                  onClick={() => {
                                    setTempRiderName('RIDER-881');
                                    setTempRiderPass('12345');
                                    setRiderAuth(prev => ({ ...prev, isLoggedIn: true, username: 'RIDER-881' }));
                                    alert("Quick authenticated rider session!");
                                  }}
                                  className="w-full mt-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-black text-[8px] py-1 uppercase tracking-widest cursor-pointer"
                                >
                                  ⚡ Instant Autofill & Login
                                </button>
                              </div>

                              <div className="space-y-3 text-left">
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Enter Rider ID</span>
                                  <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                                    type="text"
                                    value={tempRiderName}
                                    onChange={(e) => setTempRiderName(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Hub Password Code</span>
                                  <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                                    type="password"
                                    value={tempRiderPass}
                                    onChange={(e) => setTempRiderPass(e.target.value)}
                                  />
                                </div>
                                <button 
                                  onClick={() => {
                                    if (!tempRiderName) {
                                      alert("Please enter rider code!");
                                      return;
                                    }
                                    setRiderAuth(prev => ({ ...prev, isLoggedIn: true, username: tempRiderName }));
                                  }}
                                  className="w-full bg-[#c82a5c] hover:bg-[#b0224e] text-white text-[10px] font-black uppercase py-3 rounded-xl cursor-pointer"
                                >
                                  Authenticate Identity login
                                </button>
                              </div>
                            </div>
                            <span className="text-[8px] text-slate-400 font-black uppercase">Secured by Mart.OS Mobile Protocols</span>
                          </div>
                        ) : (
                          /* RIDER HOME SCREEN MODULES */
                          <div className="flex flex-col justify-between h-full bg-slate-50">
                            {/* App Header */}
                            <div className="bg-brand-navy text-white p-4 flex justify-between items-center shadow-sm">
                              <div>
                                <span className="text-[8px] font-black tracking-widest text-[#c82a5c] uppercase">ACTIVE COURIER</span>
                                <h5 className="text-xs font-black text-brand-green">{riderAuth.name}</h5>
                              </div>
                              <button 
                                onClick={() => setRiderAuth(prev => ({ ...prev, isLoggedIn: false }))}
                                className="text-[8px] font-black bg-rose-900/30 text-rose-300 border border-rose-900/40 px-2 py-1 rounded cursor-pointer uppercase"
                              >
                                Log out
                              </button>
                            </div>

                            {/* Main scroll content */}
                            <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-none pb-20">
                              {/* KYC Badge indicator */}
                              <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
                                <div className="space-y-1">
                                  <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit block font-bold">KYC Verified ✓</span>
                                  <h6 className="font-extrabold text-xs text-brand-navy leading-tight">Biometric and Document Clearance matches</h6>
                                </div>
                                <Award className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                              </div>

                              {/* GPS Path Dispatch Planner and Optimizer */}
                              <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                  <span className="text-[9px] font-black uppercase text-slate-400 font-bold">Virtual GPS Navigation Map</span>
                                  <button 
                                    onClick={() => {
                                      alert("AI Route Optimization: re-calculated coordinates based on branch proximity algorithms. Sequence optimized!");
                                    }}
                                    className="bg-brand-green text-brand-navy text-[7px] font-black uppercase px-2 py-1 rounded"
                                  >
                                    Route Optimize
                                  </button>
                                </div>

                                <div className="h-28 bg-[#f1f5f9] border border-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                                  {/* Map graphic lines resembling roads */}
                                  <div className="absolute inset-x-2 top-8 h-0.5 bg-slate-300" />
                                  <div className="absolute inset-x-2 top-18 h-0.5 bg-slate-300" />
                                  <div className="absolute left-10 inset-y-2 w-0.5 bg-slate-300" />
                                  <div className="absolute left-24 inset-y-2 w-0.5 bg-slate-300" />
                                  
                                  {/* Hub node */}
                                  <div className="absolute top-5 left-8 flex flex-col items-center">
                                    <span className="h-3 w-3 rounded-full bg-brand-navy border border-white" />
                                    <span className="text-[6px] font-black mt-0.5 bg-white shadow-sm px-1 rounded uppercase">BKC Hub</span>
                                  </div>

                                  {/* Delivery Target nodes */}
                                  <div className="absolute top-16 left-20 flex flex-col items-center">
                                    <span className="h-3 w-3 rounded-full bg-[#c82a5c] border border-slate-100 animate-bounce" />
                                    <span className="text-[6px] font-black mt-0.5 bg-white shadow-sm px-1 rounded uppercase">Rajesh K.</span>
                                  </div>

                                  <div className="absolute top-10 left-32 flex flex-col items-center">
                                    <span className="h-3 w-3 rounded-full bg-emerald-500 border border-slate-100" />
                                    <span className="text-[6px] font-black mt-0.5 bg-white shadow-sm px-1 rounded uppercase">Delivered</span>
                                  </div>

                                  <span className="text-[8px] text-slate-400 font-mono font-bold uppercase relative z-10 bg-white/70 px-2 py-0.5 rounded shadow">Simulated Map Corridor</span>
                                </div>

                                <p className="text-[9px] text-slate-500 font-semibold leading-normal">Optimized sequence: <span className="font-bold text-slate-700">BKC central hub → Bandra East bypass → Rajesh Kumar housing cluster (Saves 1.1 Liters petrol)</span></p>
                              </div>

                              {/* Order Work Queue list */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-slate-400 block font-bold">Assigned Dispatch Queue</span>
                                {ordersList.filter(o => o.status === "Rider Assigned" || o.status === "Out For Delivery" || o.status === "Payment Verified").map(order => (
                                  <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm text-left">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black font-mono text-[#c82a5c]">{order.id}</span>
                                      <span className="text-[8px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded capitalize">{order.status}</span>
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-800 space-y-1">
                                      <p className="font-extrabold">{order.customer}</p>
                                      <p className="text-slate-400">{order.phone}</p>
                                      <p className="text-slate-500">Total payable COD/UPI: ₹{order.total}</p>
                                    </div>

                                    {/* Action items inside queue */}
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                      <button 
                                        onClick={() => {
                                          const idx = ordersList.findIndex(o => o.id === order.id);
                                          if (idx !== -1) {
                                            const updated = [...ordersList];
                                            updated[idx] = { ...updated[idx], status: "Out For Delivery", step: 7 };
                                            setOrdersList(updated);
                                            alert(`Status updated to Out For Delivery!`);
                                            setOrderLogs(prev => [`[${new Date().toLocaleTimeString()}] COURIER TRIGGER: Order ${order.id} flagged OUT FOR DELIVERY by Amit Patel.`, ...prev]);
                                          }
                                        }}
                                        disabled={order.status === "Out For Delivery"}
                                        className="bg-brand-navy hover:bg-[#c82a5c] disabled:bg-slate-350 text-white text-[8px] font-black uppercase py-2 rounded-lg cursor-pointer text-center"
                                      >
                                        Dispatched Node
                                      </button>

                                      <button 
                                        onClick={() => {
                                          // Prompt OTP
                                          const code = prompt("Enter customer OTP Delivery confirmation:");
                                          if (code === "8812" || code === "1234") {
                                            const idx = ordersList.findIndex(o => o.id === order.id);
                                            if (idx !== -1) {
                                              const updated = [...ordersList];
                                              updated[idx] = { ...updated[idx], status: "Delivered", step: 8 };
                                              setOrdersList(updated);
                                              setRiderAuth(prev => ({
                                                ...prev,
                                                cashCollected: prev.cashCollected + (order.paymentMethod === 'cod' ? order.total : 0),
                                                kmsDriven: prev.kmsDriven + 6
                                              }));
                                              setOrderLogs(prev => [`[${new Date().toLocaleTimeString()}] OTP VERIFIED: Order ${order.id} Delivered. COD Cash Settled.`, ...prev]);
                                              alert(`OTPs verified cleanly! order ${order.id} delivered.`);
                                            }
                                          } else {
                                            alert("Invalid client verification passcode. Enter standard passcode: 8812");
                                          }
                                        }}
                                        className="bg-brand-green text-brand-navy hover:bg-[#c82a5c] hover:text-white text-[8px] font-black uppercase py-2 rounded-lg cursor-pointer text-center"
                                      >
                                        OTP Settle (8812)
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {ordersList.filter(o => o.status === "Rider Assigned" || o.status === "Out For Delivery" || o.status === "Payment Verified").length === 0 && (
                                  <div className="text-center py-6 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400">
                                    No pending assignments. Return to OMS tab and transition an order to Ready or Paid to assign cooridnate scout Amit.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: WAREHOUSE MANAGEMENT SYSTEM (WMS) */}
            {adminTab === 'warehouse' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  {/* WMS Navigation menu header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Industrial Warehouse & Inventory Control (WMS)</h3>
                      <p className="text-xs text-rose-500 font-black uppercase tracking-widest mt-1">Multi-warehouse Bins, Shelf Optimization & Physical Audits</p>
                    </div>
                    <div className="flex gap-1 border-b border-slate-100 pb-1 scrollbar-none overflow-x-auto">
                      {[
                        { id: 'bin', label: 'Bins & Shelves Mapping', icon: <Boxes className="h-3 w-3" /> },
                        { id: 'barcode', label: 'Scan Barcodes Search', icon: <Barcode className="h-3 w-3" /> },
                        { id: 'picklist', label: 'Generate Picklists', icon: <ClipboardList className="h-3 w-3" /> },
                        { id: 'audit', label: 'Verify Audit reconcile', icon: <CheckCircle2 className="h-3 w-3" /> }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setWmsSubtab(sub.id as any)}
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${wmsSubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUBTAB 1: Bins and shelving control */}
                  {wmsSubtab === 'bin' && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">BKC Warehouse Bin shelving registry</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {binShelves.map((sh, sIdx) => (
                          <div key={sIdx} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/20 text-left space-y-3 relative overflow-hidden">
                            <span className="text-[8px] font-black bg-slate-800 text-white px-2.5 py-1 rounded absolute top-5 right-5 font-mono">{sh.zone} / {sh.shelf}</span>
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#c82a5c] font-black font-mono block">{sh.bin}</span>
                              <h5 className="text-sm font-black text-brand-navy leading-tight">{sh.desc}</h5>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-600 space-y-1">
                              <p>Item SKU code: <span className="font-mono text-slate-800 font-extrabold">{sh.SKU}</span></p>
                              <p>Current Capacity: <span className="font-mono text-slate-800 font-extrabold">{sh.qty} / {sh.maxCapacity} bags</span></p>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3">
                              <div style={{ width: `${(sh.qty / sh.maxCapacity) * 100}%` }} className="bg-brand-navy h-full transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: Barcode search tool */}
                  {wmsSubtab === 'barcode' && (
                    <div className="space-y-6 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">Virtual Barcode Scanned Terminal</span>
                      <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                        <input 
                          className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                          type="text"
                          placeholder="Type product ID (e.g. p1, p3, p5) to parse optical codes..."
                          value={barcodeQuery}
                          onChange={(e) => setBarcodeQuery(e.target.value)}
                        />
                        <button 
                          onClick={() => {
                            const found = products.find(p => p.id === barcodeQuery || p.id === `p${barcodeQuery}`);
                            if (found) {
                              const mapping = binShelves.find(sh => sh.SKU === `SKU-BR-101` || sh.SKU.includes(found.id.toUpperCase())) || { zone: "B2", shelf: "Row 12 - Tier 1", bin: "Bin #124-C" };
                              setBarcodeScanResult({
                                product: found,
                                mapping
                              });
                            } else {
                              alert("SKU code not found inside core database. Available SKUs: p1, p2, p3, p4, p5.");
                            }
                          }}
                          className="bg-brand-navy hover:bg-[#c82a5c] text-white text-[10px] font-black uppercase px-6 py-3 rounded-xl cursor-pointer"
                        >
                          Simulate Optical Scan
                        </button>
                      </div>

                      {barcodeScanResult && (
                        <div className="border border-slate-200 rounded-3xl p-6 bg-white max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-200 text-left">
                          <img src={barcodeScanResult.product.image} className="w-full h-40 object-cover rounded-2xl" alt="" referrerPolicy="no-referrer" />
                          <div className="space-y-3">
                            <div>
                              <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">Scanned Successfully</span>
                              <h4 className="font-extrabold text-base text-brand-navy mt-1">{barcodeScanResult.product.name}</h4>
                            </div>
                            <div className="text-[10px] space-y-1 font-semibold text-slate-600">
                              <p>Brand Index: <span className="text-slate-900 font-extrabold">{barcodeScanResult.product.brand}</span></p>
                              <p>Warehouse Bin Zone: <span className="font-mono text-[#c82a5c] font-black">{barcodeScanResult.mapping.zone} / {barcodeScanResult.mapping.shelf} / {barcodeScanResult.mapping.bin}</span></p>
                              <p>Current Theoretical Stock: <span className="font-mono text-slate-800 font-extrabold">{barcodeScanResult.product.stock} units</span></p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBTAB 3: Picklists generation */}
                  {wmsSubtab === 'picklist' && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">Consolidated Dispatch Picklists Generator</span>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">System compiles all items from pending checkout queues, arranging them logically according to physical shelf proximity coordinates to ease workforce workloads.</p>
                      
                      <div className="border border-slate-200 rounded-3xl overflow-hidden text-xs">
                        <table className="w-full text-left bg-white">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              <th className="p-3">Workforce Routing Rank</th>
                              <th className="p-3">Item Description</th>
                              <th className="p-3 font-mono">Bin Coordinate mapping</th>
                              <th className="p-3 text-right">Sum requested Qty</th>
                              <th className="p-3 text-center">Packaging Slip print</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {[
                              { rank: "1 (Zone A1 Entrance)", desc: "Premium Basmati Rice", bin: "Bin #882-B (Row 5)", qty: 25 },
                              { rank: "2 (Zone B2 Central Rows)", desc: "Artisanal Sourdough Bread", bin: "Bin #124-C (Row 12)", qty: 6 },
                              { rank: "3 (Zone C1 Refrigerated)", desc: "Full Cream Milk (Refrigerated Cap)", bin: "Bin #411-A (Row 3)", qty: 14 }
                            ].map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/50">
                                <td className="p-3 text-[#c82a5c] font-extrabold">{row.rank}</td>
                                <td className="p-3 font-extrabold">{row.desc}</td>
                                <td className="p-3 font-mono text-slate-500">{row.bin}</td>
                                <td className="p-3 text-right font-mono text-slate-900 font-black">{row.qty} bags</td>
                                <td className="p-3 text-center">
                                  <button 
                                    onClick={() => alert(`Packing label print request queued for "${row.desc}". Code compiled on terminal!`)}
                                    className="bg-slate-150 hover:bg-slate-200 text-slate-700 font-mono text-[8px] font-black uppercase px-2 py-1 rounded"
                                  >
                                    SLIP PRINT (✓ Bubble Pack)
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 4: Physical count audits */}
                  {wmsSubtab === 'audit' && (
                    <div className="space-y-6 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold font-black">Automated reconciliation Inventory audits</span>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">Track standard variances between computer stocks and physical handcounts. Reconcile logs dynamically to ledger outstanding records.</p>
                      
                      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              <th className="p-3 font-mono">Product Bin ID</th>
                              <th className="p-3 text-left">Theoretical System buffer</th>
                              <th className="p-3 text-left">Physical hand count</th>
                              <th className="p-3 text-right">Absolute Variance</th>
                              <th className="p-3 text-center">Reconciliation control</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {binShelves.map((shelf, sIdx) => {
                              const theoretical = shelf.qty;
                              return (
                                <tr key={sIdx} className="hover:bg-slate-50">
                                  <td className="p-3 font-mono font-black text-[#c82a5c]">{shelf.bin || "Bin-X"}</td>
                                  <td className="p-3 font-mono">{theoretical} Units</td>
                                  <td className="p-3 font-mono">
                                    <input 
                                      className="w-16 bg-slate-50 p-1 border border-slate-200 rounded text-center font-bold"
                                      type="number"
                                      defaultValue={theoretical}
                                      id={`physical-count-${sIdx}`}
                                    />
                                  </td>
                                  <td className="p-3 text-right font-mono text-[#c82a5c]">-</td>
                                  <td className="p-3 text-center">
                                    <button 
                                      onClick={() => {
                                        const inputVal = (document.getElementById(`physical-count-${sIdx}`) as HTMLInputElement)?.value;
                                        const parsed = parseInt(inputVal);
                                        if (isNaN(parsed)) return;
                                        
                                        // Update bin levels state
                                        const updatedBins = [...binShelves];
                                        updatedBins[sIdx].qty = parsed;
                                        setBinShelves(updatedBins);

                                        alert(`Physical discrepancy accounted! Reconciled Bin to ${parsed} units. Variance logged inside audit logs.`);
                                      }}
                                      className="bg-brand-navy hover:bg-[#c82a5c] text-white text-[8px] font-black uppercase px-2.5 py-1 rounded"
                                    >
                                      ✓ Reconcile Audit logs
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CRM MODULE & LOYALTY */}
            {adminTab === 'crm' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  {/* CRM Subtabs */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Active Customer Relationship (CRM) & Loyalty</h3>
                      <p className="text-xs text-[#c82a5c] font-black uppercase tracking-widest mt-1">Target Segments, Coupon Engines & Loyalty Tiers</p>
                    </div>
                    <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-slate-100 pb-1">
                      {[
                        { id: 'segments', label: 'Customer Segmentation', icon: <User className="h-3.5 w-3.5" /> },
                        { id: 'coupons', label: 'Promo Coupon Engine', icon: <Tag className="h-3.5 w-3.5" /> },
                        { id: 'campaigns', label: 'SMS & WhatsApp marketing', icon: <MessageSquare className="h-3.5 w-3.5" /> },
                        { id: 'membership', label: 'Membership tier upgrades', icon: <Award className="h-3.5 w-3.5" /> }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setCrmSubtab(sub.id as any)}
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${crmSubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CRM Subtab 1: Segments */}
                  {crmSubtab === 'segments' && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">Dynamic Consumer cohorts segmentation</span>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {customerSegments.map((seg, sIdx) => (
                          <div key={sIdx} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/20 text-left space-y-2">
                            <span className="text-[9px] font-black bg-slate-100 text-[#c82a5c] px-2 py-0.5 rounded uppercase">{seg.conversion}</span>
                            <h4 className="font-extrabold text-[#111827] text-sm mt-2">{seg.name}</h4>
                            <p className="text-[11px] text-slate-500 font-semibold">{seg.criteria}</p>
                            <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-600">
                              Cohort count: <span className="font-mono text-slate-900 font-extrabold">{seg.count} Profile indices</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CRM Subtab 2: Coupons */}
                  {crmSubtab === 'coupons' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                      {/* Promo list */}
                      <div className="lg:col-span-7 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">Active Store Coupons list</span>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden text-xs">
                          {couponsList.map((cp, cIdx) => (
                            <div key={cIdx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                              <div className="space-y-1 font-semibold text-slate-600">
                                <h5 className="font-mono font-black text-rose-600 text-xs tracking-wider">{cp.code}</h5>
                                <p className="text-slate-500 text-[10px] leading-relaxed">{cp.desc}</p>
                              </div>
                              <div className="text-right font-mono font-black text-slate-800">
                                <span>{cp.type === 'percent' ? `${cp.disc}% rebate` : `₹${cp.disc} off`}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Promo generator form */}
                      <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl p-6 border border-slate-200 space-y-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-brand-navy">Create Promo Coupon Engine</h4>
                          <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Configure fresh coupon rules instantly onto customers.</p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Coupon Code</span>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-[#c82a5c]"
                              placeholder="e.g. MONSOON50"
                              value={newCouponCode}
                              onChange={(e) => setNewCouponCode(e.target.value)}
                            />
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Rebate rate discount value</span>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                              placeholder="e.g. 50"
                              value={newCouponDisc}
                              onChange={(e) => setNewCouponDisc(e.target.value)}
                            />
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Promo Type</span>
                            <select 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-[#c82a5c]"
                              value={newCouponType}
                              onChange={(e) => setNewCouponType(e.target.value)}
                            >
                              <option value="percent">Percentage rebate (%)</option>
                              <option value="flat">Flat value rebate (₹)</option>
                            </select>
                          </div>

                          <button 
                            onClick={() => {
                              if (!newCouponCode || !newCouponDisc) {
                                alert("Please fill standard coupon details!");
                                return;
                              }
                              const freshCoupon = {
                                code: newCouponCode.toUpperCase(),
                                disc: parseInt(newCouponDisc),
                                type: newCouponType,
                                maxCap: 500,
                                minOrder: 300,
                                desc: `${newCouponDisc}% rebate on select grocery lines.`
                              };
                              setCouponsList([freshCoupon, ...couponsList]);
                              alert(`Coupon ${newCouponCode.toUpperCase()} compiled and live!`);
                            }}
                            className="w-full bg-brand-navy hover:bg-[#c82a5c] text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            ✓ Activate Voucher Coupon
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CRM Subtab 3: WhatsApp/SMS campaigns */}
                  {crmSubtab === 'campaigns' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                      {/* Left: blast logs */}
                      <div className="lg:col-span-7 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">Past Marketing Campaigns logs</span>
                        <div className="border border-slate-200 bg-white rounded-2xl divide-y divide-slate-100 text-xs overflow-hidden">
                          {campaignLog.map((camp, cIdx) => (
                            <div key={cIdx} className="p-4 flex justify-between items-center bg-white">
                              <div className="space-y-1 font-semibold text-slate-600">
                                <span className="text-[8px] font-black bg-rose-50 border border-rose-100 px-2.5 py-1 text-rose-700 rounded-md w-fit inline-block">{camp.channel} Channel</span>
                                <h6 className="font-extrabold text-slate-800 text-xs mt-1">{camp.title}</h6>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase">To Segment: {camp.target}</p>
                              </div>
                              <div className="text-right font-mono font-semibold text-[10px] text-slate-600 space-y-0.5">
                                <p>Target pool: <span className="text-slate-900 font-extrabold">{camp.sentCount}</span></p>
                                <p>Clicks yield: <span className="text-slate-900 font-extrabold">{camp.clicks}</span> ({Math.round((camp.clicks / camp.sentCount) * 100)}%)</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Blast writer form */}
                      <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl p-6 border border-slate-200 text-left space-y-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-brand-navy">Core Marketing Campaign Launcher</h4>
                          <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Blast SMS, WhatsApp notifications directly to consumers.</p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Campaign Headline Title text</span>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                              placeholder="e.g. Complete Monsoon grocery rebate sale"
                              value={campaignTitleInput}
                              onChange={(e) => setCampaignTitleInput(e.target.value)}
                            />
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Target segmentation corridor</span>
                            <select 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-[#c82a5c]"
                              value={campaignSegmentInput}
                              onChange={(e) => setCampaignSegmentInput(e.target.value)}
                            >
                              {customerSegments.map(seg => (
                                <option key={seg.id} value={seg.name}>{seg.name} ({seg.count} buyers)</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Marketing Channel gateway</span>
                            <select 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-[#c82a5c]"
                              value={campaignChannelInput}
                              onChange={(e) => setCampaignChannelInput(e.target.value)}
                            >
                              <option value="WhatsApp">WhatsApp Marketing Interface</option>
                              <option value="SMS">SMS Campaign Terminal</option>
                              <option value="Push">Push Notification popup</option>
                            </select>
                          </div>

                          <button 
                            onClick={() => {
                              if (!campaignTitleInput) {
                                alert("Please type your campaign headline!");
                                return;
                              }
                              const findSeg = customerSegments.find(s => s.name === campaignSegmentInput) || { count: 120 };
                              const freshCamp = {
                                id: `camp-${Math.floor(Math.random() * 900 + 100)}`,
                                title: campaignTitleInput,
                                channel: campaignChannelInput,
                                target: campaignSegmentInput,
                                sentCount: findSeg.count,
                                delivered: findSeg.count - 3,
                                clicks: Math.floor(findSeg.count * 0.4)
                              };
                              setCampaignLog([freshCamp, ...campaignLog]);
                              alert(`Campaign blast submitted cleanly! ${findSeg.count} notifications dispatched successfully.`);
                              setCampaignTitleInput("");
                            }}
                            className="w-full bg-brand-navy hover:bg-[#c82a5c] text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer animate-pulse"
                          >
                            🚀 Send Blast Notification Live
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CRM Subtab 4: Membership upgrades */}
                  {crmSubtab === 'membership' && (
                    <div className="space-y-6 text-left">
                      <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50/50 max-w-xl text-left space-y-4">
                        <div>
                          <span className="text-[9px] font-black text-[#c82a5c] block uppercase tracking-widest bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl w-fit font-bold">Loyalty Membership Upgrades console</span>
                          <h4 className="font-extrabold text-brand-navy text-sm mt-3">Promote Consumer Membership Status tiers</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase leading-relaxed mt-1">Upgrade user memberships to unlock prioritized benefits.</p>
                        </div>

                        <div className="space-y-3 font-semibold text-slate-600 text-xs">
                          <p>Current Consumer profile: <span className="text-[#c82a5c] font-black">{userAuth.name} ({userAuth.phone})</span></p>
                          <p>E-wallet dynamic points score: <span className="font-mono text-slate-805 font-extrabold">{userAuth.loyaltyPoints} points earned</span></p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {loyaltyMemberships.map((tier, tIdx) => (
                            <div key={tIdx} className={`p-4 border rounded-2xl bg-gradient-to-br ${tier.color} text-left flex flex-col justify-between h-36 relative overflow-hidden shadow-sm`}>
                              <div className="space-y-1">
                                <h5 className="font-black text-xs uppercase tracking-wide">{tier.type} Tier</h5>
                                <p className="text-[8px] leading-relaxed font-semibold">{tier.perks}</p>
                              </div>
                              <button 
                                onClick={() => {
                                  alert(`Membership upgraded! ${userAuth.name} promoted successfully to Loyalty level: ${tier.type}.`);
                                }}
                                className="w-full mt-2 bg-slate-900/15 hover:bg-slate-900/30 text-slate-900 font-semibold text-[8px] font-black uppercase py-1.5 rounded"
                              >
                                Upgrade Tier
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FINANCE & GENERAL LEDGERS */}
            {adminTab === 'finance' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Finance Metric scorecards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Net GST Output Liability</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">₹{taxReports.netPayableGST.toFixed(2)}</h4>
                    <span className="text-[9px] block text-rose-600 font-bold uppercase mt-1">Calculated after Input ITC credits deductions</span>
                  </div>
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold font-black">Gross sales profit sheet</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">₹{ordersList.reduce((sum, o) => sum + o.total, 0) + 188350}</h4>
                    <span className="text-[9px] block text-emerald-600 font-bold uppercase mt-1">Outperforming local depot targets by 14%</span>
                  </div>
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Vendor liabilities payouts</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">₹{vendorList.reduce((acc, v) => acc + v.balanceDue, 0)}</h4>
                    <span className="text-[9px] block text-slate-400 font-semibold uppercase mt-1">Vendor outstandings outstanding</span>
                  </div>
                  <div className="bg-white border border-slate-250 p-6 rounded-3xl text-left">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-bold">Expense write-off totals</span>
                    <h4 className="text-2xl font-black text-brand-navy mt-1 font-mono">₹{expenses.reduce((sum, e) => sum + e.amount, 0)}</h4>
                    <span className="text-[8px] block text-slate-400 font-bold uppercase mt-1">Fuel reimbursements & WMS buffers</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  {/* Finance Subtabs */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Finance, Books & Tax Accounting Hub</h3>
                      <p className="text-xs text-rose-500 font-black uppercase tracking-widest mt-1">Sales/Purchase General Ledgers, GST Audit returns & TDS 194Q sheets</p>
                    </div>
                    <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-slate-100 pb-1">
                      {[
                        { id: 'sales', label: 'Journal General Ledger', icon: <Wallet className="h-3.5 w-3.5" /> },
                        { id: 'taxes', label: 'GST & TDS Returns auditing', icon: <Percent className="h-3.5 w-3.5" /> },
                        { id: 'pl', label: 'Profit & Loss Statement', icon: <TrendingUp className="h-3.5 w-3.5" /> },
                        { id: 'balance', label: 'Liabilities balance sheets', icon: <Building className="h-3.5 w-3.5" /> }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setFinanceSubtab(sub.id as any)}
                          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all ${financeSubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUBTAB 1: Journal Ledgers */}
                  {financeSubtab === 'sales' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                      {/* Debit/Credit entries */}
                      <div className="lg:col-span-7 space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold font-black">General bookkeeping ledger accounts journal</span>
                        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden text-xs">
                          <table className="w-full text-left bg-white">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                                <th className="p-3">Audit Date</th>
                                <th className="p-3">Reference index</th>
                                <th className="p-3">Particular description</th>
                                <th className="p-3 text-right">Debit Balance (+)</th>
                                <th className="p-3 text-right">Credit balance (-)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                              {financeLedger.map((ln, lIdx) => (
                                <tr key={lIdx} className="hover:bg-slate-50">
                                  <td className="p-3 text-slate-500 font-mono text-[10px]">{ln.date}</td>
                                  <td className="p-3 font-mono font-black text-[#c82a5c]">{ln.refId}</td>
                                  <td className="p-3 text-slate-900 font-extrabold">{ln.desc}</td>
                                  <td className="p-3 text-right font-mono text-emerald-600">{ln.debit > 0 ? `₹${ln.debit}` : "-"}</td>
                                  <td className="p-3 text-right font-mono text-rose-600">{ln.credit > 0 ? `₹${ln.credit}` : "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Expense entry form */}
                      <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl p-6 border border-slate-200 text-left space-y-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-brand-navy">Add Operational Expense Entry</h4>
                          <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Instantly book cash bills, petrol payouts, or office materials cost.</p>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Cost particulars description</span>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                              placeholder="e.g. Courier Petrol allowance reimbursement"
                              id="expense-desc-input"
                            />
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-405 block mb-1">Expense Category</span>
                            <select 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-[#c82a5c]"
                              id="expense-cat-input"
                            >
                              <option value="Fulfillment Costs">Fulfillment & fuel costs</option>
                              <option value="Packaging Materials">Packaging Boxes / Bubble-wraps</option>
                              <option value="IT Hub Space">AWS Router hosting bandwidth</option>
                              <option value="Administrative Costs">Office logistics / water utilities</option>
                            </select>
                          </div>

                          <div>
                            <span className="text-[9px] font-black uppercase text-slate-455 block mb-1">Spent Amount value (INR)</span>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800 focus:outline-[#c82a5c]"
                              placeholder="e.g. 1500"
                              id="expense-amt-input"
                            />
                          </div>

                          <button 
                            onClick={() => {
                              const descIn = (document.getElementById("expense-desc-input") as HTMLInputElement)?.value;
                              const catIn = (document.getElementById("expense-cat-input") as HTMLSelectElement)?.value;
                              const amtIn = (document.getElementById("expense-amt-input") as HTMLInputElement)?.value;
                              
                              const amountParsed = parseInt(amtIn);
                              if (!descIn || isNaN(amountParsed)) {
                                alert("Please fill standard cost specs!");
                                return;
                              }

                              const freshExpense = {
                                desc: descIn,
                                cat: catIn,
                                amount: amountParsed,
                                date: new Date().toISOString().split('T')[0]
                              };
                              setExpenses([freshExpense, ...expenses]);

                              // Log to finance ledger credits
                              setFinanceLedger(prev => [
                                { id: `exp-${Math.random().toString(36).substr(2,6)}`, date: freshExpense.date, refId: "EXPENSE", desc: `${freshExpense.desc} (${freshExpense.cat})`, debit: 0, credit: freshExpense.amount, balance: -18390 },
                                ...prev
                              ]);

                              alert(`Expense factored in successfully! ₹${amountParsed} ledgered credit entries compiled.`);
                              (document.getElementById("expense-desc-input") as HTMLInputElement).value = "";
                              (document.getElementById("expense-amt-input") as HTMLInputElement).value = "";
                            }}
                            className="w-full bg-[#c82a5c] hover:bg-[#b0224e] text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            ✓ Ledger Expense Credit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 2: GST/TDS tax sheets */}
                  {financeSubtab === 'taxes' && (
                    <div className="space-y-6 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold font-black">CGST, SGST Output vs Input ITC returns auditing ledger</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="border border-slate-200 bg-slate-50/10 rounded-2xl p-5 space-y-1">
                          <span className="text-[9px] font-black uppercase text-rose-500 font-bold">Total CGST/SGST Output Liability</span>
                          <h4 className="text-xl font-black text-brand-navy font-mono">₹{(taxReports.cgstOutput + taxReports.sgstOutput).toFixed(2)}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Tax aggregated on Hyperlocal shop checkouts output</p>
                        </div>
                        <div className="border border-slate-200 bg-slate-50/10 rounded-2xl p-5 space-y-1">
                          <span className="text-[9px] font-black uppercase text-emerald-600 font-bold font-black">Input tax credits (ITC) aggregated</span>
                          <h4 className="text-xl font-black text-brand-navy font-mono">₹{(taxReports.cgstInputCredit + taxReports.sgstInputCredit).toFixed(2)}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">ITC gained on raw central depot procurements</p>
                        </div>
                        <div className="border border-slate-200 bg-slate-50/10 rounded-2xl p-5 space-y-1">
                          <span className="text-[9px] font-black uppercase text-blue-500 font-bold">TDS aggregated (Section 194Q)</span>
                          <h4 className="text-xl font-black text-brand-navy font-mono">₹{taxReports.tdsCollected.toFixed(2)}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">TDS levied on raw vendor procurement transactions</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: Profit and Loss sheets */}
                  {financeSubtab === 'pl' && (
                    <div className="space-y-6 text-left max-w-xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold">Dynamic calculated Profit & Loss statement sheet</span>
                      <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white text-xs divide-y divide-slate-150">
                        <div className="p-4 flex justify-between bg-slate-50 font-black text-[10px] text-slate-500 uppercase tracking-wider">
                          <span>Accounting Parameter</span>
                          <span>Cumulative aggregate</span>
                        </div>
                        <div className="p-4 flex justify-between font-semibold">
                          <span className="text-slate-905 font-extrabold">A. Cumulative checkout revenues (Gross)</span>
                          <span className="font-mono text-emerald-600 font-black">₹{ordersList.reduce((sum, o) => sum + o.total, 0) + 188350}</span>
                        </div>
                        <div className="p-4 flex justify-between font-semibold">
                          <span className="text-slate-905 font-extrabold">B. Standard raw procurement vendor investments (COGS)</span>
                          <span className="font-mono text-slate-700 font-semibold">₹112000</span>
                        </div>
                        <div className="p-4 flex justify-between font-semibold">
                          <span className="text-slate-905 font-extrabold">C. Factored operational logistics costs (Fuel & WMS boxes)</span>
                          <span className="font-mono text-rose-600 font-black">₹{expenses.reduce((sum, e) => sum + e.amount, 0)}</span>
                        </div>
                        <div className="p-4 flex justify-between bg-brand-navy text-white text-sm font-black uppercase tracking-tight">
                          <span>Net pre-tax business margins (A - B - C)</span>
                          <span className="font-mono">₹{(ordersList.reduce((sum, o) => sum + o.total, 0) + 188350 - 112000 - expenses.reduce((sum, e) => sum + e.amount, 0))}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 4: Outstanding balances */}
                  {financeSubtab === 'balance' && (
                    <div className="space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-bold font-black">General vendor outstanding credit ledger</span>
                      <div className="border border-slate-200 rounded-3xl overflow-hidden text-xs bg-white">
                        <table className="w-full text-left bg-white">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              <th className="p-3">Vendor Account identity</th>
                              <th className="p-3">Primary Contact point</th>
                              <th className="p-3">Vendor scoring rating</th>
                              <th className="p-3 text-right">Outstanding balance due</th>
                              <th className="p-3 text-center">Incur immediate checkout</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {vendorList.map((vn, vIdx) => (
                              <tr key={vIdx} className="hover:bg-slate-50">
                                <td className="p-3 font-extrabold text-[#111827]">{vn.name}</td>
                                <td className="p-3 text-slate-500">{vn.contact} ({vn.email})</td>
                                <td className="p-3 text-amber-500 font-black">{vn.ledgerRating} ★</td>
                                <td className="p-3 text-right font-mono text-rose-600 font-black">₹{vn.balanceDue}</td>
                                <td className="p-3 text-center">
                                  <button 
                                    onClick={() => {
                                      if (vn.balanceDue === 0) return;
                                      alert(`UPI Netbank check verification compiled! Cleared outstanding balance to ${vn.name}. ₹${vn.balanceDue} debited.`);
                                      const updatedVendors = [...vendorList];
                                      updatedVendors[vIdx].balanceDue = 0;
                                      setVendorList(updatedVendors);
                                    }}
                                    className="bg-brand-navy hover:bg-[#c82a5c] text-white text-[8px] font-black uppercase px-2.5 py-1 rounded"
                                  >
                                    Clear Debt
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* TAB CONTENT 2: MASTER MODULES */}
            {adminTab === 'masters' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Master modules sub tabs */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  {[
                    { id: 'company', label: 'Company Master', icon: <Briefcase className="h-3.5 w-3.5" /> },
                    { id: 'branches', label: 'Branch Master', icon: <MapPin className="h-3.5 w-3.5" /> },
                    { id: 'brands', label: 'Brand Master', icon: <Layers className="h-3.5 w-3.5" /> },
                    { id: 'categories', label: 'Product Category Master', icon: <ShoppingBasket className="h-3.5 w-3.5" /> }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setMasterSubtab(sub.id as any)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${masterSubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sub Tab: Company Master */}
                {masterSubtab === 'company' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Enterprise Company Profile Master</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Global settings for GST, Tax filings, and Invoice prefix mapping structures</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Company Registered Name</label>
                        <input
                          type="text"
                          value={companyMaster.name}
                          onChange={(e) => setCompanyMaster({ ...companyMaster, name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold focus:ring-1 focus:ring-brand-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Corporate GST Identification Number (GSTIN)</label>
                        <input
                          type="text"
                          value={companyMaster.gst}
                          onChange={(e) => setCompanyMaster({ ...companyMaster, gst: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono focus:ring-1 focus:ring-brand-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Tax Permanent Account Number (PAN)</label>
                        <input
                          type="text"
                          value={companyMaster.pan}
                          onChange={(e) => setCompanyMaster({ ...companyMaster, pan: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono focus:ring-1 focus:ring-brand-green focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Billing Prefix string</label>
                        <input
                          type="text"
                          value={companyMaster.prefix}
                          onChange={(e) => setCompanyMaster({ ...companyMaster, prefix: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold focus:ring-1 focus:ring-brand-green focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Headquarters Physical Address</label>
                        <textarea
                          rows={2}
                          value={companyMaster.address}
                          onChange={(e) => setCompanyMaster({ ...companyMaster, address: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold focus:ring-1 focus:ring-brand-green focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Settlement Bank Particulars Ledger</label>
                        <input
                          type="text"
                          value={companyMaster.bank}
                          onChange={(e) => setCompanyMaster({ ...companyMaster, bank: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold focus:ring-1 focus:ring-brand-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Company Profile configurations updated onto centralized db server.")}
                      className="rounded-xl bg-brand-navy px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Save Profile Parameters
                    </button>
                  </div>
                )}

                {/* Sub Tab: Branch Master */}
                {masterSubtab === 'branches' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Active Fulfillment Branches Directory</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Configured coordinates, service radius limits, managers, and hours.</p>
                      </div>
                      <button
                        onClick={() => {
                          const newBr = {
                            id: `br-${branchMaster.length + 1}`,
                            name: "East Noida Hub Transit",
                            code: `HUB-NDI-0${branchMaster.length + 1}`,
                            address: "Sector 62, Noida",
                            city: "Noida",
                            state: "Delhi NCR",
                            pin: "201301",
                            lat: 28.6282,
                            lng: 77.3898,
                            manager: "Devendra Verma",
                            contact: "+91 92211 44558",
                            hours: "06:00 AM - 10:00 PM",
                            radius: 6,
                            warehouse: "Noida Regional WH-C"
                          };
                          setBranchMaster([...branchMaster, newBr]);
                          alert(`Added branch: ${newBr.name}`);
                        }}
                        className="rounded-xl bg-[#c82a5c] hover:bg-[#b0224e] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white cursor-pointer"
                      >
                        Onboard New Branch Terminal
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                            <th className="p-4">Branch Code</th>
                            <th className="p-4">Branch Name / Area</th>
                            <th className="p-4">Assigned Warehouse</th>
                            <th className="p-4">Manager Name</th>
                            <th className="p-4">Manager Mobile</th>
                            <th className="p-4">Fulfillment Limit (Radius)</th>
                            <th className="p-4">Operating Hours</th>
                            <th className="p-4 text-right">Coordinate Maps</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {branchMaster.map(br => (
                            <tr key={br.id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-mono font-bold text-[#c82a5c]">{br.code}</td>
                              <td className="p-4">
                                <div className="font-extrabold text-[#1e293b]">{br.name}</div>
                                <div className="text-[10px] text-slate-400">{br.address}, {br.city} ({br.pin})</div>
                              </td>
                              <td className="p-4 font-mono text-slate-500">{br.warehouse}</td>
                              <td className="p-4">{br.manager}</td>
                              <td className="p-4">{br.contact}</td>
                              <td className="p-4 text-center font-extrabold">Within {br.radius} km</td>
                              <td className="p-4 text-slate-500">{br.hours}</td>
                              <td className="p-4 text-right font-mono text-[10px] text-slate-400">{br.lat.toFixed(4)}, {br.lng.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub Tab: Brand Master */}
                {masterSubtab === 'brands' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                    <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Supplying Brands Registry</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Configure brand manufacturer parentage, commission margins, and default tax codes.</p>
                      </div>
                      <button
                        onClick={() => {
                          const name = prompt("Enter Brand Name:") || "";
                          if (!name) return;
                          const mfr = prompt("Enter Manufacturer Name:") || "Aero Global Mfr";
                          const commission = parseInt(prompt("Enter Commission Percent (0-100):") || "10");
                          const newBrand = {
                            id: `b-${brandMaster.length + 1}`,
                            name,
                            manufacturer: mfr,
                            logo: name.substring(0, 2).toUpperCase(),
                            category: "Groceries",
                            gst: 5,
                            commission,
                            priority: "Medium"
                          };
                          setBrandMaster([...brandMaster, newBrand]);
                          alert(`Brand ${name} logged on state.`);
                        }}
                        className="rounded-xl bg-[#c82a5c] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white cursor-pointer"
                      >
                        Register New Brand Code
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {brandMaster.map(br => (
                        <div key={br.id} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-lg font-mono">
                            {br.logo}
                          </div>
                          <div className="space-y-1 flex-1">
                            <span className="text-[8px] font-black bg-rose-100 text-[#c82a5c] px-2 py-0.5 rounded uppercase tracking-wider">{br.priority} Priority</span>
                            <h4 className="font-extrabold text-sm text-brand-navy">{br.name}</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Mfg: {br.manufacturer}</p>
                            
                            <div className="grid grid-cols-3 gap-2 border-t border-slate-200/50 pt-2.5 mt-2.5 text-[10px] font-mono text-slate-500 font-bold uppercase">
                              <div>
                                <span className="block text-[8px] text-slate-400">Class</span>
                                <span className="text-[#1e293b]">{br.category}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-slate-400">CGST</span>
                                <span className="text-slate-800">{br.gst}%</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-slate-400">Payout %</span>
                                <span className="text-emerald-600">{br.commission}% Off</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Tab: Category Master */}
                {masterSubtab === 'categories' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Product Categories Master</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">All active catalog taxonomies linked to front customer app filters.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {categories.map((cat) => (
                        <div key={cat.id} className="p-4 border border-slate-100 rounded-3xl bg-white hover:border-brand-green flex flex-col items-center justify-center text-center gap-2">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#c82a5c]">
                            <ShoppingBasket className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black uppercase text-slate-700 tracking-wider leading-tight">{cat.name}</span>
                            <span className="text-[8px] font-mono font-extrabold text-slate-400 block mt-0.5">{cat.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: PRODUCT MANAGER */}
            {adminTab === 'products' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Onboard SKU product form block */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Onboard New SKU (Product Master Wizard)</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Add products with strict basic parameters, transactional pricing, inventory safety buffers, and search URL SEO configurations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Basic details */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Product Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Organic Brown Rice"
                        value={onboardProduct.name}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Stock Keeping Unit (SKU)</label>
                      <input
                        type="text"
                        placeholder="SKU-BR-09"
                        value={onboardProduct.SKU}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, SKU: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Barcode Bar String</label>
                      <input
                        type="text"
                        placeholder="UPC-881203"
                        value={onboardProduct.barcode}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, barcode: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">HSN Code Code</label>
                      <input
                        type="text"
                        placeholder="1006.30.20"
                        value={onboardProduct.HSN}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, HSN: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>

                    {/* Taxonomy details */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Category Link</label>
                      <select
                        value={onboardProduct.category}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Linked Brand Code</label>
                      <select
                        value={onboardProduct.brand}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, brand: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none"
                      >
                        {brandMaster.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Sales Unit</label>
                      <input
                        type="text"
                        placeholder="1kg, 500ml, 1 Pack"
                        value={onboardProduct.unit}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, unit: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Physical Weight</label>
                      <input
                        type="text"
                        placeholder="1.0 kg"
                        value={onboardProduct.weight}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, weight: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>

                    {/* Pricing fields */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Price: MRP (Max Retails)</label>
                      <input
                        type="number"
                        value={onboardProduct.MRP}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, MRP: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Price: Standard Selling</label>
                      <input
                        type="number"
                        value={onboardProduct.sellingPrice}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Price: Purchase Cost</label>
                      <input
                        type="number"
                        value={onboardProduct.purchasePrice}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, purchasePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Inventory: Minimum Safety Alert</label>
                      <input
                        type="number"
                        value={onboardProduct.minStock}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, minStock: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>

                    {/* Media images and video fields */}
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Display Image (URL Link)</label>
                      <input
                        type="text"
                        value={onboardProduct.imageUrl}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, imageUrl: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div className="sm:col-span-2 shadow-sm rounded-xl p-3 border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#c82a5c] uppercase">Computed Gross Profit margin %:</span>
                      <span className="text-sm font-black text-emerald-600 font-mono">
                        {(((onboardProduct.sellingPrice - onboardProduct.purchasePrice) / (onboardProduct.sellingPrice || 1)) * 100).toFixed(0)}% Profit
                      </span>
                    </div>

                    {/* SEO variables */}
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">SEO URL slug</label>
                      <input
                        type="text"
                        value={onboardProduct.seoUrl}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, seoUrl: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">SEO Keywords tags</label>
                      <input
                        type="text"
                        value={onboardProduct.seoKeywords}
                        onChange={(e) => setOnboardProduct({ ...onboardProduct, seoKeywords: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!onboardProduct.name || !onboardProduct.SKU) {
                        alert("Alert: Title and SKU string cannot be empty.");
                        return;
                      }
                      const loadedProduct: Product = {
                        id: `p-${products.length + 1}`,
                        name: onboardProduct.name,
                        price: onboardProduct.sellingPrice,
                        image: onboardProduct.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
                        category: onboardProduct.category,
                        brand: onboardProduct.brand,
                        unit: onboardProduct.unit,
                        stock: 100
                      };
                      setProducts([...products, loadedProduct]);
                      alert(`SKU ${onboardProduct.SKU} registered! Added "${loadedProduct.name}" into customer list.`);
                    }}
                    className="rounded-2xl bg-[#c82a5c] hover:bg-[#b0224e] px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-rose-100 transition-all cursor-pointer"
                  >
                    Onboard SKU Product
                  </button>
                </div>

                {/* Existing products checklist table */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                  <div className="flex justify-between items-center border-b border-rose-100 pb-3">
                    <span className="text-xs font-black uppercase text-brand-navy tracking-widest">Global Product Registry (All brands / SKUs)</span>
                    <span className="text-[10px] font-black bg-rose-50 text-[#c82a5c] px-3 py-1 rounded-full uppercase">{products.length} Products registered</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Associated Category</th>
                          <th className="p-3">Brand Name</th>
                          <th className="p-3 text-right">Selling Price</th>
                          <th className="p-3 text-right">Unit Class</th>
                          <th className="p-3 text-center">Safety Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {products.map(pr => (
                          <tr key={pr.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-[#c82a5c]">{pr.id}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img src={pr.image} className="h-8 w-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                                <span className="font-extrabold text-brand-navy">{pr.name}</span>
                              </div>
                            </td>
                            <td className="p-3 font-semibold uppercase">{categories.find(c => c.id === pr.categoryId)?.name || pr.categoryId}</td>
                            <td className="p-3 font-extrabold text-[#c82a5c] uppercase">{pr.brand}</td>
                            <td className="p-3 text-right font-black text-brand-navy">₹{pr.price.toFixed(2)}</td>
                            <td className="p-3 text-right font-mono text-slate-400">{pr.unit}</td>
                            <td className="p-3 text-center">
                              <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">Stock Perfect</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: INVENTORY CONTROL */}
            {adminTab === 'inventory' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Inventory submenu */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  {[
                    { id: 'sync', label: 'Real-time Stock Levels', icon: <Boxes className="h-3.5 w-3.5" /> },
                    { id: 'warehouses', label: 'Multi-Warehouse', icon: <Building className="h-3.5 w-3.5" /> },
                    { id: 'expiry', label: 'Expiry & Freshness', icon: <Clock className="h-3.5 w-3.5" /> },
                    { id: 'transfer', label: 'Stock Transfers', icon: <RefreshCw className="h-3.5 w-3.5" /> }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setInventorySubtab(sub.id as any)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${inventorySubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sub: Realtime Sync */}
                {inventorySubtab === 'sync' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Real-Time Sync Stock Matrix</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Automatic buffer mapping between micro hubs and central nodes.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <th className="p-3">SKU ID</th>
                            <th className="p-3">Product Description</th>
                            <th className="p-3">Reserve Alloc</th>
                            <th className="p-3 text-right">Central Warehouse WH-A</th>
                            <th className="p-3 text-right">BKC Hub Store Node</th>
                            <th className="p-3 text-right">Westside Depot Store Node</th>
                            <th className="p-3 text-center font-bold">Sync Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700 font-semibold">
                          {[
                            { SKU: "SKU-BR-101", desc: "Premium Basmati Aged Grains", central: 500, bkc: 120, westside: 85, res: 5 },
                            { SKU: "SKU-SD-021", desc: "Sourdough Organic Bread", central: 40, bkc: 12, westside: 8, res: 1 },
                            { SKU: "SKU-MF-993", desc: "Dairy Milk Full Cream Tetra", central: 800, bkc: 44, westside: 30, res: 2 }
                          ].map(item => (
                            <tr key={item.SKU} className="hover:bg-slate-50/50">
                              <td className="p-3 font-mono text-[#c82a5c] font-black">{item.SKU}</td>
                              <td className="p-3 text-[#1e293b] font-extrabold">{item.desc}</td>
                              <td className="p-3 text-[#c82a5c] font-mono font-bold text-center">{item.res} allocated</td>
                              <td className="p-3 text-right font-mono">{item.central} bags</td>
                              <td className="p-3 text-right font-mono font-bold text-[#1e293b]">{item.bkc} units</td>
                              <td className="p-3 text-right font-mono">{item.westside} units</td>
                              <td className="p-3 text-center">
                                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-[8px] uppercase tracking-wider font-extrabold">Matched</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub: Multi Warehouse */}
                {inventorySubtab === 'warehouses' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Warehouse Nodes Capacity Ledger</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Status of wholesale buffer locations supplying active branch depots.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {warehouseList.map(wh => (
                        <div key={wh.id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                          <div className="flex justify-between items-center border-b border-rose-100 pb-2">
                            <span className="text-[10px] font-black uppercase text-[#c82a5c]">{wh.zone}</span>
                            <span className="text-teal-600 text-[10px] font-black bg-teal-50 px-2 py-0.5 rounded uppercase">{wh.capacity}</span>
                          </div>
                          <h4 className="font-extrabold text-sm text-brand-navy">{wh.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-500 uppercase font-bold">
                            <div>
                              <span className="block text-[8px] text-slate-400">Hub Manager</span>
                              <span className="text-slate-800">{wh.manager}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold">Stock Log SKU Count</span>
                              <span className="text-slate-800">{wh.stockItems.toLocaleString()} boxes</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub: Expiry & Freshness Liquidation Trigger */}
                {inventorySubtab === 'expiry' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 font-medium">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Expiry & Freshness Guard Protocol</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Near expiry stock parameters. Trigger active liquidation offers instantly onto the customer storefront.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <th className="p-3">SKU Code</th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Batch Reference</th>
                            <th className="p-3">Expiry Date</th>
                            <th className="p-3 font-bold text-center">Remaining Days</th>
                            <th className="p-3 text-right">Physical Stock</th>
                            <th className="p-3 text-right">Liquidation Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                          {expiryAlerts.map(alertItem => (
                            <tr key={alertItem.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-mono font-bold text-[#c82a5c]">{alertItem.SKU}</td>
                              <td className="p-3 font-extrabold text-brand-navy">{alertItem.productName}</td>
                              <td className="p-3 font-mono text-slate-400">{alertItem.batch}</td>
                              <td className="p-3 font-bold text-rose-600">{alertItem.expiry}</td>
                              <td className="p-3 font-black text-center text-[#c82a5c] bg-orange-50/30">T-Minus {alertItem.daysRemaining} days</td>
                              <td className="p-3 text-right font-mono font-black">{alertItem.stock} units</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    alert(`Liquidation applied! Automated 50% discount registered. Selling price of "${alertItem.productName}" updated on Customer view.`);
                                    // Update milk or sourdough price in live local state automatically!
                                    setProducts(prev => 
                                      prev.map(p => p.name.includes("Milk") || p.name.includes("Bread") ? { ...p, price: p.price / 2 } : p)
                                    );
                                  }}
                                  className="rounded bg-rose-600 text-white hover:bg-rose-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 cursor-pointer transition-colors"
                                >
                                  Trigger 50% Sale Promo
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub: Branches Stock Transfer */}
                {inventorySubtab === 'transfer' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-left font-medium">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Inter-Hub Stock Transfers (Transit Ledger)</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Dispatch excess product reserves from slow depots to hyperactive hubs securely.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">From Sending Depot</label>
                        <select className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:outline-none">
                          <option>Thane East Depot (HUB-THN-03)</option>
                          <option>Downtown Mumbai Hub</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">To Receiving Depot</label>
                        <select className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:outline-none">
                          <option>Downtown Mumbai Hub (HUB-MUM-01)</option>
                          <option>Westside Suburb Center </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">SKU Item Asset</label>
                        <select className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:outline-none">
                          {products.map(p => (
                            <option key={p.id}>{p.name} ({p.unit})</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            const newTransfer = {
                              id: `trn-${Math.floor(Math.random()*900 + 100)}`,
                              date: new Date().toISOString().split('T')[0],
                              fromBranch: "Thane East Depot",
                              toBranch: "Downtown Mumbai Hub",
                              SKU: "SKU-TP-32",
                              product: "Charcoal Toothpaste",
                              qty: 15,
                              status: "Verified Transit"
                            };
                            setStockTransfers([newTransfer, ...stockTransfers]);
                            alert("Stock Transfer request submitted to dispatch couriers.");
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                        >
                          Execute Transfer
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Historic Stock Transfer Registers</span>
                      <div className="divide-y divide-slate-100">
                        {stockTransfers.map(trn => (
                          <div key={trn.id} className="py-3 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-mono text-[10px] text-[#c82a5c] font-black block">{trn.id} <span className="text-slate-400 font-bold font-sans">| {trn.date}</span></span>
                              <span className="font-extrabold text-brand-navy block mt-0.5">Asset: {trn.product} ({trn.qty} units)</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 font-bold block">{trn.fromBranch} → {trn.toBranch}</span>
                              <span className="rounded bg-teal-500 font-mono text-[8px] font-extrabold uppercase px-2 py-0.5 text-slate-900 inline-block mt-1">{trn.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 5: PURCHASE SYSTEM */}
            {adminTab === 'purchase' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Purchase tabs */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  {[
                    { id: 'vendors', label: 'Vendor Directory', icon: <UserCheck className="h-3.5 w-3.5" /> },
                    { id: 'po', label: 'Purchase Orders (PO)', icon: <ClipboardList className="h-3.5 w-3.5" /> },
                    { id: 'grn', label: 'Goods Receipt Note (GRN)', icon: <Check className="h-3.5 w-3.5" /> },
                    { id: 'ledger', label: 'Outstanding Ledgers', icon: <Percent className="h-3.5 w-3.5" /> }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setPurchaseSubtab(sub.id as any)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${purchaseSubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sub: Vendors */}
                {purchaseSubtab === 'vendors' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 font-medium text-slate-700">
                    <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Enterprise Vendor Directory Directory</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Associated agricultural and consumer goods manufacturers supplying BKC Core warehouse.</p>
                      </div>
                      <button
                        onClick={() => {
                          const name = prompt("Enter vendor title:") || "";
                          if (!name) return;
                          const contact = prompt("Enter contact person:") || "Sunil Gupta";
                          const balance = parseInt(prompt("Enter outstanding opening balance:") || "0");
                          const newV = {
                            id: `v-${vendorList.length + 1}`,
                            name,
                            contact,
                            email: `${contact.toLowerCase().replace(' ','')}@v-corp.in`,
                            phone: "+91 99330 11202",
                            balanceDue: balance,
                            ledgerRating: 4.5
                          };
                          setVendorList([...vendorList, newV]);
                          alert(`Vendor ${name} saved successfully.`);
                        }}
                        className="rounded-xl bg-[#c82a5c] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white cursor-pointer"
                      >
                        Onboard New Vendor
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {vendorList.map(vend => (
                        <div key={vend.id} className="border border-slate-200 p-6 rounded-2xl bg-slate-50 shadow-inner flex flex-col justify-between space-y-4">
                          <div className="border-b border-rose-100 pb-2">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{vend.id} <span className="mx-1">|</span> rating: {vend.ledgerRating} ★</span>
                            <h4 className="font-extrabold text-[#1e293b] text-base">{vend.name}</h4>
                          </div>
                          
                          <div className="space-y-1.5 text-[11px] font-bold">
                            <div className="text-slate-500">Rep: {vend.contact}</div>
                            <div className="text-slate-500">Phone: {vend.phone}</div>
                            <div className="text-slate-500">Email: {vend.email}</div>
                          </div>

                          <div className="border-t border-slate-100/50 pt-3 flex justify-between items-center">
                            <div>
                              <span className="block text-[8px] text-slate-400 uppercase font-black">Ledger Balance Due</span>
                              <span className="text-sm font-black text-rose-600 font-mono">₹{vend.balanceDue.toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => {
                                alert(`Simulating payment order of ₹${vend.balanceDue} via HDFC settlement tunnel...`);
                                setVendorList(prev => 
                                  prev.map(v => v.id === vend.id ? { ...v, balanceDue: 0 } : v)
                                );
                                alert(`Outstanding ledger of ${vend.name} paid to zero!`);
                              }}
                              disabled={vend.balanceDue === 0}
                              className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-slate-800 disabled:opacity-40 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 cursor-pointer"
                            >
                              Settle Balance
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub: PO */}
                {purchaseSubtab === 'po' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-left font-medium">
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Purchase Orders Creator & History</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Submit wholesale asset supply requests to verified vendors.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Target Vendor Partner</label>
                        <select className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:outline-none">
                          {vendorList.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Item Specifications List (SKUs and Qtys)</label>
                        <input
                          type="text"
                          placeholder="e.g. Premium Basmati Rice x100 Bags, DairyFresh tetra x200"
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            const newPO = {
                              id: `PO-2026-0${purchaseOrders.length + 1}`,
                              vendorId: "v-1",
                              date: new Date().toISOString().split('T')[0],
                              expectedDate: "2026-05-24",
                              total: 45000,
                              status: "Submitted to Vendor",
                              itemLines: "Harvest Gold Sourdough Grains x100 Packages"
                            };
                            setPurchaseOrders([...purchaseOrders, newPO]);
                            alert(`Purchase Order ${newPO.id} successfully compiled and locked.`);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl cursor-pointer"
                        >
                          Emit PO Order
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Logged Active POs</span>
                      <div className="divide-y divide-slate-150 border rounded-2xl overflow-hidden bg-slate-50/20">
                        {purchaseOrders.map(po => (
                          <div key={po.id} className="p-4 flex items-center justify-between text-xs hover:bg-white transition-colors">
                            <div>
                              <span className="font-mono text-[10px] text-[#c82a5c] font-black block">{po.id} <span className="text-slate-400 font-extrabold font-sans">| Date logged: {po.date}</span></span>
                              <span className="font-extrabold text-[#1e293b] block mt-1">Itemized lines: {po.itemLines}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-brand-navy block mt-0.5">₹{po.total.toLocaleString()}</span>
                              <span className="rounded bg-teal-500 font-mono text-[8px] font-extrabold uppercase px-2 py-0.5 text-slate-900 inline-block mt-1">{po.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub: GRN verify */}
                {purchaseSubtab === 'grn' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-left font-medium">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Goods Receipt Note (GRN) Inspector</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Verify physical counts during dock deliveries against corresponding PO totals.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <th className="p-3">GRN Refer</th>
                            <th className="p-3">PO Partner</th>
                            <th className="p-3">Shed Date</th>
                            <th className="p-3 text-right">Received Count</th>
                            <th className="p-3 text-right">Accepted Count</th>
                            <th className="p-3 text-right">Rejected Count</th>
                            <th className="p-3">Reason for Rejection</th>
                            <th className="p-3">Verified Inspector</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 text-slate-600 font-semibold leading-normal">
                          {grnList.map(grn => (
                            <tr key={grn.id} className="hover:bg-slate-50/50">
                              <td className="p-3 font-mono font-black text-[#c82a5c]">{grn.id}</td>
                              <td className="p-3 font-mono text-slate-500">{grn.poId}</td>
                              <td className="p-3 font-medium text-slate-400">{grn.date}</td>
                              <td className="p-3 text-right font-mono">{grn.receivedQty} bags</td>
                              <td className="p-3 text-right font-mono font-bold text-emerald-600">{grn.acceptedQty} bags</td>
                              <td className="p-3 text-right font-mono text-rose-600 font-bold">{grn.rejectedQty} bags</td>
                              <td className="p-3 text-rose-700 italic font-medium">{grn.rejectedReason}</td>
                              <td className="p-3 text-brand-navy font-bold">{grn.verifiedBy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub: Ledger */}
                {purchaseSubtab === 'ledger' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-left font-medium">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Supplying Vendors Central Ledger</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Audit trail matching purchases, payments, and credit notes.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <th className="p-3">Transaction Entry ID</th>
                            <th className="p-3">Transaction Date</th>
                            <th className="p-3">Particulars Detail</th>
                            <th className="p-3 text-right">Debit Paid (₹)</th>
                            <th className="p-3 text-right">Credit Owed (₹)</th>
                            <th className="p-3 text-right">Cumulative Balance (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                          {vendorLedgers.map(l => (
                            <tr key={l.id} className="hover:bg-slate-50/50">
                              <td className="p-3 text-[#c82a5c] font-black">{l.id}</td>
                              <td className="p-3 text-slate-400 font-sans font-medium">{l.date}</td>
                              <td className="p-3 text-[#1e293b] font-extrabold font-sans leading-relaxed">{l.particulars}</td>
                              <td className="p-3 text-right text-emerald-600 font-extrabold">₹{l.debit.toLocaleString()}</td>
                              <td className="p-3 text-right text-rose-500 font-extrabold">₹{l.credit.toLocaleString()}</td>
                              <td className="p-3 text-right font-black text-[#1e293b]">₹{l.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 6: VENDOR PANEL CENTRE */}
            {adminTab === 'vendor' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Simulated login indicator */}
                <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 flex items-center justify-between flex-wrap gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-navy rounded-full text-brand-green">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">Identity bound successfully</span>
                      <h4 className="font-black text-brand-navy text-md">Simulating: Bombay Agro Foods Terminal</h4>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={vendorAuthCode} 
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-600"
                    />
                    <button 
                      onClick={() => alert("Credentials verified. Handshake completed.")}
                      className="rounded-xl bg-brand-navy text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                    >
                      Linked Lock
                    </button>
                  </div>
                </div>

                {/* Sub tabs in vendor panel */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  {[
                    { id: 'dashboard', label: 'Supplier Hub KPIs', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
                    { id: 'orders', label: 'Inbound Orders (Real-time)', icon: <ShoppingCart className="h-3.5 w-3.5" /> },
                    { id: 'commission', label: 'My Komisyon Reports', icon: <Percent className="h-3.5 w-3.5" /> }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setVendorSubtab(sub.id as any)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${vendorSubtab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>

                {/* Part: Dashboard */}
                {vendorSubtab === 'dashboard' && (
                  <div className="grid gap-6 sm:grid-cols-3 text-left">
                    <div className="border border-slate-200 p-6 rounded-2xl bg-white space-y-2">
                      <span className="block text-[8px] uppercase text-slate-400 font-black">Contract base margin payout</span>
                      <h4 className="text-2xl font-black text-brand-navy">8.0% Flat Payout</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Covers whole agro staples</p>
                    </div>
                    <div className="border border-slate-200 p-6 rounded-2xl bg-white space-y-2">
                      <span className="block text-[8px] uppercase text-slate-400 font-black">Contract delivery cap limit</span>
                      <h4 className="text-2xl font-black text-[#c82a5c]">₹1.5 Lakhs / Day</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dock doors limit code #1</p>
                    </div>
                    <div className="border border-slate-200 p-6 rounded-2xl bg-white space-y-2">
                      <span className="block text-[8px] uppercase text-slate-400 font-black">Authorized stock lines</span>
                      <h4 className="text-2xl font-black text-teal-600">Premium Grains Only</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">3 SKUs currently active</p>
                    </div>
                  </div>
                )}

                {/* Part: Inbound orders with Accept / Dispatch triggers */}
                {vendorSubtab === 'orders' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-left font-medium">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Dynamic Vendor Order Dispatch Center</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Pending order fulfillment requests incoming from BKC branch.</p>
                    </div>

                    <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="font-mono text-[10px] text-[#c82a5c] font-black block">PO-99831 <span className="text-slate-400 font-sans font-bold">| BKC Demand #881</span></span>
                        <h4 className="font-extrabold text-brand-navy mt-1">Required: 40 Bags Premium Basmati grains</h4>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Requested date: Today, 13:00</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert("Consignment registered as ACCEPTED. Warehouse pickers authorized.")}
                          className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-slate-800 text-[10px] font-black uppercase tracking-widest px-4 py-2 cursor-pointer"
                        >
                          Accept PO Demand
                        </button>
                        <button
                          onClick={() => {
                            alert("Consignment loaded & dispatched! Electric delivery scooters synchronized with transit coordinates.");
                            // We can set active order flow back for demo!
                            alert("Demo telemetry: Synchronized with Live Rider route.");
                          }}
                          className="rounded-xl bg-[#c82a5c] hover:bg-[#b0224e] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 cursor-pointer"
                        >
                          Dispatch Truck Node
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Part: Commission reports */}
                {vendorSubtab === 'commission' && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-left font-medium">
                    <div>
                      <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight">Settled Commission Payout Logs</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">Flat margin returns calculated matching completed sales contracts.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider font-semibold">
                            <th className="p-3">Payout Ref</th>
                            <th className="p-3">Sales Order ID</th>
                            <th className="p-3">Product Delivered</th>
                            <th className="p-3 text-right">Sale Volume Value</th>
                            <th className="p-3 text-center">Contract Payout Rate</th>
                            <th className="p-3 text-right">Commission Earned (₹)</th>
                            <th className="p-3 text-center">Settlement Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                          {vendorCommissionLogs.map(com => (
                            <tr key={com.id} className="hover:bg-slate-50/50">
                              <td className="p-3 text-[#c82a5c] font-black">{com.id}</td>
                              <td className="p-3 font-sans text-slate-500 font-medium">{com.orderId}</td>
                              <td className="p-3 font-sans text-brand-navy font-bold leading-normal">{com.product}</td>
                              <td className="p-3 text-right text-brand-navy">₹{com.saleVal.toFixed(2)}</td>
                              <td className="p-3 text-center font-sans font-extrabold">{com.pct}% Contract</td>
                              <td className="p-3 text-right text-emerald-600 font-extrabold">₹{com.commissionPaid.toFixed(2)}</td>
                              <td className="p-3 text-center">
                                <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded text-[8px] uppercase tracking-wider font-extrabold font-sans">Transferred to Bank</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SPECIALTY COMMERCE CHANNELS */}
            {adminTab === 'specialty_channels' && (
              <div className="space-y-8 animate-in fade-in duration-200 text-left">
                {/* Header */}
                <div className="bg-[#c82a5c] border border-[#a21944] text-white rounded-3xl p-8 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">Enterprise Specialty Verticals</span>
                      <h3 className="text-3xl font-black text-white mt-1">Specialty Commercial Channels & Smart POS</h3>
                    </div>
                    <div className="flex bg-[#8b163d] text-[#ffff00] border border-[#ffff00]/30 rounded-2xl px-4 py-2 font-black uppercase text-xs tracking-widest font-mono">
                      Specialty Hub v3.04
                    </div>
                  </div>
                  <p className="text-sm text-rose-50 max-w-4xl leading-relaxed">
                    Access specialized channel dispatching layers integrated directly into Mart.OS Central Fulfillment. Simulates bulk restaurant supply lines, B2B wholesale freight logistics, corporate pantry refreshments pipelines, housing society micro-subscriptions, and offline instant scan registers.
                  </p>
                </div>

                {/* Specialty subtabs navigation */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'restaurant', label: 'Restaurant / Kitchen', icon: <Utensils className="h-4 w-4" /> },
                    { id: 'wholesale', label: 'B2B Wholesale Trade', icon: <Store className="h-4 w-4" /> },
                    { id: 'corporate', label: 'Corporate Supply', icon: <Briefcase className="h-4 w-4" /> },
                    { id: 'subscription', label: 'Subscription Drops', icon: <CalendarRange className="h-4 w-4" /> },
                    { id: 'pos', label: 'Smart POS Register', icon: <Receipt className="h-4 w-4" /> }
                  ].map(sub => {
                    const isSel = specialtySubtab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSpecialtySubtab(sub.id as any)}
                        className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isSel 
                            ? 'bg-[#c82a5c] text-white shadow-lg shadow-rose-250 border-b-2 border-yellow-350' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:text-[#c82a5c] hover:bg-slate-50'
                        }`}
                      >
                        {sub.icon}
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Subtab contents */}
                {specialtySubtab === 'restaurant' && (
                  <div className="grid gap-8 lg:grid-cols-12 animate-in fade-in duration-200">
                    <div className="lg:col-span-8 space-y-8">
                      {/* Recipe Ingredients SKU Calculator */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                        <div className="border-b border-slate-100 pb-3 text-left">
                          <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-[#c82a5c]" />
                            HoReCa Custom Recipe SKU & Ingredient Estimator
                          </h4>
                          <p className="text-[11px] text-slate-450 font-bold uppercase mt-0.5">Automates bulk ingredient procurement calculation based on live caterers requests</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Target Cuisine Dish / Menu Base</label>
                              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-brand-navy focus:outline-none focus:border-[#c82a5c]">
                                <option>Special Biryani Batch (50 Plates Base)</option>
                                <option>Tandoori Paneer Platter (40 Plates Base)</option>
                                <option>Royal Gala Fruit Salad Cup (100 Litres Base)</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Scale Multiplier (Plate Count Target)</label>
                              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2">
                                <button 
                                  onClick={() => setRestaurantMaterialThreshold(prev => Math.max(10, prev - 10))}
                                  className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-brand-navy cursor-pointer hover:bg-slate-50"
                                >
                                  -
                                </button>
                                <span className="flex-1 text-center font-mono font-black text-xs text-brand-navy">{restaurantMaterialThreshold} Units Base Scale</span>
                                <button 
                                  onClick={() => setRestaurantMaterialThreshold(prev => Math.min(200, prev + 10))}
                                  className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-[#c82a5c] cursor-pointer hover:bg-slate-50"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 text-left">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Generated Bill of Materials (BOM) Requirements</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { name: 'Premium Basmati Rice', qty: (restaurantMaterialThreshold * 1.2).toFixed(1), unit: 'kg', stockLeft: 240 },
                                { name: 'Organic Salt & Sugar spice', qty: (restaurantMaterialThreshold * 0.15).toFixed(2), unit: 'kg', stockLeft: 105 },
                                { name: 'Full Cream Milk', qty: (restaurantMaterialThreshold * 0.8).toFixed(1), unit: 'Litres', stockLeft: 180 },
                                { name: 'Fresh Royal Gala Apples', qty: (restaurantMaterialThreshold * 0.4).toFixed(1), unit: 'kg', stockLeft: 550 },
                                { name: 'Cold Pressed Butter Oils', qty: (restaurantMaterialThreshold * 0.25).toFixed(2), unit: 'Litres', stockLeft: 95 }
                              ].map((ing, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-150 space-y-1 text-left">
                                  <span className="text-[10px] text-brand-navy font-black block truncate">{ing.name}</span>
                                  <div className="flex justify-between items-baseline">
                                    <strong className="text-[#c82a5c] text-sm font-mono">{ing.qty} {ing.unit}</strong>
                                    <span className="text-[8px] text-slate-400 font-semibold font-mono">Stock: {ing.stockLeft}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              alert(`Procurement Request Dispatched!\n\nRequisition of ${(restaurantMaterialThreshold * 1.2).toFixed(1)}kg Rice + ingredients sent to Warehouse Picker line.`);
                              setAuditLogsRegistry(prev => [
                                { timestamp: new Date().toTimeString().split(' ')[0], event: 'ORECA_REQUISITION', desc: `Automatic ingredient calculator translated ${restaurantMaterialThreshold} cuisine multiplier target into warehouse bulk orders.`, level: 'INFO', module: 'HORECA' },
                                ...prev
                              ]);
                            }}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer text-center"
                          >
                            🚀 Approve & Dispatch Requisition To Warehouse picker line
                          </button>
                        </div>
                      </div>

                      {/* Active Restaurant Kitchen Orders */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-105 pb-3">
                          <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                            <Clock className="h-5 w-5 text-[#c82a5c]" />
                            Live Restaurant Kitchen Tickets Pipeline (KOT)
                          </h4>
                          <span className="text-[9.5px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase font-black tracking-wider animate-pulse">Socket active</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-150 text-slate-405 font-extrabold uppercase tracking-wider select-none">
                                <th className="pb-3 text-left">KOT ID</th>
                                <th className="pb-3">Outlet Client</th>
                                <th className="pb-3">Bulk Content Lines</th>
                                <th className="pb-3 text-center">Status</th>
                                <th className="pb-3 text-right">Activity Dispatch</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {restaurantOrders.map((ord) => (
                                <tr key={ord.id} className="hover:bg-slate-50/50">
                                  <td className="py-3 font-mono font-black text-[#c82a5c]">{ord.id}</td>
                                  <td className="py-3 font-bold text-slate-800">{ord.client}</td>
                                  <td className="py-3 text-slate-500 font-mono font-medium">{ord.items}</td>
                                  <td className="py-3 text-center">
                                    <span className={`px-2.5 py-1 rounded text-[8.5px] uppercase font-black tracking-widest ${
                                      ord.status === 'Received' ? 'bg-blue-100 text-blue-700' :
                                      ord.status === 'Prepping' ? 'bg-amber-100 text-amber-700' :
                                      'bg-emerald-100 text-emerald-700 font-black'
                                    }`}>
                                      {ord.status}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    <button
                                      onClick={() => {
                                        const nextStatusMap: Record<string, string> = { 'Received': 'Prepping', 'Prepping': 'Dispatched', 'Dispatched': 'Received' };
                                        const updatedStatus = nextStatusMap[ord.status];
                                        setRestaurantOrders(prev => prev.map(o => o.id === ord.id ? { ...o, status: updatedStatus } : o));
                                        setAuditLogsRegistry(prev => [
                                          { timestamp: new Date().toTimeString().split(' ')[0], event: 'KOT_TRANSITION', desc: `KOT ${ord.id} status modified to ${updatedStatus} for B2B kitchen delivery client.`, level: 'INFO', module: 'RESTAURANT' },
                                          ...prev
                                        ]);
                                      }}
                                      className="bg-slate-100 hover:bg-slate-200 text-brand-navy font-bold font-sans rounded px-2.5 py-1 text-[9px] uppercase tracking-wider cursor-pointer"
                                    >
                                      Advance Status ↻
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      {/* Restaurant KPIs */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">Restaurant Pipeline Metrics</h4>
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left">
                            <span className="text-slate-400 uppercase font-black tracking-wider text-[9px] block font-sans">Live Dispatch SLA Met</span>
                            <span className="text-2xl font-black text-brand-navy block mt-1 font-sans">99.14%</span>
                            <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ Safe bounds inside 15-minute windows</p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left">
                            <span className="text-slate-400 uppercase font-black tracking-wider text-[9px] block font-sans">Active Outlets</span>
                            <span className="text-2xl font-black text-brand-navy block mt-1 font-sans">34 Restaurants</span>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Average order ticket: ₹14,240</p>
                          </div>

                          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-xs text-left">
                            <span className="text-sky-800 uppercase font-black tracking-wider text-[9px] block mb-1 font-sans">Cold Chain Monitoring</span>
                            <strong className="text-sky-900 block font-mono text-xs">All transport vans configured at 4.2°C</strong>
                            <p className="text-[10px] text-sky-800 mt-1 leading-normal">GPS linked reefer trucks transmitting real-time telematics packet logs.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {specialtySubtab === 'wholesale' && (
                  <div className="grid gap-8 lg:grid-cols-12 animate-in fade-in duration-200 text-left">
                    <div className="lg:col-span-8 space-y-8">
                      {/* B2B Tiered Volume Pricing Simulator */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                        <div className="border-b border-slate-100 pb-3 text-left">
                          <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                            <Store className="h-5 w-5 text-[#c82a5c]" />
                            B2B Volume Wholesale Pricing & Carrier Logistics Dispatch
                          </h4>
                          <p className="text-[11px] text-slate-405 font-bold uppercase mt-0.5">Calculates progressive discounts based on cargo weight & assigns freight fleets</p>
                        </div>

                        <div className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Committed Purchase Volume</label>
                              <div className="space-y-2">
                                <input 
                                  type="range" 
                                  min="200" 
                                  max="5000" 
                                  step="100"
                                  value={wholesaleVolumeTier}
                                  onChange={(e) => setWholesaleVolumeTier(parseInt(e.target.value))}
                                  className="w-full accent-[#c82a5c] cursor-pointer"
                                />
                                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                                  <span>200 kg</span>
                                  <strong className="text-[#c82a5c] text-xs">{wholesaleVolumeTier} kg Cargo Weight</strong>
                                  <span>5,000 kg</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Select Cargo Product Commodity</label>
                              <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-brand-navy focus:outline-none focus:border-[#c82a5c]">
                                <option>Premium Basmati Rice (Premium Long Grain)</option>
                                <option>Organic Brown Cane Sugar</option>
                                <option>Raw Farm Potatoes bulk (Grade A)</option>
                              </select>
                            </div>
                          </div>

                          {/* Computed calculations */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid sm:grid-cols-3 gap-4 text-xs">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-150 text-left">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block leading-none mb-1">Standard B2C Retail Price</span>
                              <strong className="text-brand-navy text-sm font-mono strike-through">₹{(120).toFixed(2)} / kg</strong>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-[#c82a5c]/20 text-left">
                              <span className="text-[9px] text-[#c82a5c] font-black uppercase tracking-wider block leading-none mb-1">Effective Wholesale Price (Bulk Disc.)</span>
                              <strong className="text-[#c82a5c] text-sm font-mono">
                                ₹{(120 * (wholesaleVolumeTier < 1000 ? 0.95 : wholesaleVolumeTier < 2505 ? 0.85 : 0.75)).toFixed(2)} / kg
                              </strong>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-left">
                              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider block leading-none mb-1">Your Enterprise Margin Saved</span>
                              <strong className="text-emerald-600 text-sm font-mono">
                                ₹{(120 * (wholesaleVolumeTier < 1000 ? 0.05 : wholesaleVolumeTier < 2505 ? 0.15 : 0.25) * wholesaleVolumeTier).toFixed(2)}
                              </strong>
                            </div>
                          </div>

                          {/* Freight Allocation Checker */}
                          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3 font-sans text-xs">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Assigned Transport Logistic Fleet Container</span>
                            <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-slate-150">
                              <Truck className="h-10 w-10 text-[#c82a5c] p-2 bg-rose-50 rounded-lg animate-pulse" />
                              <div className="flex-1 text-left">
                                <span className="font-extrabold text-brand-navy block text-xs">
                                  {wholesaleVolumeTier < 1000 ? 'Mini Dispatch Chhota Hathi van' : wholesaleVolumeTier < 2500 ? 'Tata Ultra LPT Freight Truck' : 'BharatBenz Multi-axle Reefer-Flatbed'}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-semibold leading-normal">
                                  Capacity: {wholesaleVolumeTier < 1000 ? '1,500' : wholesaleVolumeTier < 2500 ? '4,500' : '12,000'} kg maximum capability. Status: Pending payload dispatch.
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setWholesaleInvoicePrinted(true);
                                alert("B2B Dynamic Multi-tax Invoice generated successfully! Ledger registers updated with tax accounts.");
                                setAuditLogsRegistry(prev => [
                                  { timestamp: new Date().toTimeString().split(' ')[0], event: 'B2B_INVOICE_GEN', desc: `Tax invoices processed under GST criteria with 18% integrated credit mapping.`, level: 'INFO', module: 'FIN_B2B' },
                                  ...prev
                                ]);
                              }}
                              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase py-3 rounded-xl text-xs tracking-wider cursor-pointer text-center md:py-4"
                            >
                              📋 Generate Multi-tax B2B Invoice
                            </button>
                            <button
                              onClick={() => {
                                alert(`Contract finalized for ${wholesaleVolumeTier} kg commodity with logistics carrier. Dispatched to pick bay.`);
                                setAuditLogsRegistry(prev => [
                                  { timestamp: new Date().toTimeString().split(' ')[0], event: 'B2B_CONTRACT_SIGNED', desc: `Wholesale contract for ${wholesaleBuyerCompany} under terms ${wholesaleCreditTerms} confirmed.`, level: 'SUCCESS', module: 'FIN_B2B' },
                                  ...prev
                                ]);
                              }}
                              className="bg-[#c82a5c] hover:bg-rose-700 text-white font-black uppercase px-6 py-3 rounded-xl text-xs tracking-wider cursor-pointer text-center md:py-4"
                            >
                              ✍️ Lock Contract & Dispatch Route
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* B2B Credit check Underwriting */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">Underwriting & Credit Term Checker</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Corporate Buyer Company</label>
                            <input 
                              type="text" 
                              value={wholesaleBuyerCompany}
                              onChange={(e) => setWholesaleBuyerCompany(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Payment credit limits term</label>
                            <select 
                              value={wholesaleCreditTerms}
                              onChange={(e) => setWholesaleCreditTerms(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                            >
                              <option value="NET_15">NET 15 days credit</option>
                              <option value="NET_30">NET 30 days credit</option>
                              <option value="NET_60">NET 60 days credit</option>
                              <option value="NET_90">NET 90 days credit</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={() => {
                                const score = Math.floor(Math.random() * 200) + 600;
                                alert(`Simulated API checking underwritings:\n\nCompany: ${wholesaleBuyerCompany}\nCIBIL Score Match: ${score}\nSimulated Underwriting Assessment: Approved for credit limit ₹2,50,000.\nTerms: ${wholesaleCreditTerms}`);
                                setAuditLogsRegistry(prev => [
                                  { timestamp: new Date().toTimeString().split(' ')[0], event: 'CREDIT_MATCH', desc: `Underwrote ${wholesaleBuyerCompany} credit capability. Risk index check: Score ${score} - Low Risk.`, level: 'INFO', module: 'UNDERWRITING' },
                                  ...prev
                                ]);
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase py-3 rounded-xl tracking-wider cursor-pointer text-center"
                            >
                              🛡️ Underwrite PO Credit Limit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      {/* Live contract preview */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left font-sans">
                        <span className="text-[9px] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded font-mono font-black text-indigo-700 uppercase block w-fit">Interactive contract outline</span>
                        <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">Specialist Contract Summary</h4>
                        
                        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3 font-mono text-[11px] leading-tight text-slate-600">
                          <p><strong>Entity:</strong> {wholesaleBuyerCompany}</p>
                          <p><strong>SLA Method:</strong> Class-3 Freight distribution</p>
                          <p><strong>Underwriting Term:</strong> {wholesaleCreditTerms}</p>
                          <p><strong>Est payload:</strong> {wholesaleVolumeTier} kg</p>
                          <p><strong>Gross value:</strong> ₹{(120 * 0.8 * wholesaleVolumeTier).toFixed(2)}</p>
                          <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-400 font-sans">
                            *Auto-negotiated contract proposal pricing adjusts relative to active Dark Store live storage index parameters.
                          </div>
                        </div>

                        {wholesaleInvoicePrinted && (
                          <div className="rounded-xl border border-emerald-205 bg-emerald-50 text-emerald-800 p-3.5 text-xs font-medium leading-relaxed">
                            ✓ Invoice status lock engaged. Sync verified with branch balance ledger sheets.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {specialtySubtab === 'corporate' && (
                  <div className="grid gap-8 lg:grid-cols-12 animate-in fade-in duration-200 text-left">
                    <div className="lg:col-span-8 space-y-8">
                      {/* corporate Pantry snack calculator */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                        <div className="border-b border-slate-100 pb-3 text-left">
                          <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-[#c82a5c]" />
                            Corporate Pantry Snacks & Refreshments Planner
                          </h4>
                          <p className="text-[11px] text-slate-405 font-bold uppercase mt-0.5">Calculates required monthly provisions based on active corporate headcount</p>
                        </div>

                        <div className="space-y-4 text-left">
                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Total Employee Count (FTE)</label>
                            <div className="space-y-2">
                              <input 
                                type="range" 
                                min="20" 
                                max="1000" 
                                step="10"
                                value={corpEmployeeCount}
                                onChange={(e) => setCorpEmployeeCount(parseInt(e.target.value))}
                                className="w-full accent-[#c82a5c] cursor-pointer"
                              />
                              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                                <span>20 employees</span>
                                <strong className="text-[#c82a5c] text-xs">{corpEmployeeCount} Employees active</strong>
                                <span>1,000 employees</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Active Pantry Items Configuration</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {['Coffee Beans', 'Snack Bar Multi', 'Premium Milk', 'Sparkling Soda', 'Fresh Tea Crates', 'Fruit Baskets', 'Cereal Packets', 'Oat Biscuits'].map(item => {
                                const isSel = corpPantryActiveItems.includes(item);
                                return (
                                  <button
                                    key={item}
                                    onClick={() => {
                                      if (isSel) {
                                        setCorpPantryActiveItems(prev => prev.filter(i => i !== item));
                                      } else {
                                        setCorpPantryActiveItems(prev => [...prev, item]);
                                      }
                                    }}
                                    className={`p-3 rounded-xl border text-xs font-bold text-center tracking-wide block cursor-pointer transition-all ${
                                      isSel 
                                        ? 'bg-amber-100 text-amber-900 border-amber-305 shadow-xs' 
                                        : 'bg-white border-slate-205 text-slate-500 hover:bg-slate-50'
                                    }`}
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs font-semibold text-left">
                            <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-wider block mb-2">Calculated Monthly Corporate order summary</span>
                            <div className="space-y-2">
                              {corpPantryActiveItems.map((item, idx) => {
                                const itemSumQty = Math.ceil(corpEmployeeCount * 0.35);
                                const itemSumPrice = itemSumQty * 180;
                                return (
                                  <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-150">
                                    <span className="text-brand-navy font-bold">{item}</span>
                                    <div className="flex gap-4 font-mono">
                                      <span className="text-slate-400">Qty: {itemSumQty} Box</span>
                                      <strong className="text-[#c82a5c]">₹{itemSumPrice.toFixed(2)}</strong>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* GST and Corporate invoicing */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">GSTIN Offset Tax Credit Calculator</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Enter Corporate GSTIN</label>
                            <input 
                              type="text" 
                              value={corpGstin}
                              onChange={(e) => setCorpGstin(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold font-mono text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Pantry billing schedule cycle</label>
                            <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]">
                              <option>Monthly (Net 30 invoice)</option>
                              <option>Bi-weekly recurring auto-sweep</option>
                              <option>Quarterly prepaid credit limits</option>
                            </select>
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={() => {
                                const baseVal = corpPantryActiveItems.length * corpEmployeeCount * 0.35 * 180;
                                const gstSavings = baseVal * 0.18;
                                alert(`Corporate tax profile successfully validated for GSTIN: ${corpGstin}.\n\nTotal monthly base order: ₹${baseVal.toFixed(2)}\nEstimated GST input tax credit (ITC) savings: ₹${gstSavings.toFixed(2)} (Available for offset next fiscal filing).`);
                                setAuditLogsRegistry(prev => [
                                  { timestamp: new Date().toTimeString().split(' ')[0], event: 'GST_OFFSET', desc: `Computed input tax credit of ₹${gstSavings.toFixed(2)} for GSTIN ${corpGstin}.`, level: 'INFO', module: 'TAX_LEDGER' },
                                  ...prev
                                ]);
                              }}
                              className="w-full bg-[#c82a5c] text-white text-xs font-black uppercase py-4 rounded-xl tracking-wider cursor-pointer text-center hover:bg-rose-700"
                            >
                              ⚡ Compute Tax Savings & lock cycle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                      {/* Corporate benefits card */}
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white text-left space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-[#c82a5c] rounded-full filter blur-2xl opacity-20 pointer-events-none" />
                        
                        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffff00] font-sans">Mart.OS Corporate perks</div>
                        <h4 className="text-lg font-black text-white font-sans">Enterprise provisioning benefits package</h4>
                        
                        <ul className="space-y-3.5 text-xs text-slate-350 list-disc list-inside font-medium leading-relaxed font-sans">
                          <li>Dedicated account manager & SLA coordinator.</li>
                          <li>No-minimum threshold on replacement delivery runs.</li>
                          <li>Guaranteed cold chain fresh produce priority.</li>
                          <li>Custom pricing discount tier matrices tied to net volume.</li>
                        </ul>

                        <div className="border-t border-slate-800 pt-4 text-center">
                          <button
                            onClick={() => {
                              alert("Sample supply calendar set. Recurring dispatchers activated for Mumbai office BKC cluster.");
                            }}
                            className="bg-white hover:bg-slate-50 text-slate-900 font-sans font-black uppercase tracking-wider text-[10px] w-full py-2.5 rounded-xl cursor-pointer"
                          >
                            📅 Activate Supply Calendar Planner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {specialtySubtab === 'subscription' && (
                  <div className="grid gap-8 lg:grid-cols-12 animate-in fade-in duration-200 text-left">
                    <div className="lg:col-span-8 space-y-8">
                      {/* Subscription Active management list */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-left">
                          <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                            <CalendarRange className="h-5 w-5 text-[#c82a5c]" />
                            Daily drops & high-frequency subscription management planner
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono uppercase font-black">100% On-time Mornings</span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-150 text-slate-405 font-extrabold uppercase tracking-widest select-none">
                                <th className="pb-3 text-left">Subscription ID</th>
                                <th className="pb-3">Resident / Customer</th>
                                <th className="pb-3">Subscribed product Drop</th>
                                <th className="pb-3">Drop Frequency Schedule</th>
                                <th className="pb-3 text-center">Status</th>
                                <th className="pb-3 text-right">Schedule change</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {specialtySubscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50">
                                  <td className="py-3 font-mono font-black text-[#c82a5c]">{sub.id}</td>
                                  <td className="py-3 font-bold text-slate-800">{sub.customer}</td>
                                  <td className="py-3 font-bold text-brand-navy">{sub.item}</td>
                                  <td className="py-3 text-slate-500 font-bold">{sub.frequency}</td>
                                  <td className="py-3 text-center">
                                    <span className={`px-2.5 py-1 rounded text-[8px] uppercase tracking-wide font-black block w-fit mx-auto ${
                                      sub.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {sub.status}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    <button
                                      onClick={() => {
                                        const nextStatus = sub.status === 'Active' ? 'Paused' : 'Active';
                                        setSpecialtySubscriptions(prev => prev.map(s => s.id === sub.id ? { ...s, status: nextStatus } : s));
                                        setAuditLogsRegistry(prev => [
                                          { timestamp: new Date().toTimeString().split(' ')[0], event: 'SUB_STATUS_CHANGE', desc: `Subscription drop status toggled to ${nextStatus} for subscriber ${sub.customer}`, level: 'INFO', module: 'SUBSCR_DROP' },
                                          ...prev
                                        ]);
                                      }}
                                      className={`font-sans rounded font-black px-2 py-1 text-[9px] uppercase tracking-wider cursor-pointer ${
                                        sub.status === 'Active' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {sub.status === 'Active' ? 'Pause Drop ⏸' : 'Resume Drop ▶'}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Add Custom subscriber dropdown drop config */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">Add New Society Resident Subscription</h4>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const customerName = formData.get('cust_name') as string || 'New Society Resident';
                            const selectItem = formData.get('sub_item') as string;
                            const schedFreq = formData.get('sub_freq') as string;
                            
                            const newId = 'SUB-' + (100 + specialtySubscriptions.length + 1);
                            setSpecialtySubscriptions(prev => [
                              ...prev,
                              { id: newId, customer: customerName, item: selectItem, frequency: schedFreq, status: 'Active' }
                            ]);
                            setAuditLogsRegistry(prev => [
                              { timestamp: new Date().toTimeString().split(' ')[0], event: 'SUB_ADDED', desc: `Created high-frequency automated drop ${newId} for ${customerName} at designated slot.`, level: 'SUCCESS', module: 'SUBSCR_DROP' },
                              ...prev
                            ]);
                            alert(`Subscription Activated!\n\n${selectItem} configured for ${customerName} dropping: ${schedFreq}.`);
                            (e.currentTarget as any).reset();
                          }}
                          className="grid sm:grid-cols-4 gap-4 items-end"
                        >
                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Resident / House No</label>
                            <input 
                              name="cust_name"
                              type="text" 
                              required
                              placeholder="e.g. Ramesh Patel, C-404 Wing B"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Subscription Item</label>
                            <select name="sub_item" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]">
                              <option value="Full Cream Milk (2L)">Full Cream Milk (2L)</option>
                              <option value="Double-Baked Bread Slice">Double-Baked Bread Slice</option>
                              <option value="Artisanal Sourdough Bread">Artisanal Sourdough Bread</option>
                              <option value="Fresh Garden Eggs (6 units)">Fresh Garden Eggs (6 units)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Drop Schedule</label>
                            <select name="sub_freq" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]">
                              <option value="Daily (Morning Drop)">Daily (Morning Drop)</option>
                              <option value="Alternate Days">Alternate Days</option>
                              <option value="Weekends Only Drop">Weekends Only Drop</option>
                              <option value="Every Monday Slot">Every Monday Slot</option>
                            </select>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="w-full bg-[#c82a5c] text-white text-xs font-black uppercase py-2.5 rounded-xl tracking-wider cursor-pointer text-center hover:bg-rose-700"
                            >
                              ➕ Activate Daily Drop
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8 text-left">
                      {/* Subscription optimization metrics */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs font-semibold text-left">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">Morning Express Optimization</h4>
                        <div className="space-y-3">
                          <p className="text-slate-500 leading-normal font-sans font-medium">
                            All subscription drops are routed out of the closest fulfillment center automatically. Dispatch vans exit by 5:30 AM to hit society gates before traffic.
                          </p>

                          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2">
                            <span className="text-[9px] text-[#c82a5c] font-black uppercase tracking-wider block font-sans">Automatic dispatcher route tag</span>
                            <div className="flex justify-between items-center bg-white border border-slate-150 p-2.5 rounded-lg font-mono">
                              <span className="text-brand-navy font-bold">Society Gate-pass Code</span>
                              <strong className="text-blue-600">PASS_BKC_SOCIETY_8829</strong>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2">
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block font-sans">Target Drop ETA Windows</span>
                            <strong className="text-brand-navy block font-mono">06:00 AM - 07:30 AM drop window</strong>
                          </div>

                          <button
                            onClick={() => {
                              alert("Auto route maps optimized for tomorrow mornings dispatch route! Consolidated 22 packages.");
                            }}
                            className="bg-slate-900 border border-slate-800 text-white font-black uppercase py-2.5 text-[10px] w-full rounded-xl cursor-pointer"
                          >
                            ⚡ Optimize Dispatch Routes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {specialtySubtab === 'pos' && (
                  <div className="grid gap-8 lg:grid-cols-12 animate-in fade-in duration-200 text-left">
                    <div className="lg:col-span-8 space-y-8">
                      {/* Smart POS Wedge Scanner Input */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                        <div className="border-b border-slate-100 pb-3 flex justify-between items-center text-left">
                          <div>
                            <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                              <Receipt className="h-5 w-5 text-[#c82a5c]" />
                              Mart.OS offline Smart POS register desk
                            </h4>
                            <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Integrates laser wedge barcode wedge inputs and cash register logic</p>
                          </div>
                          <span className="text-[9px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-mono font-black text-indigo-700 uppercase animate-pulse">POS Terminal active</span>
                        </div>

                        <div className="space-y-4 text-left">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2 font-sans">Simulate Barcode Swipe Scan (Select Product SKU)</label>
                          <div className="flex gap-3">
                            <select 
                              value={posScannerInput}
                              onChange={(e) => setPosScannerInput(e.target.value)}
                              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-extrabold text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                            >
                              <option value="">-- select product to scan --</option>
                              {PRODUCTS.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Price: ₹{p.price})</option>
                              ))}
                            </select>
                            
                            <button
                              onClick={() => {
                                if (!posScannerInput) {
                                  alert("Please select a product commodity to swipe scan!");
                                  return;
                                }
                                const matchedP = PRODUCTS.find(p => p.id === posScannerInput);
                                if (matchedP) {
                                  setPosTerminalCart(prev => {
                                    const exist = prev.find(item => item.id === matchedP.id);
                                    if (exist) {
                                      return prev.map(item => item.id === matchedP.id ? { ...item, qty: item.qty + 1 } : item);
                                    } else {
                                      return [...prev, { id: matchedP.id, name: matchedP.name, price: matchedP.price, qty: 1 }];
                                    }
                                  });
                                  setPosScannerInput('');
                                  setAuditLogsRegistry(prev => [
                                    { timestamp: new Date().toTimeString().split(' ')[0], event: 'BARCODE_POS_WEDGE', desc: `POS wedge register matched SKU: '${matchedP.name}' directly into cash index.`, level: 'INFO', module: 'SMART_POS' },
                                    ...prev
                                  ]);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-black uppercase px-6 py-3 rounded-2xl tracking-wider cursor-pointer"
                            >
                              ✓ Scan Wedge Barcode
                            </button>
                          </div>
                        </div>

                        {/* Scanned Items table */}
                        <div className="space-y-4 text-left">
                          <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-wider block">Active register scanned checkout cart</span>
                          <div className="overflow-x-auto rounded-2xl border border-slate-205">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-widest select-none">
                                  <th className="p-3">POS SKU</th>
                                  <th className="p-3 text-right">Standard Rate</th>
                                  <th className="p-3 text-center">Quantities</th>
                                  <th className="p-3 text-right">Aggregated Net</th>
                                  <th className="p-3 text-right">Register Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {posTerminalCart.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wide">
                                      Register empty. Scan barcodes above to record ledger journal items.
                                    </td>
                                  </tr>
                                ) : (
                                  posTerminalCart.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50">
                                      <td className="p-3 font-bold text-brand-navy">{item.name}</td>
                                      <td className="p-3 text-right font-mono">₹{item.price.toFixed(2)}</td>
                                      <td className="p-3 text-center font-mono">
                                        <div className="flex items-center justify-center gap-2">
                                          <button 
                                            onClick={() => {
                                              setPosTerminalCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
                                            }}
                                            className="h-5 w-5 bg-slate-100 font-bold flex items-center justify-center text-brand-navy rounded hover:bg-slate-200 cursor-pointer"
                                          >
                                            -
                                          </button>
                                          <span className="font-bold w-6">{item.qty}</span>
                                          <button 
                                            onClick={() => {
                                              setPosTerminalCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
                                            }}
                                            className="h-5 w-5 bg-slate-100 font-bold flex items-center justify-center text-brand-navy rounded hover:bg-slate-200 cursor-pointer"
                                          >
                                            +
                                          </button>
                                        </div>
                                      </td>
                                      <td className="p-3 text-right font-mono font-bold">₹{(item.price * item.qty).toFixed(2)}</td>
                                      <td className="p-3 text-right">
                                        <button 
                                          onClick={() => {
                                            setPosTerminalCart(prev => prev.filter(i => i.id !== item.id));
                                          }}
                                          className="text-rose-500 font-semibold hover:underline"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                          
                          {posTerminalCart.length > 0 && (
                            <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
                              <span className="text-xs font-black text-brand-navy uppercase">Total Billable POS Amount</span>
                              <strong className="text-brand-navy text-2xl font-mono">
                                ₹{posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cash changer utility */}
                      {posTerminalCart.length > 0 && (
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                          <h4 className="font-black text-brand-navy uppercase tracking-tight text-sm">Instant Cash change optimizer calculator</h4>
                          <div className="grid sm:grid-cols-3 gap-4 text-left">
                            <div>
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Total bill payable</label>
                              <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-mono font-black text-brand-navy">
                                ₹{posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Cash Received from Customer</label>
                              <div className="flex gap-2 mb-2">
                                {[100, 500, 1000].map(amt => (
                                  <button 
                                    key={amt}
                                    type="button"
                                    onClick={() => setPosCashAmount(amt)}
                                    className={`flex-1 text-[10px] font-black py-1 px-2 border rounded-lg cursor-pointer ${posCashAmount === amt ? 'bg-brand-navy text-brand-green border-brand-green' : 'bg-white border-slate-205 text-slate-500 hover:bg-slate-50'}`}
                                  >
                                    ₹{amt}
                                  </button>
                                ))}
                              </div>
                              <input 
                                type="number" 
                                value={posCashAmount}
                                onChange={(e) => setPosCashAmount(parseFloat(e.target.value) || 0)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-mono font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Change to Return to customer</label>
                              <div className={`w-full rounded-xl border px-3 py-2 text-xs font-mono font-black ${
                                posCashAmount >= posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0)
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}>
                                {posCashAmount >= posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0)
                                  ? `Return Change: ₹${(posCashAmount - posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0)).toFixed(2)}`
                                  : `Owes Register: ₹${-(posCashAmount - posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0)).toFixed(2)}`
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Receipt Preview panel */}
                    <div className="lg:col-span-4 space-y-8 text-left">
                      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                        <span className="text-[9px] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono font-black text-slate-500 uppercase block w-fit">Virtual POS Thermal layout printer</span>
                        
                        {/* Thermal printed paper look */}
                        <div className="bg-slate-50 border border-slate-300 p-6 rounded-2xl font-mono text-[10.5px] text-slate-800 leading-tight space-y-2 select-all shadow-inner text-left">
                          <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                            <h5 className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">*** MART.OS SMART REGISTER ***</h5>
                            <p className="text-[9px] text-slate-400">Branch: BKC Dark Store West Terminal-04</p>
                            <p className="text-[9px] text-slate-400">Date: {new Date().toISOString().split('T')[0]} | Time: {new Date().toTimeString().split(' ')[0]}</p>
                          </div>

                          <div className="space-y-1">
                            {posTerminalCart.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="font-bold">{item.name} x{item.qty}</span>
                                <span>₹{(item.price * item.qty).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-left">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Gross Total</span>
                              <span>₹{posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>SGST (9%)</span>
                              <span>₹{(posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.09).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>CGST (9%)</span>
                              <span>₹{(posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.09).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-extrabold text-[#c82a5c] text-[12px] border-t border-b border-dashed border-slate-300 py-1">
                              <span>GRAND RECONCILE</span>
                              <span>₹{(posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.18).toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="space-y-1 font-mono text-[9px] text-slate-405 text-left">
                            <p>Cash tendered: ₹{posCashAmount.toFixed(2)}</p>
                            <p>Change returned: ₹{Math.max(0, posCashAmount - posTerminalCart.reduce((sum, item) => sum + (item.price * item.qty), 0) * 1.18).toFixed(2)}</p>
                          </div>

                          <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1">
                            <div className="text-xs text-slate-400 tracking-widest leading-none">||| | ||| || ||| |||</div>
                            <p className="text-[8.5px] uppercase font-bold text-slate-500">Thank you for visiting! Registered online offline double-ledgers.</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            if (posTerminalCart.length === 0) {
                              alert("Please scan products first to generate a thermal ticket receipt.");
                              return;
                            }
                            alert("Thermal Register Dispatch successfully triggered! Hardware ledger printed securely via webhook.");
                            setAuditLogsRegistry(prev => [
                              { timestamp: new Date().toTimeString().split(' ')[0], event: 'POS_PRINTED', desc: `Hard thermal receipt generated for registers sweep. Audit state confirmed.`, level: 'SUCCESS', module: 'SMART_POS' },
                              ...prev
                            ]);
                            setPosTerminalCart([]);
                          }}
                          className="w-full bg-[#c82a5c] hover:bg-rose-700 text-white font-black uppercase text-xs py-3 rounded-2xl tracking-wider cursor-pointer text-center block"
                        >
                          🖨️ Commit Sale & Print Thermal Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: ENTERPRISE BI & ANALYTICS */}
            {adminTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in duration-200 text-left">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight">Enterprise BI & Analytics Engine</h3>
                      <p className="text-xs text-rose-500 font-extrabold uppercase tracking-widest mt-1">
                        10-Module Hyperlocal Decoded Performance Panels
                      </p>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-xl font-mono text-[10px] font-black text-[#c82a5c]">
                      CORE ANALYTICS DATA PIPELINE: ACTIVE
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 space-y-2">
                      {[
                        { id: 'dashboard', label: '1. Analytics Dashboard', desc: 'Central KPI metrics hub', icon: <LayoutDashboard className="h-4 w-4" /> },
                        { id: 'heatmap', label: '2. Sales Heatmap', desc: 'Hourly demand intensity', icon: <Activity className="h-4 w-4" /> },
                        { id: 'trends', label: '3. Product Trends', desc: 'Leading category metrics', icon: <TrendingUp className="h-4 w-4" /> },
                        { id: 'comparison', label: '4. Branch Comparison', desc: 'Multi-hub performance index', icon: <Building className="h-4 w-4" /> },
                        { id: 'riders', label: '5. Rider Performance', desc: 'Couriers speed & ratings', icon: <Truck className="h-4 w-4" /> },
                        { id: 'retention', label: '6. Customer Retention', desc: 'Returning cohort ratios', icon: <UserCheck className="h-4 w-4" /> },
                        { id: 'revenue-forecast', label: '7. Revenue Forecasting', desc: '30-Day prognostic models', icon: <BarChart3 className="h-4 w-4" /> },
                        { id: 'inventory-forecast', label: '8. Inventory Forecasting', desc: 'Outage mitigation reorders', icon: <Boxes className="h-4 w-4" /> },
                        { id: 'peak', label: '9. Peak Sales Time', desc: 'Daily checkout schedules', icon: <Clock className="h-4 w-4" /> },
                        { id: 'geo', label: '10. Geographic Analytics', desc: 'Neighborhood coordinate map', icon: <Map className="h-4 w-4" /> },
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setBiTab(sub.id as any)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            biTab === sub.id
                              ? 'bg-gradient-to-r from-rose-50/50 to-white border-rose-300 text-brand-navy shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <div className={`p-2 rounded-xl flex-shrink-0 ${biTab === sub.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {sub.icon}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[11px] font-black uppercase tracking-tight text-brand-navy truncate">{sub.label}</div>
                            <div className="text-[9px] text-slate-400 leading-none mt-0.5 font-bold truncate">{sub.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Central Display Area */}
                    <div className="lg:col-span-9 bg-slate-50/50 rounded-3xl p-6 border border-slate-200 text-left">
                      {/* Subtab 1: Analytics Dashboard */}
                      {biTab === 'dashboard' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <h4 className="text-lg font-black text-brand-navy uppercase">1. Centralized Revenue & Performance Board</h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase font-extrabold tracking-wider">Gross Sales Revenue</span>
                                <div className="text-xl font-black text-brand-navy font-mono mt-1">₹3,42,850.50</div>
                                <span className="text-[8px] text-emerald-600 font-extrabold block mt-1 uppercase tracking-wide">&quot;↑ 18.2% WEEK-OVER-WEEK&quot;</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                                <TrendingUp className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase font-extrabold tracking-wider">Average Gross Profit Margin</span>
                                <div className="text-xl font-black text-[#c82a5c] font-mono mt-1">24.38%</div>
                                <span className="text-[8px] text-teal-600 font-extrabold block mt-1 uppercase tracking-wide">OPTIMIZED VIA DYNAMIC PRICE</span>
                              </div>
                              <div className="p-3 bg-[#c82a5c]/10 text-[#c82a5c] rounded-xl">
                                <Percent className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase font-extrabold tracking-wider">Customer Lifetime Value (LTV)</span>
                                <div className="text-xl font-black text-brand-navy font-mono mt-1">₹11,400.00</div>
                                <span className="text-[8px] text-blue-600 font-extrabold block mt-1 uppercase tracking-wide">WEEKLY FREQUENT BUYERS COHORT</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <UserCheck className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase font-extrabold tracking-wider">Out of Stock Mitigation Ratio</span>
                                <div className="text-xl font-black text-teal-600 font-mono mt-1">98.92%</div>
                                <span className="text-[8px] text-emerald-500 font-extrabold block mt-1 uppercase tracking-wide">CENTRAL HUB AUTO-REPLENISH ENGINE</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                            <span className="text-[10px] text-slate-500 font-black uppercase block tracking-wider">Automated Daily Summary Insight</span>
                            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                              Hyperlocal delivery cycles are stable at <span className="text-[#c82a5c] font-extrabold">11.6 minutes average transit duration</span>. BKC branch has accounted for 64% of total daily deliveries. Recommendation engine suggests increasing cold brew SKU allocations at Hub 1 matching tomorrow&apos;s forecasted summer thermal indexes.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Subtab 2: Sales Heatmap */}
                      {biTab === 'heatmap' && (
                        <div className="space-y-6 animate-in fade-in duration-200 text-left">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">2. Checkout Intraday Order Heatmap</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Visualizes checkout density across days of the week and hours of the day.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
                            {/* Heatmap illustration */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                                <span>Day of Week vs Fulfillment Hour</span>
                                <span className="flex items-center gap-1">Low <span className="inline-block w-3 h-3 bg-rose-100 rounded" /> <span className="inline-block w-3 h-3 bg-rose-300 rounded" /> <span className="inline-block w-3 h-3 bg-rose-500 rounded" /> <span className="inline-block w-3 h-3 bg-[#c82a5c] rounded" /> High</span>
                              </div>

                              <div className="space-y-1">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dIdx) => (
                                  <div key={day} className="flex items-center gap-1">
                                    <span className="w-10 text-[10px] font-black text-slate-600 font-mono uppercase">{day}</span>
                                    <div className="grid grid-cols-12 flex-1 gap-1">
                                      {Array.from({ length: 12 }).map((_, hIdx) => {
                                        // Random distribution with predictable structure (evening weekend rushes are higher)
                                        const hourVal = hIdx + 8; // 8 AM to 8 PM
                                        const isWeekend = dIdx >= 5;
                                        const isPeakHour = hourVal === 10 || hourVal === 11 || hourVal === 18 || hourVal === 19;
                                        let intensity = "bg-rose-100";
                                        if (isWeekend && isPeakHour) intensity = "bg-[#c82a5c]";
                                        else if (isPeakHour) intensity = "bg-rose-500";
                                        else if (isWeekend || hourVal > 15) intensity = "bg-rose-300";

                                        return (
                                          <div 
                                            key={hIdx} 
                                            title={`${day} @ ${hourVal}:00 - Intensity index`}
                                            className={`${intensity} h-8 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-sm`}
                                            onClick={() => alert(`Heatmap Decoded: ${day} at ${hourVal}:00 reports a high score density. Dynamic courier routing queue is auto-scaled to 125% capacity.`)}
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between text-[9px] font-bold text-slate-400 font-mono mt-1 pt-1 border-t border-slate-100">
                                <span className="ml-10">08:00 AM</span>
                                <span>12:00 PM</span>
                                <span>04:00 PM</span>
                                <span>08:00 PM</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold italic">* Pro-Tip: Click on any heatmap block grid above to fetch real-world localized delivery route allocations and driver scale scores.</p>
                          </div>
                        </div>
                      )}

                      {/* Subtab 3: Product Trends */}
                      {biTab === 'trends' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">3. Category Sales & SKU trends</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Live classification representing trending baskets and volumes.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
                            <div className="grid gap-6 sm:grid-cols-3">
                              {[
                                { cat: "Agro staples & grains", trend: "+42% spike", items: "Premium Basmati Rice", val: 82, color: "bg-[#c82a5c]" },
                                { cat: "Dairy and milk lines", trend: "+28% steady", items: "Full Cream Milk", val: 64, color: "bg-teal-500" },
                                { cat: "Bakery & sourdoughs", trend: "+15% normal", items: "Artisanal Sourdough", val: 48, color: "bg-amber-500" },
                              ].map((tr, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 text-left space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-500">{tr.cat}</span>
                                    <span className="text-[8px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase">{tr.trend}</span>
                                  </div>
                                  <div>
                                    <h5 className="font-extrabold text-sm text-brand-navy leading-normal">{tr.items}</h5>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 block">Market share segment</span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-bold text-slate-600 font-mono">
                                      <span>Ratio Score</span>
                                      <span>{tr.val}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div className={`${tr.color} h-full`} style={{ width: `${tr.val}%` }} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="border border-slate-200 divide-y divide-slate-100 rounded-xl overflow-hidden text-xs">
                              <div className="bg-slate-50 p-3 flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                                <span>Category SKU classification</span>
                                <span>Aggregated checkout frequency</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span>Groceries & Pantry staples</span>
                                <span className="font-mono font-bold text-brand-navy">1,482 orders completed</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span>Fresh fruits and organic greens</span>
                                <span className="font-mono font-bold text-brand-navy">915 orders completed</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span>Beverages, teas & cold brews</span>
                                <span className="font-mono font-bold text-brand-navy">554 orders completed</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtab 4: Branch Comparison */}
                      {biTab === 'comparison' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">4. Regional Fulfillment Branch Comparison</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Relative performance of active hyperlocal hubs matching daily orders.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                    <th className="p-3">Branch Location Hub</th>
                                    <th className="p-3">Daily Sales (₹)</th>
                                    <th className="p-3">Completed Cycles</th>
                                    <th className="p-3">On-Time delivery rate</th>
                                    <th className="p-3 text-right">Riders Pool</th>
                                    <th className="p-3 text-center">Fulfillment Index</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                  {[
                                    { name: "Downtown Mumbai Hub (BKC)", sales: 154800, orders: 480, ontime: "98.8%", riders: 12, rating: "A+ Optimum" },
                                    { name: "Westside Suburb Center", sales: 112000, orders: 322, ontime: "97.4%", riders: 8, rating: "A Robust" },
                                    { name: "Navi Mumbai Gateway Hub", sales: 76050, orders: 198, ontime: "94.2%", riders: 5, rating: "B+ Stable" },
                                  ].map((bh, bIdx) => (
                                    <tr key={bIdx} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => alert(`Branch Audited: ${bh.name}. Current cash reserves validated with safe log limits.`)}>
                                      <td className="p-3 font-extrabold text-brand-navy">{bh.name}</td>
                                      <td className="p-3 font-mono">₹{bh.sales.toLocaleString()}</td>
                                      <td className="p-3 font-mono">{bh.orders}</td>
                                      <td className="p-3 text-emerald-600 font-extrabold">{bh.ontime}</td>
                                      <td className="p-3 text-right font-mono">{bh.riders} riders</td>
                                      <td className="p-3 text-center">
                                        <span className="bg-[#c82a5c]/15 text-[#c82a5c] text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded">
                                          {bh.rating}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold">* Click on any branch row above to verify physical cash reconciliation logs and active vehicle parameters.</p>
                          </div>
                        </div>
                      )}

                      {/* Subtab 5: Rider Performance */}
                      {biTab === 'riders' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">5. Local Rider Fleet Dispatch Logs</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Monitors speed, daily mileage, fuel allowance settlements and aggregate ratings.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3 text-left">
                              {[
                                { name: "Amit Patel", kms: 54, fuel: 243, orders: 18, delay: "10.4 mins", rat: "4.96 ★" },
                                { name: "Rajesh Nair", kms: 42, fuel: 189, orders: 14, delay: "11.1 mins", rat: "4.89 ★" },
                                { name: "Suresh Kolhe", kms: 36, fuel: 162, orders: 11, delay: "12.8 mins", rat: "4.75 ★" },
                              ].map((ride, rIdx) => (
                                <div key={rIdx} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm space-y-3">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <h5 className="font-extrabold text-brand-navy text-sm">{ride.name}</h5>
                                    <span className="text-[10px] font-black text-[#c82a5c] font-mono">{ride.rat}</span>
                                  </div>
                                  <div className="text-[10px] space-y-1 font-semibold text-slate-500 font-mono">
                                    <p className="flex justify-between"><span>Agg KMs Driven:</span> <span className="text-slate-850 font-extrabold">{ride.kms} KMs</span></p>
                                    <p className="flex justify-between"><span>Dispatched orders:</span> <span className="text-slate-850 font-extrabold">{ride.orders} boxes</span></p>
                                    <p className="flex justify-between"><span>Fuel Allowance:</span> <span className="text-emerald-600 font-black">₹{ride.fuel}</span></p>
                                    <p className="flex justify-between"><span>Avg Delivery Time:</span> <span className="text-blue-600 font-extrabold">{ride.delay}</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtab 6: Customer Retention */}
                      {biTab === 'retention' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">6. Customer Loyalty & Retention Cohort Curves</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Displays repeat purchase rate curves matching different onboarding cohorts.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="border border-slate-200 divide-y divide-slate-100 rounded-xl overflow-hidden text-xs">
                              <div className="bg-slate-50 p-3 grid grid-cols-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                                <span>Customer Onboarding Cohort</span>
                                <span>Week 1 Repeat rate</span>
                                <span>Week 2 Repeat rate</span>
                                <span>Week 3 Repeat rate</span>
                              </div>
                              {[
                                { group: "April Onboarding Group", w1: "92.4%", w2: "84.1%", w3: "75.8%" },
                                { group: "May Onboarding Group", w1: "88.2%", w2: "79.5%", w3: "71.0%" },
                                { group: "June Onboarding Group", w1: "91.0%", w2: "81.4%", w3: "73.2%" }
                              ].map((cohort, idx) => (
                                <div key={idx} className="p-3 grid grid-cols-4 font-semibold text-slate-700">
                                  <span className="text-brand-navy font-extrabold">{cohort.group}</span>
                                  <span className="font-mono text-emerald-600 font-bold">{cohort.w1}</span>
                                  <span className="font-mono text-slate-600 font-semibold">{cohort.w2}</span>
                                  <span className="font-mono text-slate-500 font-semibold">{cohort.w3}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtab 7: Revenue Forecasting */}
                      {biTab === 'revenue-forecast' && (
                        <div className="space-y-6 animate-in fade-in duration-200 text-left">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">7. Predictive Revenue Forecasting Models (30 Days)</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Uses dynamic regression parameters to map expected daily intake levels.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                            {/* SVG generated graph */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block font-bold">Futuristic Revenue Intake Path (30 Days Prognostic overlay)</span>
                              <div className="h-44 bg-slate-900 rounded-xl relative overflow-hidden flex items-end p-2 border border-slate-800">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150">
                                  {/* Confidence boundary band */}
                                  <path d="M 0 110 Q 100 80 200 90 T 400 50 L 400 130 L 200 140 L 0 140 Z" fill="rgba(200, 42, 92, 0.15)" stroke="none" />
                                  {/* Mean trajectory path */}
                                  <path d="M 0 110 Q 100 80 200 90 T 400 50" fill="none" stroke="#c82a5c" strokeWidth="3" />
                                  {/* Reference dots */}
                                  <circle cx="200" cy="90" r="4" fill="#c82a5c" />
                                  <circle cx="400" cy="50" r="4" fill="#c82a5c" />
                                </svg>
                                <div className="absolute top-4 right-4 bg-slate-850 text-rose-400 border border-slate-800 px-3 py-1 rounded font-mono text-[9px] font-black uppercase">
                                  Conf Bound: 95% certainty
                                </div>
                                <div className="absolute top-4 left-4 text-white text-[9px] font-bold uppercase bg-brand-navy border border-slate-700 px-2 py-0.5 rounded leading-none">
                                  Prognosis line
                                </div>
                                <div className="absolute bottom-2 inset-x-4 flex justify-between text-[8px] font-mono text-slate-400 font-bold">
                                  <span>Week 1</span>
                                  <span>Week 2</span>
                                  <span>Week 3</span>
                                  <span>Week 4 (Prediction Zone)</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                              Prognostic forecast indicates growth targeting <span className="text-[#c82a5c] font-black">₹4.2 Lakhs aggregate weekly revenue</span>. Slider parameters match regional festival activities & monsoon rainfall metrics.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Subtab 8: Inventory Forecasting */}
                      {biTab === 'inventory-forecast' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">8. Outage Alerts & Reorder Inventory Forecasts</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Translates daily consumption trends into safety timelines to trigger automatic Purchase Orders.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              {[
                                { name: "Fresh Royal Gala Apples", code: "p3", margin: "3 Days stock left", prog: 30, alertLevel: "text-amber-600 bg-amber-50" },
                                { name: "Artisanal Sourdough Bread", code: "p6", margin: "1 Day stock left", prog: 10, alertLevel: "text-rose-600 bg-rose-50 border border-rose-100" }
                              ].map((al, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-left space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-[9px] font-mono text-slate-400 font-black block uppercase">{al.code}</span>
                                      <h5 className="font-extrabold text-brand-navy text-sm mt-0.5 leading-tight">{al.name}</h5>
                                    </div>
                                    <span className={`${al.alertLevel} text-[9px] font-black uppercase px-2 py-1 rounded`}>
                                      {al.margin}
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden block">
                                      <div className="bg-[#c82a5c] h-full transition-all" style={{ width: `${al.prog}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                                      <span>Outage threshold reached</span>
                                      <button onClick={() => alert("Purchase Order auto-placed with Supplier bombay Agro Foods.")} className="text-[#c82a5c] font-black uppercase hover:underline">
                                        + Place auto PO
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtab 9: Peak Sales Time */}
                      {biTab === 'peak' && (
                        <div className="space-y-6 animate-in fade-in duration-200 text-left">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">9. Hourly Orders peak distribution</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Hourly checkout volumes logged across central transactional databases.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="space-y-2">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block font-bold">24-Hour checkout frequencies</span>
                              <div className="flex justify-between items-end gap-1.5 h-32 pt-4 bg-slate-50 rounded-xl px-4 border border-slate-100">
                                {[12, 18, 10, 48, 88, 92, 54, 42, 60, 98, 104, 82, 38, 22, 10, 12, 15, 30].map((fq, fidx) => (
                                  <div key={fidx} className="flex-1 flex flex-col items-center">
                                    <div className="bg-brand-navy w-full rounded-t hover:bg-[#c82a5c] transition-colors cursor-pointer" style={{ height: `${fq}%` }} title={`${fq} checkouts avg`} />
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between text-[8px] font-mono text-slate-400 uppercase font-black pt-1 px-1">
                                <span>08:00 AM Breakfast</span>
                                <span>12:00 PM Afternoon</span>
                                <span>07:00 PM Dinner Rush</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Subtab 10: Geographic Sales Analysis */}
                      {biTab === 'geo' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">10. Geographic Neighborhood Sale Hotspots</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Fulfillment distribution mapped across central neighborhood clusters.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="h-48 bg-[#e2e8f0] border border-slate-350 rounded-xl relative overflow-hidden flex items-center justify-center">
                              {/* District Bubble Overlay points resembling local map layout */}
                              <div className="absolute top-10 left-12 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => alert('Bandra Kurla Complex: 480 orders. Peak demand category grains.')}>
                                <span className="h-9 w-9 opacity-80 rounded-full bg-[#c82a5c] border border-white flex items-center justify-center text-[10px] font-black text-white shadow">480</span>
                                <span className="text-[7px] font-black tracking-tight mt-1 bg-white shadow-sm px-1.5 py-0.5 rounded uppercase font-bold">BKC Block G</span>
                              </div>

                              <div className="absolute top-24 left-44 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => alert('Westside Suburbs: 322 orders. Peak demand fruits & bakery.')}>
                                <span className="h-7 w-7 opacity-80 rounded-full bg-sky-500 border border-white flex items-center justify-center text-[9px] font-black text-white shadow">322</span>
                                <span className="text-[7px] font-black tracking-tight mt-1 bg-white shadow-sm px-1.5 py-0.5 rounded uppercase font-bold">Bandra West</span>
                              </div>

                              <div className="absolute top-12 right-16 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" onClick={() => alert('Powai Lakeside Segment: 198 orders. Peak focus beverage stock.')}>
                                <span className="h-6 w-6 opacity-80 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-black text-white shadow">198</span>
                                <span className="text-[7px] font-black tracking-tight mt-1 bg-white shadow-sm px-1.5 py-0.5 rounded uppercase font-bold">Powai East</span>
                              </div>

                              <span className="text-[9px] font-mono text-slate-400 border border-slate-300 absolute bottom-3 right-3 bg-white/85 px-2.5 py-1 rounded shadow-sm font-bold uppercase">District bubble magnitude map</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold italic">* Pro-Tip: Hover and click on any neighborhood bubble above to decode real-time distribution aggregates.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: AI & SMART FEATURES HUB */}
            {adminTab === 'smart' && (
              <div className="space-y-8 animate-in fade-in duration-200 text-left">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight">AI & Smart Features Modules</h3>
                      <p className="text-xs text-purple-600 font-extrabold uppercase tracking-widest mt-1">
                        9-Core Generative and Machine Learning Operational Modules
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 px-3.5 py-1.5 rounded-xl font-mono text-[10px] font-black text-purple-700 animate-pulse">
                      MART.AI NEURAL ENGINE LAYER: ONLINE
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 space-y-2">
                      {[
                        { id: 'recs', label: '1. AI Recommendation', desc: 'Personalized basket recommendation', icon: <Sparkles className="h-4 w-4" /> },
                        { id: 'search', label: '2. Smart Semantic Search', desc: 'Context search simulation', icon: <Search className="h-4 w-4" /> },
                        { id: 'tagging', label: '3. Auto Tagging NLP', desc: 'Optical visual categorizations', icon: <Barcode className="h-4 w-4" /> },
                        { id: 'demand', label: '4. Demand Predictor', desc: 'Weather & festival events index', icon: <Activity className="h-4 w-4" /> },
                        { id: 'pricing', label: '5. Dynamic Pricing', desc: 'Algorithmic ±15% optimization', icon: <Percent className="h-4 w-4" /> },
                        { id: 'delivery', label: '6. Delivery ETA AI', desc: 'Predictive delivery time logs', icon: <Clock className="h-4 w-4" /> },
                        { id: 'fraud', label: '7. Fraud Detection Shield', desc: 'Checks threat scores & IPs', icon: <AlertTriangle className="h-4 w-4" /> },
                        { id: 'cart-recovery', label: '8. Automated Cart Recovery', desc: 'Smart recovering text reminders', icon: <MessageSquare className="h-4 w-4" /> },
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setAiTab(sub.id as any)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            aiTab === sub.id
                              ? 'bg-gradient-to-r from-purple-50/50 to-white border-purple-300 text-brand-navy shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <div className={`p-2 rounded-xl flex-shrink-0 ${aiTab === sub.id ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                            {sub.icon}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-[11px] font-black uppercase tracking-tight text-brand-navy truncate">{sub.label}</div>
                            <div className="text-[9px] text-slate-400 leading-none mt-0.5 font-bold truncate">{sub.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Central Display Area */}
                    <div className="lg:col-span-9 bg-slate-50/50 rounded-3xl p-6 border border-slate-200 text-left">
                      {/* Recommendations */}
                      {aiTab === 'recs' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">1. AI-Driven Cross-Sell Recommendation Matrix</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Examines user checkout patterns to map corresponding recommended items.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="flex justify-between items-center bg-purple-50/80 p-3 rounded-xl border border-purple-100">
                              <span className="text-xs font-black text-purple-950">Active Cart Trigger SKU: <span className="font-mono text-[#c82a5c]">p1 Premium Basmati Rice</span></span>
                              <span className="text-[9px] font-mono bg-purple-700 text-white font-extrabold px-3 py-1 rounded">Pattern Index Matches</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm flex items-center gap-3">
                                <img src="https://images.unsplash.com/photo-1550583724-1255818c0533?w=100&q=80" className="w-12 h-12 object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                                <div>
                                  <h5 className="font-extrabold text-sm text-brand-navy">Recommended: Full Cream Milk</h5>
                                  <span className="text-[9px] font-black text-purple-600 block uppercase">Cross-Sell Accuracy: 98.41% Confidence</span>
                                </div>
                              </div>

                              <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm flex items-center gap-3">
                                <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=100&q=80" className="w-12 h-12 object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                                <div>
                                  <h5 className="font-extrabold text-sm text-brand-navy">Recommended: Hass Avocado</h5>
                                  <span className="text-[9px] font-black text-purple-600 block uppercase">Cross-Sell Accuracy: 84.50% Confidence</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Smart Semantic Search */}
                      {aiTab === 'search' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">2. AI-Powered Smart Semantic Search Simulation</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Type natural text queries to simulate contextual tag mappings.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="flex gap-2">
                              <input 
                                className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-mono font-bold text-slate-800 focus:outline-purple-500"
                                type="text"
                                placeholder="Type context (e.g., 'refreshing morning', 'organic keto breakfast bowl')"
                                value={aiSearchQuery}
                                onChange={(e) => setAiSearchQuery(e.target.value)}
                              />
                              <button 
                                onClick={() => {
                                  if (!aiSearchQuery) return alert("Please type a semantic search query!");
                                  alert(`Semantic Query Analysed:\n"${aiSearchQuery}" maps closest to Category Fresh Produce & Beverages.\nResults Decoded:\n1. Apple Gala (Accuracy: 95.8%)\n2. Hass Avocado (Accuracy: 89.2%)\n3. Cold Brew Coffee (Accuracy: 81%)\nReasoning: Matches keto breakfast patterns closely.`);
                                }}
                                className="bg-purple-600 hover:bg-purple-750 text-white text-[10px] font-black uppercase px-6 py-3.5 rounded-xl cursor-pointer"
                              >
                                Test Neural Match
                              </button>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-[10px] font-semibold text-slate-500 font-mono">
                              &gt; Standing by: Type context keywords and press Neural Match to execute simulated Vector Embeddings check against Core SKU store.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Auto Product Tagging */}
                      {aiTab === 'tagging' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">3. Real-time Multi-modal Product Tagging Catalog</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Automatic classification and taxonomy generation from SKU listings.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                            <div className="border border-slate-200 table-fixed divide-y divide-slate-100 rounded-xl overflow-hidden text-xs">
                              <div className="bg-slate-50 p-3 grid grid-cols-12 text-[9px] font-black text-slate-400 uppercase">
                                <span className="col-span-4">Product Name SKU</span>
                                <span className="col-span-4 text-center">Class Label Mapped</span>
                                <span className="col-span-4 text-right">Confidence Tags</span>
                              </div>
                              <div className="p-3 grid grid-cols-12 font-semibold text-slate-700">
                                <span className="col-span-4 text-brand-navy font-bold">Premium Basmati Rice</span>
                                <span className="col-span-4 text-center bg-purple-50 text-purple-700 rounded py-0.5 px-2 text-[10px] uppercase font-bold w-fit mx-auto">grains_raw</span>
                                <span className="col-span-4 text-right text-emerald-600 font-bold">99.82% (#aromatic, #staple, #raw)</span>
                              </div>
                              <div className="p-3 grid grid-cols-12 font-semibold text-slate-700">
                                <span className="col-span-4 text-brand-navy font-bold">Organic Hass Avocado</span>
                                <span className="col-span-4 text-center bg-purple-50 text-purple-700 rounded py-0.5 px-2 text-[10px] uppercase font-bold w-fit mx-auto">fresh_exotic</span>
                                <span className="col-span-4 text-right text-emerald-600 font-bold">97.41% (#keto, #healthy, #vegan)</span>
                              </div>
                              <div className="p-3 grid grid-cols-12 font-semibold text-slate-700">
                                <span className="col-span-4 text-brand-navy font-bold">Cold Brew Coffee</span>
                                <span className="col-span-4 text-center bg-purple-50 text-purple-700 rounded py-0.5 px-2 text-[10px] uppercase font-bold w-fit mx-auto">beverage_caffeinated</span>
                                <span className="col-span-4 text-right text-emerald-600 font-bold">94.10% (#energy, #ready-drink, #cold)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Demand Prediction */}
                      {aiTab === 'demand' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">4. Weather &amp; Festival Event Demand Prediction Matrix</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Forecasts order volume multipliers matching localized external parameters.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                                <span className="text-[9px] text-slate-400 font-black uppercase">Fulfillment Event Mod</span>
                                <div className="flex gap-1">
                                  {['Diwali Festival', 'IPL Cricket Match Match', 'Regular Weekday'].map(ev => (
                                    <button 
                                      key={ev} 
                                      onClick={() => alert(`Fulfillment Modifier Changed: ${ev}. Groceries & staples demand scaled up by 1.6x.`)}
                                      className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                                    >
                                      {ev}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                                <span className="text-[9px] text-slate-400 font-black uppercase">Summer Precipitation modifier</span>
                                <div className="flex gap-1">
                                  {['Clean Skies', 'Heavy Monsoon Rain', 'Extreme Heatwave'].map(wc => (
                                    <button 
                                      key={wc} 
                                      onClick={() => alert(`Precipitation Modifier Changed: ${wc}. Instant courier buffer increased due to safety routing rules.`)}
                                      className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[9px] font-black uppercase cursor-pointer"
                                    >
                                      {wc}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Pricing */}
                      {aiTab === 'pricing' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div>
                              <h4 className="text-lg font-black text-brand-navy uppercase">5. Real-Time Dynamic Pricing Engine</h4>
                              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Calculates optimal margins by adjusting base values based on warehouse reserves.</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase font-bold text-right leading-none">Dynamic Engine<br/><span className="text-[#c82a5c] text-[8px]">Active</span></span>
                              <input 
                                type="checkbox"
                                checked={dynamicPricingActive}
                                onChange={(e) => {
                                  setDynamicPricingActive(e.target.checked);
                                  alert(`Dynamic Pricing Engine: ${e.target.checked ? "Activated" : "Deactivated"}. Item values reset.`);
                                }}
                                className="h-5 w-5 bg-[#c82a5c] text-white rounded cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                            <div className="border border-slate-200 divide-y divide-slate-100 rounded-xl overflow-hidden text-xs">
                              <div className="bg-slate-50 p-3 flex justify-between text-[9px] font-black text-slate-400 uppercase">
                                <span>Catalog Product Description</span>
                                <span>Base Price</span>
                                <span>Optimized Value</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span>Premium Basmati Rice</span>
                                <span className="font-mono text-slate-400 line-through">₹1,250</span>
                                <span className="font-mono text-[#c82a5c] font-black">₹{dynamicPricingActive ? '1,190 (Algorithmic Discount)' : '1,250'}</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span>Cold Brew Coffee</span>
                                <span className="font-mono text-slate-400 line-through">₹400</span>
                                <span className="font-mono text-emerald-600 font-black">₹{dynamicPricingActive ? '435 (Heavy demand buffer)' : '400'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Delivery Time Prediction */}
                      {aiTab === 'delivery' && (
                        <div className="space-y-6 animate-in fade-in duration-200 text-left">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">6. Predictive Hyperlocal Delivery Time Predictor</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Interactive calculator mapping distance metrics against rain indexes.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                              <button onClick={() => alert("ETA Prediction: 1.2 KM route matches avg 7.2 minutes.")} className="border border-slate-200 p-4 rounded-xl text-left bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                                <span className="text-[9px] text-slate-400 font-mono block">1.2 KM (Downtown)</span>
                                <h5 className="font-extrabold text-brand-navy text-sm mt-1">7.2 Mins ETA</h5>
                              </button>
                              <button onClick={() => alert("ETA Prediction: 4.5 KM route matches avg 15.6 minutes under busy traffic.")} className="border border-slate-200 p-4 rounded-xl text-left bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                                <span className="text-[9px] text-slate-400 font-mono block">4.5 KM (Mid Suburb)</span>
                                <h5 className="font-extrabold text-brand-navy text-sm mt-1">15.6 Mins ETA</h5>
                              </button>
                              <button onClick={() => alert("ETA Prediction: 8.4 KM route matches avg 29.8 minutes under rain rules.")} className="border border-slate-200 p-4 rounded-xl text-left bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer">
                                <span className="text-[9px] text-slate-400 font-mono block">8.4 KM (Peripheral Gate)</span>
                                <h5 className="font-extrabold text-brand-navy text-sm mt-1">29.8 Mins ETA</h5>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fraud Detection */}
                      {aiTab === 'fraud' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">7. Anti-Fraud Threat Screening Shield</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Live AI protection score analyzing transaction logs for suspicious behavior.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                            <div className="border border-slate-200 divide-y divide-slate-100 rounded-xl overflow-hidden text-xs">
                              <div className="bg-slate-50 p-3 flex justify-between text-[11px] font-black text-slate-400 uppercase font-bold">
                                <span>Ref Order</span>
                                <span>Flagged Anomalous Cause</span>
                                <span>Anti-Fraud risk index</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span className="text-[#c82a5c] font-black">ord-92311</span>
                                <span className="text-slate-505 font-medium">Multiple high-speed card auth attempts</span>
                                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-black">94.12% High Risk (BLOCKED)</span>
                              </div>
                              <div className="p-3 flex justify-between font-semibold text-slate-700">
                                <span className="text-[#c82a5c] font-black">ord-14502</span>
                                <span className="text-slate-505 font-medium">Coordinate proxy IP mismatch</span>
                                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-black">34.12% Low Risk (Cleared)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cart Recovery */}
                      {aiTab === 'cart-recovery' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                          <div>
                            <h4 className="text-lg font-black text-brand-navy uppercase">8. AI-Triggered Abandoned Cart Recovery REMINDER</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Dispatches coupon alerts matching left-behind checkout logs.</p>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                            <div className="flex gap-4 items-center">
                              <div className="flex-1">
                                <span className="text-[10px] text-slate-400 uppercase font-black block">Recovery Coupon Discount Rate</span>
                                <select 
                                  value={cartRecoveryDiscount}
                                  onChange={(e) => {
                                    setCartRecoveryDiscount(e.target.value);
                                    alert(`AI coupon modifier adjusted successfully to ${e.target.value}!`);
                                  }}
                                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800"
                                >
                                  <option value="10%">10% Discount Coupon (Standard)</option>
                                  <option value="15%">15% Discount Coupon (High Recovery rate)</option>
                                  <option value="20%">20% Discount Coupon (Ultra Conversion mode)</option>
                                </select>
                              </div>

                              <button 
                                onClick={() => {
                                  alert(`Recover reminder SMS and WhatsApp payload generated:\n"Namaste Karan! We saved your items. Grab them within 30 minutes and claim a special ${cartRecoveryDiscount} code block discount! Link: mart-os.co/r/932"`);
                                }}
                                className="bg-purple-600 hover:bg-purple-750 text-white text-[11px] font-black uppercase py-4 px-6 rounded-xl cursor-pointer self-end shadow-sm"
                              >
                                Trigger recovery dispatch
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: UNIFIED MOBILE APPLICATIONS SIMULATOR SUITE */}
            {adminTab === 'mobile_apps' && (
              <div className="space-y-8 animate-in fade-in duration-200 text-left">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                  {/* Selector headers */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tight">MART.OS Unified Mobile App Suite</h3>
                      <p className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest mt-1">
                        5 Interactive Apps for Customer, Rider, Hub Manager, Vendor and Scanner
                      </p>
                    </div>
                    {/* Operating platform toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-1.50">
                      <button 
                        onClick={() => setMobilePlatform('android')}
                        className={`text-[9px] font-black uppercase px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${mobilePlatform === 'android' ? 'bg-[#c82a5c] text-white shadow' : 'text-slate-500 hover:text-slate-850'}`}
                      >
                        Android OS
                      </button>
                      <button 
                        onClick={() => setMobilePlatform('ios')}
                        className={`text-[9px] font-black uppercase px-3.5 py-1.5 rounded-xl cursor-pointer transition-all ${mobilePlatform === 'ios' ? 'bg-[#c82a5c] text-white shadow' : 'text-slate-500 hover:text-slate-850'}`}
                      >
                        iOS iPhone
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                    {/* Left Column: App Select panel */}
                    <div className="lg:col-span-4 space-y-3">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black mb-1">Pick App Profile Simulator</span>
                      {[
                        { id: 'customer', name: '1. Customer App (Android/iOS)', desc: 'Consumer checkout, track courier', icon: <User className="h-4 w-4" /> },
                        { id: 'delivery-boy', name: '2. Delivery Boy App (Android)', desc: 'Rider log route verification', icon: <Truck className="h-4 w-4" /> },
                        { id: 'manager', name: '3. Branch Manager App (Android/iOS)', desc: 'Fulfillment control & reorders', icon: <Building className="h-4 w-4" /> },
                        { id: 'vendor', name: '4. Vendor Hub App (Android/iOS)', desc: 'Merchant purchase accept logs', icon: <UserCheck className="h-4 w-4" /> },
                        { id: 'pda', name: '5. Warehouse Scanner App (PDA Devices)', desc: 'Rugged laser gun scan & shelf reorder', icon: <ScanLine className="h-4 w-4 text-[#c82a5c] font-black animate-pulse" /> },
                      ].map(app => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedMobileApp(app.id as any)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                            selectedMobileApp === app.id
                              ? 'bg-rose-50/20 border-rose-400 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50 hover:border-slate-300'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl ${selectedMobileApp === app.id ? 'bg-[#c82a5c] text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {app.icon}
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-brand-navy uppercase tracking-tight">{app.name}</h5>
                            <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">{app.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Right Column: Physical Device frame wrapper */}
                    <div className="lg:col-span-8 flex justify-center py-4 bg-slate-50 border border-slate-200 rounded-3xl">
                      <div className="w-full max-w-sm rounded-[3.2rem] border-[12px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden relative" style={{ height: '620px' }}>
                        
                        {/* Device Notch Speaker */}
                        {mobilePlatform === 'ios' ? (
                          /* iOS dynamic island */
                          <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 flex justify-center items-center z-25">
                            <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-900 mr-2" />
                            </div>
                          </div>
                        ) : (
                          /* Android dot camera */
                          <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 flex justify-center items-center z-25">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mt-1" />
                          </div>
                        )}

                        <div className="h-full bg-slate-100 pt-5 flex flex-col justify-between overflow-y-auto scrollbar-none relative text-left">
                          
                          {/* SIMULATED SUB-APP RENDER 1: CUSTOMER APP */}
                          {selectedMobileApp === 'customer' && (
                            <div className="flex-1 flex flex-col justify-between bg-teal-50/30">
                              {/* Header */}
                              <div className="bg-brand-navy p-4 text-white flex justify-between items-center shadow-sm">
                                <div>
                                  <span className="text-[8px] font-mono tracking-widest text-emerald-400 font-black">MART.OS CUSTOMER APP</span>
                                  <h6 className="font-extrabold text-xs text-white">Hi, Rajesh Kumar 👋</h6>
                                </div>
                                <span className="bg-emerald-600/20 text-emerald-400 text-[8px] font-black border border-emerald-500/30 px-2 py-1 rounded">360 Points</span>
                              </div>

                              {/* Search */}
                              <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-10">
                                <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                                  <span className="text-xs text-slate-400 font-medium">Search items, brand index...</span>
                                  <Search className="h-4 w-4 text-slate-400" />
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-left shadow-xs">
                                  <span className="text-[10px] text-[#c82a5c] font-black uppercase">Live Shipment Tracked</span>
                                  <h6 className="text-xs font-black text-brand-navy">Order ID: ord-88321</h6>
                                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">Status: Courier Amit Patel has loaded staples. ETA 4.2 minutes.</p>
                                  
                                  <div className="h-20 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200">
                                    <div className="absolute inset-x-12 top-10 h-0.5 bg-slate-300" />
                                    <div className="absolute left-16 top-8 flex flex-col items-center">
                                      <span className="h-3.5 w-3.5 rounded-full bg-brand-navy border border-white" />
                                      <span className="text-[6px] font-black uppercase mt-1">BKC Hub</span>
                                    </div>
                                    <div className="absolute right-16 top-8 flex flex-col items-center">
                                      <span className="h-3.5 w-3.5 rounded-full bg-[#c82a5c] border border-white animate-bounce" />
                                      <span className="text-[6px] font-black uppercase mt-1 text-[#c82a5c]">My Flat</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SIMULATED SUB-APP RENDER 2: RIDER & DELIVERY BOY APP */}
                          {selectedMobileApp === 'delivery-boy' && (
                            <div className="flex flex-col justify-between h-full bg-slate-100">
                              {/* Top Profile */}
                              <div className="bg-brand-navy text-white p-4 flex justify-between items-center shadow-sm">
                                <div>
                                  <span className="text-[8px] font-black tracking-widest text-[#c82a5c] uppercase">ACTIVE RIDER</span>
                                  <h5 className="font-black text-xs text-emerald-400">Amit Patel</h5>
                                </div>
                                <span className="bg-rose-900/40 border border-thin border-rose-950 text-rose-300 text-[8px] font-semibold px-2 py-0.5 rounded capitalize">Attendance clocked in</span>
                              </div>

                              {/* Operations info */}
                              <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-10">
                                <div className="bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center text-left">
                                  <div>
                                    <span className="text-[9px] text-slate-400 font-black uppercase block">Total Outstanding COD Cash</span>
                                    <h6 className="text-xl font-black font-mono mt-1 text-slate-800">₹{riderAuth.cashCollected || '₹1,610'}</h6>
                                  </div>
                                  <button onClick={() => alert("Reconciliation dispatched to Central Treasury Vault successfully.")} className="bg-brand-navy text-white text-[8px] font-black uppercase tracking-tight py-2 px-3.5 rounded-lg">Settle</button>
                                </div>

                                <div className="bg-white border border-[#c82a5c] p-4 rounded-2xl text-left shadow-sm space-y-2">
                                  <span className="text-[9px] font-black bg-rose-50 border border-rose-100 text-[#c82a5c] py-0.5 px-2 rounded uppercase font-bold">Priority Job Assigned</span>
                                  <h6 className="text-xs font-extrabold text-brand-navy text-sm leading-tight mt-1">Deliver food grains box to Rajesh Kumar</h6>
                                  <div className="flex gap-2 justify-between">
                                    <button onClick={() => alert("Simulated: Client verified! Triggering automatic payment settlement.")} className="w-full bg-[#c82a5c] text-white text-[9px] font-black py-2 rounded-lg cursor-pointer">
                                      OTP Settle (8812)
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SIMULATED SUB-APP RENDER 3: MANAGER APP */}
                          {selectedMobileApp === 'manager' && (
                            <div className="flex flex-col justify-between h-full bg-slate-100">
                              <div className="bg-brand-navy text-white p-4 text-left">
                                <span className="text-[8px] color-[#ffff00] font-black tracking-widest uppercase">BRANCH OPERATIONAL PANEL</span>
                                <h6 className="text-xs font-black">Manager: Sunil Chhetri</h6>
                              </div>

                              <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-10 text-left">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                                    <span className="text-[8px] uppercase text-slate-400 font-black">Shift Staff Attendance</span>
                                    <h5 className="font-black text-brand-navy mt-0.5">14 Active</h5>
                                  </div>
                                  <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
                                    <span className="text-[8px] uppercase text-slate-400 font-black">Ready For Dispatch</span>
                                    <h5 className="font-black text-rose-600 mt-0.5">8 Orders</h5>
                                  </div>
                                </div>

                                <div className="bg-white border border-slate-200 p-4 rounded-xl text-left space-y-3 shadow-xs">
                                  <span className="text-[9px] font-black text-purple-600 uppercase">Automated Stock Alert</span>
                                  <h6 className="text-xs font-bold text-slate-800">Sourdough inventories are deficient. Reordering threshold breached.</h6>
                                  <button onClick={() => alert("Reorder PO of 30 boxes initiated to Supplier Bakers Pride.")} className="w-full bg-brand-navy text-white text-[9px] font-black py-2 rounded-lg cursor-pointer">
                                    Approve Automated Reorder PO
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SIMULATED SUB-APP RENDER 4: VENDOR MANAGER APP */}
                          {selectedMobileApp === 'vendor' && (
                            <div className="flex flex-col justify-between h-full bg-slate-100">
                              <div className="bg-[#c82a5c] text-white p-4 text-left flex justify-between items-center shadow-xs">
                                <div>
                                  <span className="text-[8px] text-[#ffff00] font-black tracking-widest uppercase">AGRICULTURAL VENDOR APPLIANCE</span>
                                  <h6 className="text-xs font-black">Supplier: Bombay Agro Ltd</h6>
                                </div>
                              </div>

                              <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-10">
                                <div className="bg-white border border-slate-200 p-4 rounded-xl text-left space-y-3">
                                  <span className="text-[9px] text-teal-605 font-mono font-black uppercase block">Active PO Demands</span>
                                  <div>
                                    <h6 className="text-xs font-extrabold text-brand-navy">Require 40 basmati bags for BKC</h6>
                                    <span className="text-[9px] text-slate-405 font-bold uppercase mt-0.5 block">Requested amount: ₹50,000</span>
                                  </div>
                                  <button onClick={() => alert("PO request received, and transit delivery vehicle authorized cleanly.")} className="w-full bg-[#c82a5c] text-white text-[9px] font-black py-2 rounded-lg cursor-pointer uppercase">
                                    Accept PO & Deliver Staples
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SIMULATED SUB-APP RENDER 5: WAREHOUSE SCANNER APP WITH RED LASER OPTICS */}
                          {selectedMobileApp === 'pda' && (
                            <div className="flex flex-col justify-between h-full bg-slate-800 relative select-none">
                              
                              {/* RUGGED INDUSTRIAL BODY DESIGN ACCENTS */}
                              <div className="absolute -top-1 -inset-x-0 h-4 bg-yellow-500 z-30" />

                              <div className="bg-yellow-500 text-slate-900 px-4 py-3 text-left font-black tracking-wider shadow-sm flex justify-between items-center">
                                <div>
                                  <span className="text-[8px] font-black">MART.OS INDUSTRIAL APPLIANCE</span>
                                  <h6 className="text-sm font-black font-semibold">PDA SCANNER TERMINAL S-12</h6>
                                </div>
                                <span className="bg-slate-900 text-yellow-500 rounded font-mono text-[9px] font-black px-2 py-0.5 border border-slate-900">Row A3</span>
                              </div>

                              {/* Main Terminal Viewport */}
                              <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-10 text-left bg-slate-900 relative">
                                
                                {/* Scanning Laser Beam overlay animation */}
                                {pdaLaserOn && (
                                  <div className="absolute inset-x-0 top-1/2 h-1 bg-red-650 opacity-95 animate-pulse shadow-[0_0_12px_#ef4444] z-10" />
                                )}

                                <div className="border border-slate-700 bg-slate-850/50 p-4 rounded-2xl space-y-2 relative">
                                  <span className="text-[9px] text-yellow-500 font-mono font-black uppercase">Fulfillment Laser Scan Gun Controller</span>
                                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">Place a product code (p1 to p10) above and fire trigger, simulating an active barcode laser scan across physical grocery packages.</p>
                                  
                                  <div className="space-y-2">
                                    <input 
                                      type="text"
                                      placeholder="SKU Code Entry (e.g., p1, p5)"
                                      value={pdaScannedBarcode}
                                      onChange={(e) => setPdaScannedBarcode(e.target.value)}
                                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono font-bold text-yellow-400 focus:outline-[#ffff00]"
                                    />
                                    
                                    <button 
                                      onClick={() => {
                                        setPdaLaserOn(true);
                                        setTimeout(() => {
                                          setPdaLaserOn(false);
                                          const entry = pdaScannedBarcode.trim().toLowerCase();
                                          if (entry === 'p1' || entry === 'p5' || entry === 'p3') {
                                            const item = products.find(p => p.id === entry) || PRODUCTS[0];
                                            alert(`SKU BARCODE DECODED:\nProduct: ${item.name}\nWarehouse Shelf: Zone A1 - Row 4\nSafety limit index: Adequate (Stock counts match)`);
                                          } else {
                                            alert("Invalid SKU barcode index. Available products scan barcodes: p1, p3, p5.");
                                          }
                                        }, 800);
                                      }}
                                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-[10px] font-black py-3 rounded-xl cursor-pointer uppercase tracking-wider block text-center"
                                    >
                                      ⚡ TRIGGER SCAN LASER (8811)
                                    </button>
                                  </div>
                                </div>

                                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-mono text-[9px] text-slate-400 space-y-1 block text-left leading-normal">
                                  <p className="text-emerald-400 font-bold">&gt; Terminal online. Laser emitter status ready.</p>
                                  <p className="text-slate-500 font-medium">&gt; Waiting for physical trigger index or manual scanner parameter inputs...</p>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ROLE-BASED ACCESS CONTROL & SECURITY CENTRE */}
            {adminTab === 'rbac_security' && (
              <div className="space-y-8 animate-in fade-in duration-200 text-left">
                {/* Header overview */}
                <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Secured Cyber Operations</span>
                      <h3 className="text-3xl font-black text-white mt-1">Mart.OS Cybersecurity Terminal</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">TLS Encryption Standard v1.3</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
                    Mart.OS is built with enterprise cyber defense strategies including active JWT cryptographical validation, multi-factor token authentication, immutable transactional ledgers, device profile login trackers and machine learning fraud analysis gauges.
                  </p>
                </div>

                {/* --- LIVE SYSTEM IDENTITIES & PASSCODE DIRECTORY (ADMIN CONSOLE) --- */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#c82a5c] block mb-1">identity management panel</span>
                      <h4 className="text-xl font-black text-brand-navy flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-[#c82a5c]" />
                        Roles & Passcode Central Authentication Console (Admin Portal)
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                        View current security keys, modify terminal login passwords (PINs) instantly, and monitor consumer social login pathways.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setSecurityAdminRevealPins(!securityAdminRevealPins)}
                        className="rounded-xl px-4 py-2.5 text-xs font-black uppercase border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 transition-all cursor-pointer"
                      >
                        {securityAdminRevealPins ? (
                          <>
                            <EyeOff className="h-4 w-4 text-slate-500" />
                            <span>Mask All Pins</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 text-[#c82a5c]" />
                            <span>Reveal All Pins</span>
                          </>
                        )}
                      </button>

                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono">
                        🔒 Local Storage Configured
                      </div>
                    </div>
                  </div>

                  {/* Active Custom Password editor Form if selection is active */}
                  {securityAdminEditingRole && (
                    <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-2 border-emerald-500/35 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top duration-300">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                          <ShieldAlert className="h-4.5 w-4.5 text-emerald-600" />
                          Reprogram security PIN credentials for: <strong className="text-teal-650">{securityAdminEditingRole}</strong>
                        </h5>
                        <button
                          onClick={() => setSecurityAdminEditingRole(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Custom Terminal ID</label>
                          <input
                            type="text"
                            value={securityAdminNewId}
                            onChange={(e) => setSecurityAdminNewId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Authorized Security Code (PIN)</label>
                          <input
                            type="text"
                            pattern="[0-9]*"
                            maxLength={8}
                            value={securityAdminNewPin}
                            onChange={(e) => setSecurityAdminNewPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter numbers only"
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono font-black text-brand-navy focus:outline-none focus:border-teal-600 tracking-widest"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Primary Verification Scheme</label>
                          <select
                            value={securityAdminNewMethod}
                            onChange={(e: any) => setSecurityAdminNewMethod(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-600"
                          >
                            <option value="pin">Security PIN Verification</option>
                            <option value="otp">Phone SMS OTP Authorization</option>
                            <option value="social_direct">Social One-Tap / Guest Bypass</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                        <button
                          onClick={() => {
                            if (!securityAdminNewPin) {
                              alert("Password cannot be blank! Enter solid security PIN code.");
                              return;
                            }
                            // Save update
                            setRolePins(prev => {
                              const updated = {
                                ...prev,
                                [securityAdminEditingRole!]: {
                                  pin: securityAdminNewPin,
                                  id: securityAdminNewId,
                                  authMethod: securityAdminNewMethod
                                }
                              };
                              localStorage.setItem('martly_role_pins', JSON.stringify(updated));
                              return updated;
                            });

                            setAuditLogsRegistry(prev => [
                              {
                                timestamp: new Date().toTimeString().split(' ')[0],
                                event: 'CREDENTIAL_REPROGRAMMED',
                                desc: `Reprogrammed ${securityAdminEditingRole} credentials. New Terminal ID: ${securityAdminNewId}, Method: ${securityAdminNewMethod}.`,
                                level: 'SUCCESS',
                                module: 'RBAC'
                              },
                              ...prev
                            ]);

                            alert(`✔️ System Integrity Configured Successfully!\n\nAll security systems configured with new keys for standard ${securityAdminEditingRole} terminals.`);
                            setSecurityAdminEditingRole(null);
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Save className="h-4 w-4" />
                          Apply New Security Credentials
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Operational Directory Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {SIMULATED_ROLES.map((role) => {
                      const credentialInfo = rolePins[role.name] || { pin: '12345', id: 'MEMBER-NODE', authMethod: 'pin' };
                      const isTargetEditing = securityAdminEditingRole === role.name;

                      return (
                        <div
                          key={role.name}
                          className={`rounded-2xl border p-4.5 space-y-3.5 transition-all text-left relative flex flex-col justify-between ${
                            isTargetEditing
                              ? 'border-emerald-500 bg-emerald-500/5 shadow-inner scale-98'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Group Header Badge */}
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md ${role.badgeColor}`}>
                                {role.name}
                              </span>
                              
                              <span className="text-[8px] font-mono text-slate-400 font-extrabold block">
                                #{credentialInfo.id}
                              </span>
                            </div>

                            {/* Verification status label */}
                            <h5 className="text-xs font-black text-slate-800 mt-2 block tracking-tight">
                              {role.name} Access Terminal
                            </h5>

                            {/* Authentication type badge and description details */}
                            <div className="mt-2.5 space-y-1">
                              <span className="text-[9px] text-slate-400 font-bold block">Auth Method:</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase border block w-max ${
                                credentialInfo.authMethod === 'social_direct'
                                  ? 'bg-pink-100 text-pink-700 border-pink-200'
                                  : credentialInfo.authMethod === 'otp'
                                    ? 'bg-amber-100 text-amber-700 border-amber-250'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {credentialInfo.authMethod === 'social_direct' ? '📱 Social One-Tap / Guest Bypass' : credentialInfo.authMethod === 'otp' ? '💬 Mobile SMS OTP Verification' : '🔐 security PIN code'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2.5 border-t border-slate-200/60 mt-auto">
                            {/* Passcode preview */}
                            <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono">
                              <span className="text-[8.5px] font-bold text-slate-400 font-sans uppercase">Security Code</span>
                              <span className="text-[11px] font-extrabold text-[#c82a5c]">
                                {securityAdminRevealPins || isTargetEditing ? (
                                  credentialInfo.pin
                                ) : (
                                  '••••••'
                                )}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setSecurityAdminEditingRole(role.name);
                                setSecurityAdminNewPin(credentialInfo.pin);
                                setSecurityAdminNewId(credentialInfo.id);
                                setSecurityAdminNewMethod(credentialInfo.authMethod);
                              }}
                              className="w-full text-center rounded-xl bg-slate-900 text-white font-extrabold uppercase text-[9px] tracking-wider py-2 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer block"
                            >
                              Reprogram Pass
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-amber-50 text-amber-900/90 rounded-2xl border border-amber-200 p-4 flex gap-3 text-xs leading-relaxed font-semibold">
                    <span className="text-lg">📢</span>
                    <div>
                      <strong className="text-amber-950 font-black">Customer Access Policy Integration:</strong> Customers bypass manual passcode verification entirely. Standard operations provide them with social single sign-on links (Google, Apple) as well as direct mobile phone checkout capabilities to ensure unhindered transactions as per the software blueprint. Administrators can view, verify and monitor passcode configurations above.
                    </div>
                  </div>
                </div>

                {/* Subsections layout */}
                <div className="grid gap-8 lg:grid-cols-12">
                  
                  {/* Left Column: JWT claims decoder card & Fraud Check */}
                  <div className="lg:col-span-6 space-y-8">
                    
                    {/* JWT Claims Token Inspector */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Fingerprint className="h-4 w-4 text-emerald-600 animate-pulse" />
                          Simulated JWT Payload Decoder
                        </h4>
                        <span className="text-[10px] font-mono font-black uppercase bg-[#c82a5c]/10 text-[#c82a5c] px-2 py-0.5 rounded">HMAC-SHA256 Token</span>
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Below is the cryptographically decoded payload JSON corresponding to your simulated profile <strong className="text-slate-800">'{activeRole}'</strong>:
                        </p>
                        
                        {/* JWT representation structure */}
                        <div className="bg-slate-950 rounded-2xl p-4 font-mono text-xs text-slate-350 space-y-3 relative overflow-hidden select-all">
                          <div className="space-y-1 text-sky-400">
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold font-sans">&gt; HEADER: ALGORITHM & TOKEN TYPE</span>
                            <span>{"{"}</span>
                            <div className="pl-4">
                              <span>"alg": "HS256",</span><br/>
                              <span>"typ": "JWT"</span>
                            </div>
                            <span>{"}"}</span>
                          </div>
                          
                          <div className="space-y-1 text-pink-455 border-t border-slate-800/80 pt-2 text-[#c82a5c]">
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold font-sans">&gt; PAYLOAD: CREDENTIAL CLAIMS</span>
                            <span>{"{"}</span>
                            <div className="pl-4">
                              <span>"sub": "admin.bkchub@martly.io",</span><br/>
                              <span>"active_role": <span className="text-emerald-400 font-bold">"{activeRole}"</span>,</span><br/>
                              <span>"mfa_verified": "{securityMfaVerified ? 'true' : 'false'}",</span><br/>
                              <span>"branch_id": "MUM_BKC_01",</span><br/>
                              <span>"scopes": [<span className="text-slate-200">"{SIMULATED_ROLES.find(r => r.name === activeRole)?.scope.split(',')[0]}", ...</span>],</span><br/>
                              <span>"exp": 1779268800</span>
                            </div>
                            <span>{"}"}</span>
                          </div>

                          <div className="space-y-1 text-emerald-400 border-t border-slate-800/80 pt-2">
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold font-sans">&gt; SIGNATURE: TAMPER PROOF VERIFIED</span>
                            <span className="text-[11px] block overflow-hidden text-ellipsis truncate text-emerald-300">
                              HMACSHA256(
                                base64UrlEncode(header) + "." +
                                base64UrlEncode(payload),
                                <span className="text-slate-400">YOUR_MARTLY_256BIT_SECRET_KEY</span>
                              )  ⚡ Verified OK
                            </span>
                          </div>
                        </div>

                        {/* Interactive simulation actions */}
                        <div className="flex gap-3 pt-1">
                          <button 
                            onClick={() => {
                              alert("MOCK RESTORATION\n\nFull JWT session state re-signed successfully on authentication servers.");
                              setAuditLogsRegistry(prev => [
                                { timestamp: new Date().toTimeString().split(' ')[0], event: 'TOKEN_REFRESH', desc: 'Regenerated JWT token signature with fresh 24-hour expiration window.', level: 'SUCCESS', module: 'CRYPT' },
                                ...prev
                              ]);
                            }}
                            className="flex-1 bg-slate-900 text-white rounded-xl py-2.5 text-[10px] font-black uppercase hover:bg-slate-800 transition-colors tracking-wider text-center cursor-pointer"
                          >
                            Refresh JWT Signature
                          </button>
                          
                          <button 
                            onClick={() => {
                              const corrupted = `corrupted_payload_signature_breached_8832a8a.INVALID`;
                              setSecurityJwtToken(corrupted);
                              setAuditLogsRegistry(prev => [
                                { timestamp: new Date().toTimeString().split(' ')[0], event: 'TOKEN_TAMPERED', desc: 'Token signature checksum did not match hash criteria. Suspicious payload integrity mismatch!', level: 'CRITICAL', module: 'SIGNATURE' },
                                ...prev
                              ]);
                              alert("⚠️ SIGNATURE TAMPER SIMULATED\n\nToken has been corrupted. Notice how the 'Claims Token' turns INVALID and security shields will register warnings!");
                            }}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase transition-colors cursor-pointer"
                          >
                            Simulate Tampering
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Fraud Detection & ML Shield Scoring */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Activity className="h-4 w-4 text-rose-650 animate-pulse" />
                          ML-Powered Fraud Analysis Shielder
                        </h4>
                        <span className="text-[10px] font-black text-emerald-600 font-mono capitalize">Real-time inspection</span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-black uppercase block">Threat Severity Index</span>
                            <span className="text-xl font-black font-mono text-slate-800 mt-1 block">Threat Score: {fraudThreatScore}% / 100</span>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            fraudThreatScore < 15 
                              ? 'bg-emerald-100 text-emerald-850 border border-emerald-250/20' 
                              : fraudThreatScore < 50 
                                ? 'bg-amber-100 text-amber-850 border border-amber-250/20' 
                                : 'bg-rose-100 text-rose-850 animate-bounce cursor-default'
                          }`}>
                            {fraudThreatScore < 15 ? 'Safe Baseline' : fraudThreatScore < 50 ? 'Medium Threat' : 'CRITICAL THREAT ZONE'}
                          </span>
                        </div>

                        {/* Visual bar graph */}
                        <div className="h-3.5 w-full bg-slate-150 rounded-lg overflow-hidden border border-slate-200 relative">
                          <motion.div 
                            className={`h-full rounded-lg transition-all duration-700 ${fraudThreatScore < 15 ? 'bg-emerald-450' : fraudThreatScore < 50 ? 'bg-amber-450' : 'bg-rose-500'}`}
                            style={{ width: `${fraudThreatScore}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-slate-500 text-[10px] font-semibold leading-relaxed">
                          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                            <span className="font-extrabold text-[#c82a5c] block">Transaction Velocity Check:</span>
                            <span>Allowed (BKC central hubs match location distance velocity rules)</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                            <span className="font-extrabold text-slate-700 block">Integrity Rate Limit Counter:</span>
                            <span>Averages 1.2 commands/sec. Breaching thresholds: False</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setFraudThreatScore(78);
                              setAuditLogsRegistry(prev => [
                                { timestamp: new Date().toTimeString().split(' ')[0], event: 'SUSPICIOUS_PAYLOAD', desc: 'ML identified bulk checkout card velocity burst from 103.45.2.14. Simulated intrusion blocks deployed.', level: 'CRITICAL', module: 'FRAUD' },
                                ...prev
                              ]);
                              alert("⚠️ BRUTE FORCE FRAUD MODE ACTIVATED\n\nIntrusion threat score has spiked to 78%. Secure security engines have dispatched instant SMS and email alerts, locking down live bulk cash withdrawals.");
                            }}
                            className="flex-1 bg-[#c82a5c] text-white py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-800 transition-colors cursor-pointer"
                          >
                            Simulate Brute Force Bot Attack
                          </button>
                          
                          <button 
                            onClick={() => {
                              setFraudThreatScore(3);
                              setAuditLogsRegistry(prev => [
                                { timestamp: new Date().toTimeString().split(' ')[0], event: 'FRAUD_RESET', desc: 'Cleared ML threat memory buffer. Simulated integrity restored to standard baseline.', level: 'SUCCESS', module: 'SECURITY' },
                                ...prev
                              ]);
                              alert("Cleared Simulated Intrusion Memory buffers cleanly.");
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase py-2 px-4 rounded-xl cursor-pointer text-center block"
                          >
                            Reset Severity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Device Tracking, Backups, audit logs */}
                  <div className="lg:col-span-6 space-y-8">
                    
                    {/* Device Login Tracking & SSL Auditing */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-brand-navy" />
                          Simulated Device Login Tracking Profile
                        </h4>
                        <span className="text-[10px] font-mono bg-sky-100 text-sky-850 font-black px-2 py-0.5 rounded capitalize">Browser Verified</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                          <span className="text-[9px] text-slate-400 font-black uppercase block font-sans">Registered Device Ident</span>
                          <span className="text-slate-800 font-extrabold mt-0.5 block">{securityDeviceTracking.deviceId}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                          <span className="text-[9px] text-slate-400 font-black uppercase block font-sans">User Agent Vector</span>
                          <span className="text-slate-850 font-bold mt-0.5 block">{securityDeviceTracking.browser}</span>
                        </div>
                        <div className="bg-rose-50/40 border border-rose-100 p-3 rounded-2xl">
                          <span className="text-[9px] text-rose-500 font-black uppercase block font-sans">IP Address Origin</span>
                          <span className="text-rose-800 font-mono mt-0.5 font-bold block">{securityDeviceTracking.ipAddress}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                          <span className="text-[9px] text-slate-400 font-black uppercase block font-sans">Approx Coordinates Geolocation</span>
                          <span className="text-slate-850 font-bold mt-0.5 block leading-tight">{securityDeviceTracking.location}</span>
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 border border-emerald-105 rounded-2xl p-4 flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-emerald-600 flex-shrink-0 animate-bounce" />
                        <div>
                          <h6 className="text-xs font-black text-slate-850">SSL Connection Certificate Verified</h6>
                          <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                            TLSv1.3 connection is negotiated with AES256-GCM symmetric session keys to encrypt your credentials database stream seamlessly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* System State Snapshot Backup & Restore */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <History className="h-4 w-4 text-emerald-800" />
                          Cryptographically Backed Snapshots
                        </h4>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black">Local storage sync</span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        Avoid catastrophic operational losses. Trigger cryptographical snapshot archives of the active store setup, categories, and wallet state parameters.
                      </p>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const backupState = {
                              activeRole,
                              securityMfaVerified,
                              userAuth,
                              branchesCount: branches.length,
                              cartSize: cart.length,
                              pdaScannerActive: pdaLaserOn,
                              timestamp: new Date().toISOString()
                            };
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupState, null, 2));
                            const downloadAnchor = document.createElement('a');
                            downloadAnchor.setAttribute("href", dataStr);
                            downloadAnchor.setAttribute("download", `martly_os_state_snapshot_${Date.now()}.json`);
                            document.body.appendChild(downloadAnchor);
                            downloadAnchor.click();
                            downloadAnchor.remove();

                            setAuditLogsRegistry(prev => [
                              { timestamp: new Date().toTimeString().split(' ')[0], event: 'EXPORT_STATE', desc: 'Secure decrypted JSON state bundle exported successfully to client system.', level: 'SUCCESS', module: 'SNAPSHOT' },
                              ...prev
                            ]);
                          }}
                          className="flex-1 bg-brand-navy hover:bg-slate-800 text-white text-[10px] font-black uppercase py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          📥 Download State Backup (JSON)
                        </button>
                        
                        <button 
                          onClick={() => {
                            alert("RESTORATION INTEGRITY SUCCESSFUL\n\nMartly.OS variables restored accurately to production template reference states.");
                            setAuditLogsRegistry(prev => [
                              { timestamp: new Date().toTimeString().split(' ')[0], event: 'RESTORE_BASE', desc: 'Decrypted template state variables restored to master cluster cleanly.', level: 'SUCCESS', module: 'DATABACKUP' },
                              ...prev
                            ]);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase py-3 px-6 rounded-xl transition-all cursor-pointer"
                        >
                          Restore Baseline Setup
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Logs immutable registry UI */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm text-left">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-slate-700 animate-pulse" />
                        Tamper-Proof Audit Logs Registry (Security Ledger)
                      </h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">
                        SHA256 cryptographically linked audit trails
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-500 uppercase">Records Yield:</span>
                      <strong className="font-mono text-slate-800">{auditLogsRegistry.length} logs</strong>
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-650 uppercase font-black tracking-wider text-[9px] border-b border-slate-200">
                          <th className="p-3">Timestamp [UTC]</th>
                          <th className="p-3">Process Code</th>
                          <th className="p-3">Cyber Module</th>
                          <th className="p-3">Risk Assessment</th>
                          <th className="p-3">Tamper-Proof Event Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {auditLogsRegistry.map((log, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                            <td className="p-3 font-semibold text-[#c82a5c] text-[11px] whitespace-nowrap">{log.event}</td>
                            <td className="p-3 text-slate-600 text-[11px] whitespace-nowrap font-sans uppercase font-extrabold">{log.module}</td>
                            <td className="p-3 text-slate-550 text-[11.5px] whitespace-nowrap">
                              <span className={`px-2 py-0.5 text-[9px] font-black font-sans uppercase rounded ${
                                log.level === 'CRITICAL' || log.level === 'ALERT' 
                                  ? 'bg-rose-100 text-rose-805' 
                                  : log.level === 'SUCCESS' || log.level === 'SECURE'
                                    ? 'bg-emerald-100 text-emerald-805'
                                    : 'bg-slate-150 text-slate-700'
                              }`}>
                                {log.level}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 leading-relaxed font-sans font-semibold text-xs">{log.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ADVANCED QUICK COMMERCE SERVICES HUB */}
            {adminTab === 'qcomm_advanced' && (
              <div className="space-y-8 animate-in fade-in duration-200 text-left">
                {/* Header overview */}
                <div className="bg-[#c82a5c] border border-[#a21944] text-white rounded-3xl p-8 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">Tactical Q-Commerce Engine</span>
                      <h3 className="text-3xl font-black text-white mt-1">Advanced 10-Minute Dispatching Hub</h3>
                    </div>
                    <div className="flex bg-[#8b163d] text-[#ffff00] border border-[#ffff00]/30 rounded-2xl px-4 py-2 font-black uppercase text-xs tracking-widest font-mono">
                      Qcomm Engine Ver v2.16
                    </div>
                  </div>
                  <p className="text-sm text-rose-50 max-w-4xl leading-relaxed">
                    Mart.OS next-generation micro-fulfillment stack integrates real-time Dark Store slot arrays, automated cold chain temperature management, Smart proximity-based scooter rider dispatch allocation algorithms, multiple payment gateway checkout processes and fully automated physical invoice printing routines.
                  </p>
                </div>

                {/* Subsections layout */}
                <div className="grid gap-8 lg:grid-cols-12">
                  
                  {/* Left Column: 10-Minute Delivery Logic, Dark Store Slots, Smart Allocation, Route planner */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* 10-Minute Delivery Logic & Splitting */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand-navy animate-spin" style={{ animationDuration: '4s' }} />
                          10-Minute Micro-transit Dispatching & Auto Order Splitting
                        </h4>
                        <span className="text-[10px] bg-red-105 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full capitalize">Fast Dispatch Mode</span>
                      </div>

                      <div className="space-y-4">
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          To meet our guaranteed delivery SLA of 10 minutes, large orders are broken up according to aisles (Ambient bins vs Cool Chambers) and split into dynamic order parcels containing optimized scooter load limits of maximum 15kg.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150">
                            <div>
                              <span className="text-[9px] text-[#c82a5c] uppercase font-black tracking-wider block">Parent Order Registry ID</span>
                              <strong className="text-brand-navy text-xs leading-none">ord-88321</strong>
                            </div>
                            <span className="text-[11px] text-slate-500 font-bold">Total Payload Weight: 5.4 kg (Double bag setup)</span>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            {qcommSplitOrders.map((splitOp, idx) => (
                              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 space-y-2 text-xs relative">
                                <span className="absolute top-2.5 right-2 px-1.5 py-0.5 text-[8px] bg-emerald-100 text-emerald-800 rounded font-black font-mono">
                                  {splitOp.status}
                                </span>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block font-bold font-sans">SPLIT CARGO BAG {splitOp.id}</span>
                                <div className="space-y-1">
                                  <h6 className="font-extrabold text-slate-805 leading-tight">Cargo: {splitOp.items}</h6>
                                  <p className="text-[10.5px] text-slate-500 leading-none">Zone Slot: {splitOp.zone}</p>
                                  <p className="text-[10.5px] text-[#c82a5c] font-bold">Rider Appointee: {splitOp.riderId}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2.5">
                          <button 
                            onClick={() => {
                              alert("Order Split dispatched to parallel packer lines BKC-01! Bag A1 is processing; Bag A2 is picking. Multi-rider app tags verified.");
                              setAuditLogsRegistry(prev => [
                                { timestamp: new Date().toTimeString().split(' ')[0], event: 'SPLIT_ORDER', desc: 'Simulated automatic splitting algorithm partitioned parent ord-88321 into parallel dispatch lines.', level: 'INFO', module: 'Q-COMM' },
                                ...prev
                              ]);
                            }}
                            className="flex-1 bg-slate-900 text-white rounded-xl py-2.5 text-[10px] font-black uppercase hover:bg-slate-800 transition-colors tracking-wider text-center cursor-pointer"
                          >
                            ⚡ RE-SPLIT OUTSTANDING ORDER CARGOS
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dark Store Management & Hyperlocal inventories */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Building className="h-4 w-4 text-emerald-800" />
                          Hyperlocal Dark Store Slots & Micro-fulfillment Shelf-Bin Matrices
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-600 font-extrabold uppercase">Live temperature tracking</span>
                      </div>

                      <div className="mb-2 flex bg-slate-100 p-1 rounded-2xl border border-slate-150 w-full max-w-sm">
                        {['Central Dark Store BKC-01', 'Micro Hub Bandra-02', 'Mini Store Powai-03'].map(ds => {
                          const isSel = qcommActiveDarkStore === ds;
                          return (
                            <button
                              key={ds}
                              onClick={() => {
                                setQcommActiveDarkStore(ds);
                                setQcommRouteProgress(0); // reset router path progress on swap for mapping clean
                                setAuditLogsRegistry(prev => [
                                  { timestamp: new Date().toTimeString().split(' ')[0], event: 'DARKSTORE_SWAP', desc: `Admin relocated target dark store context to ${ds}. Map routing grids refreshed.`, level: 'INFO', module: 'PHYSICAL_OPS' },
                                  ...prev
                                ]);
                              }}
                              className={`flex-1 text-[8.5px] font-black uppercase text-center tracking-wider rounded-xl py-2 cursor-pointer transition-all ${isSel ? 'bg-[#c82a5c] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-205'}`}
                            >
                              {ds.split(' ').slice(-1)[0]}
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 text-slate-505 text-xs text-left leading-normal font-semibold">
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1 relative">
                          <span className="text-[9px] text-[#c82a5c] font-black uppercase">ZONE 1: AMBIENT COOMBS</span>
                          <strong className="text-brand-navy block text-lg font-black mt-1">Shelves A1 - A12</strong>
                          <p className="text-[10px]">Staples, tea packet crates, electronics. Capacity density: 72%. Humidity limits: Normal.</p>
                        </div>
                        <div className="bg-slate-50 border border-rose-100 bg-rose-50/20 p-3 rounded-2xl space-y-1 relative">
                          <span className="text-[9px] text-rose-500 font-black uppercase">ZONE 2: CHILLED CHAMBERS</span>
                          <strong className="text-brand-navy block text-lg font-black mt-1">Zone C1 / {qcommTempMin}°C</strong>
                          <p className="text-[10px]">Organic produce, greens, avocados. Automated cooling status: Safe.</p>
                          <div className="flex gap-1.5 mt-2">
                            <button 
                              onClick={() => {
                                setQcommTempMin(prev => parseFloat((prev - 0.5).toFixed(1)));
                                setAuditLogsRegistry(prev => [
                                  { timestamp: new Date().toTimeString().split(' ')[0], event: 'CHILLER_ADJUST', desc: `Relocated chiller setting down to ${qcommTempMin} C for product integrity.`, level: 'INFO', module: 'HVAC' },
                                  ...prev
                                ]);
                              }}
                              className="bg-sky-100 hover:bg-sky-200 text-sky-800 px-2 py-0.5 text-[8px] font-black uppercase rounded cursor-pointer transition-transform"
                            >
                              Adjust Cold (-0.5°C)
                            </button>
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-1 relative font-mono">
                          <span className="text-[9px] text-slate-400 font-sans font-black uppercase">SHELF OCCUPANCY INDEX (QTY)</span>
                          <span className="text-2xl font-black text-brand-navy block mt-1">45,180 units</span>
                          <p className="text-[10px] font-sans">Active Hub: <strong className="text-[#c82a5c] text-xs font-mono">{qcommActiveDarkStore}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* AI Route Planner with Traffic Overlay & weather index */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left relative overflow-hidden">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-rose-550" />
                          AI Route Planner with Real-time Weather & Traffic Overlays
                        </h4>
                        <span className="text-[10px] bg-indigo-100 text-indigo-805 font-mono font-black uppercase px-2.5 py-0.5 rounded">GPS Routing Engaged</span>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block font-sans">Traffic Factor</span>
                            <strong className={`font-black uppercase mt-0.5 block ${qcommTrafficState === 'Clear' ? 'text-emerald-600' : 'text-rose-605'}`}>
                              {qcommTrafficState} Mode
                            </strong>
                          </div>
                          
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block font-sans">Weather Alert Index</span>
                            <strong className="font-black text-slate-800 uppercase mt-0.5 block">{qcommWeatherIndex}</strong>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-left">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block font-sans">Effective ETA delay</span>
                            <strong className="font-extrabold font-mono text-brand-navy mt-0.5 block">
                              {qcommTrafficState === 'Clear' ? '+0.0 mins' : qcommTrafficState === 'Heavy' ? '+3.5 mins' : '+5.0 mins'}
                            </strong>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block font-sans">Target location geocode</span>
                            <strong className="font-bold text-slate-500 block font-mono">19.076° N, 72.877° E</strong>
                          </div>
                        </div>

                        {/* Interactive map visualization canvas */}
                        <div className="h-40 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden text-center flex flex-col justify-center select-none font-mono text-xs">
                          {qcommWeatherIndex.includes('Torrent') && (
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=100')] opacity-10 pointer-events-none mix-blend-color-dodge animate-pulse" />
                          )}

                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path 
                              d="M 60,110 Q 150,30 250,90 T 450,110 T 650,50" 
                              fill="none" 
                              stroke="#334155" 
                              strokeWidth="3.5" 
                              strokeDasharray="6 4"
                            />
                            <path 
                              d="M 60,110 Q 150,30 250,90 T 450,110 T 650,50" 
                              fill="none" 
                              stroke="#c82a5c" 
                              strokeWidth="4" 
                              strokeDasharray="450"
                              strokeDashoffset={450 - (4.5 * qcommRouteProgress)}
                              className="transition-all duration-700"
                            />
                          </svg>

                          <div className="absolute left-[54px] top-[95px] flex flex-col items-center">
                            <span className="h-4 w-4 rounded-full bg-[#c82a5c] border-2 border-white flex items-center justify-center text-[7px] text-white font-sans font-black">H</span>
                            <span className="text-[8px] bg-slate-800 text-white rounded px-1.5 py-0.5 mt-1 font-sans font-black tracking-wider uppercase border border-slate-700">Hub BKC</span>
                          </div>

                          <div className="absolute right-[54px] top-[30px] flex flex-col items-center">
                            <span className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[7px] text-white font-sans font-black">C</span>
                            <span className="text-[8px] bg-slate-800 text-emerald-400 rounded px-1.5 py-0.5 mt-1 font-sans font-black tracking-wider uppercase border border-emerald-950">Rajesh Flat</span>
                          </div>

                          {/* Live Courier Scout indicator */}
                          <div 
                            className="absolute flex flex-col items-center z-10 transition-all duration-700 shrink-0"
                            style={{ 
                              left: `calc(10% + (${qcommRouteProgress}% * 0.73))`,
                              top: qcommRouteProgress < 40 ? '60px' : qcommRouteProgress < 80 ? '94px' : '48px'
                            }}
                          >
                            <Truck className="h-6 w-6 text-[#ffff00] animate-bounce bg-slate-950 p-1 rounded-full border border-yellow-500" />
                            <span className="text-[7.5px] bg-yellow-500 text-slate-900 rounded font-sans font-black px-1 leading-none uppercase">SLA: {10 - Math.floor(qcommRouteProgress / 10)}m</span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-extrabold uppercase z-10 block pointer-events-none font-sans select-none tracking-widest mt-auto mb-20 bg-slate-950/80 rounded-full px-4 py-1.5 mx-auto max-w-fit">
                            Live Route Track: {qcommRouteProgress}% complete
                          </span>
                        </div>

                        {/* Interactive Control row */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                            {[
                              { label: 'Map Clear Path', traf: 'Clear', weather: 'Clear Skies (31°C)' },
                              { label: 'Simulation Heavy Congestion', traf: 'Heavy', weather: 'Rain Overcast (27°C)' },
                              { label: 'Monsoon Torrent Blockage', traf: 'Rerouted', weather: 'Torrent Monsoons (24°C)' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                onClick={() => {
                                  setQcommTrafficState(preset.traf as any);
                                  setQcommWeatherIndex(preset.weather);
                                  setAuditLogsRegistry(prev => [
                                    { timestamp: new Date().toTimeString().split(' ')[0], event: 'AI_RE_ROUTE', desc: `AI model adjusted routes. Traffic index evaluated: ${preset.traf}.`, level: 'INFO', module: 'AI_ROUTER' },
                                    ...prev
                                  ]);
                                }}
                                className={`text-[8.5px] font-black uppercase text-center tracking-wider py-1.5 px-3 rounded-lg cursor-pointer ${qcommTrafficState === preset.traf ? 'bg-brand-navy text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200'}`}
                              >
                                {preset.traf}
                              </button>
                            ))}
                          </div>

                          <button 
                            onClick={() => {
                              if (qcommRouteProgress >= 100) {
                                setQcommRouteProgress(0);
                              } else {
                                setQcommRouteProgress(prev => Math.min(100, prev + 20));
                              }
                            }}
                            className="flex-1 bg-[#c82a5c] hover:bg-rose-700 text-white rounded-xl py-2.5 text-[10px] font-black uppercase cursor-pointer text-center block"
                          >
                            {qcommRouteProgress >= 100 ? "🔄 Reset Routing Simulation" : "⚡ Advance Dispatch Transit (+20%)"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Smart Rider Allocation, Payment gateway Sandbox */}
                  <div className="lg:col-span-4 space-y-8">
                    
                    {/* Smart Rider Allocation & battery */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Truck className="h-4 w-4 text-emerald-700" />
                          Smart Rider Proximity Allocation
                        </h4>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase font-sans">EV Flotilla</span>
                      </div>

                      <div className="space-y-3.5">
                        <p className="text-xs text-slate-500 leading-normal font-semibold">
                          Our proximity router allocates orders to the nearest electric vehicle rider with positive battery capacity indicators.
                        </p>

                        <div className="space-y-3">
                          {[
                            { name: 'Amit Patel (Active BKC)', battery: qcommRiderBattery, prox: '0.8 km', cap: '15 kg max', sText: 'Assigned Cargo Bag A1' },
                            { name: 'Ramesh Das (Bandra Zone)', battery: 42, prox: '2.4 km', cap: '15 kg max', sText: 'Idle Standby' },
                            { name: 'Priya Nair (Sakinaka Hub)', battery: 89, prox: '3.1 km', cap: '15 kg max', sText: 'Assigned Cargo Bag A2' }
                          ].map((rider, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="font-extrabold text-slate-800 block text-xs">{rider.name}</span>
                                <span className="text-[10px] text-slate-400 block font-semibold leading-none">Vehicle: EV Scooter | limit: {rider.cap}</span>
                                <span className="text-[9.5px] bg-slate-200 uppercase font-black px-1.5 py-0.5 rounded leading-none text-slate-600 font-bold block w-fit mt-1">{rider.sText}</span>
                              </div>
                              <div className="text-right space-y-1 font-mono">
                                <span className={`text-[10px] font-black uppercase block ${rider.battery < 50 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                  🔋 {rider.battery}%
                                </span>
                                <span className="text-[10px] text-slate-400 block font-bold block uppercase">{rider.prox}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => {
                            setQcommRiderBattery(prev => Math.max(10, prev - 3));
                            alert("AI Smart Dispatch: Nearest EV rider selected. Delivery status updated cleanly on all companion applets.");
                          }}
                          className="w-full bg-brand-navy hover:bg-slate-805 text-white text-[10px] font-black py-3 rounded-xl cursor-pointer uppercase tracking-wider block text-center"
                        >
                          ⚡ Smart Re-Allocate EV Rider
                        </button>
                      </div>
                    </div>

                    {/* Payment Gateway Sandbox Simulator */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-left">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                          <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
                          Payment Gateway API Sandbox
                        </h4>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">SDK verification</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-2 font-bold font-sans">Simulated Gateway payment checkout channels:</span>
                          <div className="grid grid-cols-2 gap-2">
                            {['Razorpay', 'Paytm', 'PhonePe', 'Cashfree', 'UPI', 'Wallet', 'COD'].map((gateway) => {
                              const isSel = paymentGatewaySelected === gateway;
                              return (
                                <button
                                  key={gateway}
                                  onClick={() => {
                                    setPaymentGatewaySelected(gateway as any);
                                    setApiTerminalLogs(prev => [
                                      `[SDK Handshake] Customizing intent variables for ${gateway} Gateway API credentials...`,
                                      `[Process] Client verified payment credentials with dynamic transaction token.`,
                                      ...prev
                                    ]);
                                  }}
                                  className={`text-[9px] text-left p-2.5 rounded-xl border transition-all cursor-pointer font-black uppercase ${isSel ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-xs' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                >
                                  💳 {gateway}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-slate-900 text-yellow-300 border border-slate-850 p-3 rounded-2xl font-mono text-[9px] space-y-1 block text-left max-h-24 overflow-y-auto">
                          <p className="text-teal-400 leading-normal font-sans font-bold uppercase select-none">&gt; API Gateway Log Stream:</p>
                          {apiTerminalLogs.map((logLine, index) => (
                            <p key={index} className="leading-tight opacity-90">&gt; {logLine}</p>
                          ))}
                        </div>

                        <button 
                          onClick={() => {
                            setApiTerminalLogs(prev => [
                              `[Webhook Trigger] Mock client signatures confirmed! Settling amount...`,
                              `[${paymentGatewaySelected} PG] payment_882937_success callback dispatched back to ERP central ledger database.`,
                              ...prev
                            ]);
                            alert(`Simulating dynamic API checkout for ${paymentGatewaySelected}:\n\n- Handshake verified\n- SDK window mounted\n- Webhook callback successfully dispatched.`);
                          }}
                          className="w-full bg-[#1e1b4b] hover:bg-slate-800 text-white text-[10px] font-black py-3 rounded-xl cursor-pointer uppercase tracking-wider block text-center"
                        >
                          Execute Mock Verification API Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subsection 4: Third-Party Integrations Station */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-left">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h4 className="font-black text-brand-navy uppercase tracking-tight flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-800" />
                      Global Ecosystem Third-Party Integration Station
                    </h4>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">
                      Operational widgets & device print hardware simulators
                    </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Block 1: WhatsApp SMS */}
                    <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-3xl space-y-3">
                      <strong className="text-xs uppercase tracking-wider font-sans text-brand-navy block">WhatsApp & SMS Gateway APIs</strong>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                        Automates delivery messages using template credentials to client Rajesh's phone.
                      </p>
                      <button 
                        onClick={() => {
                          alert("WhatsApp notification alert packet:\n'Hi Rajesh, your staples split bag A1 is ready for courier transit!' dispatched clean.");
                          setAuditLogsRegistry(prev => [
                            { timestamp: new Date().toTimeString().split(' ')[0], event: 'SMS_DISPATCH', desc: 'Dispatched WhatsApp alert to Client Rajesh Kumar.', level: 'SUCCESS', module: 'COMM_GATEWAY' },
                            ...prev
                          ]);
                        }}
                        className="w-full bg-[#1e1b4b] hover:bg-slate-800 text-white text-[9px] font-black uppercase py-2 rounded-lg cursor-pointer transition-all"
                      >
                        Dispatch Test WhatsApp/SMS Alerts
                      </button>
                    </div>

                    {/* Block 2: GST Passes Verification API */}
                    <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-3xl space-y-3">
                      <strong className="text-xs uppercase tracking-wider font-sans text-brand-navy block">Merchant & GST Compliance API</strong>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                        Secures legal B2B commerce matching by validating merchant state GST identification registers, and emitting pass logs.
                      </p>
                      <button 
                        onClick={() => {
                          alert(`GST PASS ISSUED:\n\nVerification: GSTIN-27MUMBACK9018J matches!\nLegal status: Compliant\nE-way Passage ID: eway-mumbai-9029a`);
                          setAuditLogsRegistry(prev => [
                            { timestamp: new Date().toTimeString().split(' ')[0], event: 'GST_VALIDATE', desc: 'Verified GSTIN alignment and successfully compiled e-way compliance slip.', level: 'SECURE', module: 'REGULATORY' },
                            ...prev
                          ]);
                        }}
                        className="w-full bg-[#c82a5c] hover:bg-[#b0224e] text-white text-[9px] font-black uppercase py-2 rounded-lg cursor-pointer transition-all"
                      >
                        Verify Legal Merchant GST Pass
                      </button>
                    </div>

                    {/* Block 3: Hardware printers */}
                    <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-3xl space-y-3">
                      <strong className="text-xs uppercase tracking-wider font-sans text-brand-navy block">SKU Barcode Printer API</strong>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                        Encodes SKU details to physical sticky rolls for box compliance scans.
                      </p>
                      <button 
                        onClick={() => {
                          alert("SUCCESSFULLY FEEDED:\nBarcode labels for active products printed cleanly on industrial printer BKC-01.");
                          setAuditLogsRegistry(prev => [
                            { timestamp: new Date().toTimeString().split(' ')[0], event: 'PRINTER_FEED', desc: 'Dispatched high-resolution sticky barcode feed signal to Zebra printer.', level: 'INFO', module: 'HARDWARE' },
                            ...prev
                          ]);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-black uppercase py-2 rounded-lg cursor-pointer transition-all"
                      >
                        Feed Barcode Label Print
                      </button>
                    </div>

                    {/* Block 4: Thermal Printers & POS Machine */}
                    <div className="bg-slate-50/70 border border-slate-200 p-4 rounded-3xl space-y-3">
                      <strong className="text-xs uppercase tracking-wider font-sans text-brand-navy block">Thermal POS Printer & Swipers</strong>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                        Simulates live thermal receipt prints and credit card swiper signals.
                      </p>
                      <button 
                        onClick={() => {
                          alert("Swiping terminal: Handshaking with POS machine S-12. Card swipe matched. Emitting invoice receipt roll...");
                          setAuditLogsRegistry(prev => [
                            { timestamp: new Date().toTimeString().split(' ')[0], event: 'THERMAL_PRINT', desc: 'S-12 thermal printer successfully printed receipt roll for ord-88321.', level: 'INFO', module: 'HARDWARE' },
                            ...prev
                          ]);
                        }}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-black uppercase py-2 rounded-lg cursor-pointer transition-all"
                      >
                        Print POS Receipt Roll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-rose-200 bg-footer-gradient pt-20 pb-10 text-rose-950 shadow-inner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-transparent">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-20">
            <div>
              <div className="text-2xl font-black tracking-tighter text-rose-950 mb-4 animate-pulse">MART.OS</div>
              <p className="text-sm font-semibold text-rose-900/80 mb-6 max-w-xs leading-relaxed">
                The next-generation hyperlocal fulfillment operating system. 
                Redefining speed, scale, and supply chain integrity.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setActiveFooterTab('brand-assets')} className="p-3 rounded-xl bg-rose-950/10 text-rose-950 hover:bg-rose-950 hover:text-white transition-all cursor-pointer">
                  <Twitter size={18} />
                </button>
                <button onClick={() => setActiveFooterTab('brand-assets')} className="p-3 rounded-xl bg-rose-950/10 text-rose-950 hover:bg-rose-950 hover:text-white transition-all cursor-pointer">
                  <Facebook size={18} />
                </button>
                <button onClick={() => setActiveFooterTab('brand-assets')} className="p-3 rounded-xl bg-rose-950/10 text-rose-950 hover:bg-rose-950 hover:text-white transition-all cursor-pointer">
                  <Instagram size={18} />
                </button>
                <button onClick={() => setActiveFooterTab('brand-assets')} className="p-3 rounded-xl bg-rose-950/10 text-rose-950 hover:bg-rose-950 hover:text-white transition-all cursor-pointer">
                  <Youtube size={18} />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-900 mb-6 font-semibold">Operations</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-rose-950/70">
                <li>
                  <button onClick={() => setActiveFooterTab('active-hubs')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Active Hubs <span className="text-[9px] lowercase bg-[#c82a5c] text-white px-2 py-0.5 rounded ml-1 font-mono tracking-normal capitalize">Live</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveFooterTab('delivery-fleet')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Delivery Fleet <span className="text-[9px] bg-sky-600 text-white px-2 py-0.5 rounded ml-1 font-mono tracking-normal capitalize">Tracking</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveFooterTab('merchant-portal')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Merchant Portal <span className="text-[9px] bg-amber-600 text-white px-2 py-0.5 rounded ml-1 font-mono tracking-normal capitalize">Join</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveFooterTab('real-time-logs')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Real-time Logs <span className="text-[9px] bg-slate-900 text-teal-400 px-2 py-0.5 rounded ml-1 font-mono tracking-normal capitalize">Stream</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-900 mb-6">Platform</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-rose-950/70">
                <li>
                  <button onClick={() => setActiveFooterTab('api-docs')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    API Documentation <span className="text-[9px] bg-emerald-700 text-white px-2 py-0.5 rounded ml-1 font-mono tracking-normal capitalize">v1.4</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveFooterTab('security-hub')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Security Hub <span className="text-[10px] text-green-800 font-bold">✓</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveFooterTab('brand-assets')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Brand Assets
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveFooterTab('enterprise-sow')} className="hover:text-rose-950 hover:underline transition-all block text-left">
                    Enterprise SOW <span className="text-[9px] bg-violet-600 text-white px-2 py-0.5 rounded ml-1 font-mono tracking-normal capitalize">Quote</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-900 mb-6">Headquarters</h4>
              <div className="text-sm font-semibold text-rose-950">
                <p>99 Terminal Way, BKC Hub</p>
                <p>Mumbai, Maharashtra, 400051</p>
                <p className="mt-4 font-black text-[#4c0519] cursor-pointer hover:underline" onClick={() => alert('Support portal linked. Sending ops ticket to ops@mart-os.com.')}>ops@mart-os.com</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-rose-900/10 pt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-950/60">
            <div>© 2026 MART.OS CORE. All rights reserved.</div>
            <div className="flex gap-8">
              <button onClick={() => setActiveFooterTab('protocol')} className="hover:text-rose-950 hover:underline transition-all cursor-pointer">Protocol</button>
              <button onClick={() => setActiveFooterTab('privacy')} className="hover:text-rose-950 hover:underline transition-all cursor-pointer">Privacy</button>
              <button onClick={() => setActiveFooterTab('nodes')} className="hover:text-rose-950 hover:underline transition-all cursor-pointer">Nodes</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Footer Panel Drawer */}
      <AnimatePresence>
        {activeFooterTab && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-sm"
              onClick={() => setActiveFooterTab(null)}
            />
            <motion.div
              initial={{ y: '50px', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '50px', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-12 z-50 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c82a5c]">Operational Console</div>
                  <h3 className="text-xl font-black text-brand-navy tracking-tight">
                    {activeFooterTab === 'active-hubs' && 'Active Hub Network'}
                    {activeFooterTab === 'delivery-fleet' && 'Hyperlocal Delivery Fleet'}
                    {activeFooterTab === 'merchant-portal' && 'Dynamic Merchant Onboarding'}
                    {activeFooterTab === 'real-time-logs' && 'System Transaction Stream'}
                    {activeFooterTab === 'api-docs' && 'Developer API Playground'}
                    {activeFooterTab === 'security-hub' && 'Security & Trust Core'}
                    {activeFooterTab === 'brand-assets' && 'MART.OS Brand Resources'}
                    {activeFooterTab === 'enterprise-sow' && 'Enterprise SOW Contract Estimator'}
                    {activeFooterTab === 'protocol' && 'MART.OS Core System Protocol'}
                    {activeFooterTab === 'privacy' && 'Core Privacy, GDPR & Consent Center'}
                    {activeFooterTab === 'nodes' && 'Live Hyperlocal Cluster Nodes'}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveFooterTab(null)} 
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Hubs Tab Content */}
              {activeFooterTab === 'active-hubs' && (
                <div className="space-y-6">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Explore active physical distribution nodes processing grocery SKU items in real-time bounds.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {branches.map(br => (
                      <div key={br.id} className="relative rounded-2xl border border-slate-200/80 p-4 bg-slate-50 transition-all hover:bg-slate-100/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm text-brand-navy">{br.name}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#c82a5c] px-2 py-0.5 rounded bg-rose-50 border border-rose-100">Live</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">{br.address}</p>
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400">
                          <span>Radius: {br.deliveryRadius} km</span>
                          <span className="text-emerald-600">98.4% Load</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider mb-1">Global Routing Status</h4>
                      <p className="text-[11px] text-rose-900/80">Multipath delivery sequence optimized at 12:54:11 UTC.</p>
                    </div>
                    <button onClick={() => alert('Triggering Global Multicast Optimizer... Success! 3 Routing pathways refreshed.')} className="rounded-xl bg-[#c82a5c] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-md">
                      Optimize Matrix
                    </button>
                  </div>
                </div>
              )}

              {/* Delivery Fleet Content */}
              {activeFooterTab === 'delivery-fleet' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">Metropolis Autonomous Drones & Fleet</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700">42 Dynamic Nodes Active</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "fl-1", name: "Drone Express-D12", loc: "Downtown BKC Hub", state: "Delivering Basmati Rice", eta: "4 mins", progress: 65 },
                      { id: "fl-2", name: "Rider Mumbai-West 9", loc: "Westside Hub Portal", state: "Dispatched Gala Apples", eta: "8 mins", progress: 28 },
                      { id: "fl-3", name: "Drone Express-F4", loc: "North Park Station Hub", state: "Delivered Sourdough", eta: "Completed", progress: 100 }
                    ].map(fleet => (
                      <div key={fleet.id} className="border border-slate-100 p-4 rounded-2xl bg-slate-50/50 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-xs text-[#4c0519]">{fleet.name}</span>
                            <p className="text-[10px] text-slate-400 font-medium">{fleet.loc} • {fleet.state}</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${fleet.progress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{fleet.eta}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-green" style={{ width: `${fleet.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => alert('Deploying alternative standby fleet drone to Metropolis BKC Hub coordinates... Success.')} className="w-full rounded-2xl bg-[#4c0519] py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                    Coordinate Standby Fleet Node
                  </button>
                </div>
              )}

              {/* Merchant Portal Content */}
              {activeFooterTab === 'merchant-portal' && (
                <div className="space-y-6">
                  <div className="text-xs font-semibold text-slate-500 leading-relaxed border-b border-slate-100 pb-4">
                    Onboard new grocery items directly to the live application store dynamically through this terminal simulation!
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Product Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Alphonso Mangoes"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-[#4c0519]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Price (In ₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 599"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-[#4c0519]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Category ID</label>
                      <select 
                        value={newProdCat}
                        onChange={(e) => setNewProdCat(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-brand-navy focus:outline-none animate-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Unit / Weight</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1kg"
                        value={newProdUnit}
                        onChange={(e) => setNewProdUnit(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Initial Stock</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 50"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (!newProdName || !newProdPrice) {
                        alert('Error: Please specify Name and Price to deploy dynamic SKU.');
                        return;
                      }
                      const sku: Product = {
                        id: 'sku-' + Date.now(),
                        name: newProdName,
                        price: parseFloat(newProdPrice),
                        category: newProdCat,
                        brand: 'Local Partner',
                        unit: newProdUnit,
                        image: 'https://images.unsplash.com/photo-1596561807314-15511d99e716?w=400&q=80',
                        stock: parseInt(newProdStock) || 50
                      };
                      setProducts([sku, ...products]);
                      alert(`Deployment Protocol Completed: ${newProdName} added dynamically to catalog!`);
                      setNewProdName('');
                      setNewProdPrice('');
                      setActiveFooterTab(null);
                    }}
                    className="w-full rounded-2xl bg-[#4c0519] py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#c82a5c] transition-colors shadow-lg active:scale-95 transition-transform"
                  >
                    Deploy SKU Into App Catalog
                  </button>
                </div>
              )}

              {/* Real-time Logs Content */}
              {activeFooterTab === 'real-time-logs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Active Telemetry Tunnel</span>
                    <span className="text-red-500 font-bold animate-pulse">● RAW CAPTURE ATTACHED</span>
                  </div>
                  <div className="rounded-2xl bg-slate-950 p-6 text-[10px] font-mono text-emerald-400 h-64 overflow-y-auto space-y-1 scrollbar-none shadow-inner border border-slate-900">
                    {logStream.map((log, i) => (
                      <div key={i} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setLogStream([`[${new Date().toLocaleTimeString()}] Buffer purged. Listening for hot events...`])}
                      className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                    >
                      Clear Log Buffer
                    </button>
                    <button 
                      onClick={() => {
                        alert('Event simulator forced: Inbound webhook generated.');
                        setLogStream(prev => [
                          `[${new Date().toLocaleTimeString()}] [SIMULATOR] Injected virtual routing payload. State synchronized.`,
                          ...prev
                        ]);
                      }}
                      className="flex-1 rounded-xl bg-[#4c0519] py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors"
                    >
                      Trigger Mock Query Event
                    </button>
                  </div>
                </div>
              )}

              {/* API Documentation */}
              {activeFooterTab === 'api-docs' && (
                <div className="space-y-6">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Access our high-velocity REST API. Fetch available catalog entities to power remote sales hubs.
                  </p>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex justify-between items-center bg-slate-200/50 p-2.5 rounded-lg text-xs font-bold text-brand-navy">
                      <span className="text-emerald-700 font-mono font-black">GET</span>
                      <span className="font-mono">/api/products?branch=br-1</span>
                    </div>
                    <div className="rounded-xl bg-slate-950 p-4 text-[10px] font-mono text-[#b5e4e2] shadow-inner overflow-x-auto">
                      <pre>{JSON.stringify({
                        status: "success",
                        timestamp: "2026-05-20T12:54:11Z",
                        count: 16,
                        products: products.slice(0, 2)
                      }, null, 2)}</pre>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`curl -X GET "https://ais-dev-ukwjulm4gr5nbmx75w2ouw-63325504403.asia-east1.run.app/api/products"`);
                      alert('cURL command copied securely to notebook cache!');
                    }}
                    className="w-full rounded-2xl bg-[#4c0519] py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800"
                  >
                    Copy API Request Command (cURL)
                  </button>
                </div>
              )}

              {/* Security Hub Content */}
              {activeFooterTab === 'security-hub' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50 text-center">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Tunnel Status</div>
                      <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">AES-GCM 256</span>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50 text-center">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-1">SSL Level</div>
                      <span className="text-xs font-black text-blue-600 tracking-widest uppercase">Verified Standard</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy">Cryptographic SHA-256 Signatures</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      All grocery delivery routes carry standard SHA authorization. Verify security block integrity instantly.
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="SHA_STABLE_3c49a1f2bdee9e32a68817"
                        className="flex-1 rounded-xl bg-slate-100 border border-slate-200 p-3 text-xs font-mono text-slate-600 focus:outline-none"
                      />
                      <button onClick={() => alert('Validation Protocol Succeeded. Block Integrity Signature: OK.')} className="rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-black uppercase tracking-widest">
                        Authorize Block
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Brand Assets Content */}
              {activeFooterTab === 'brand-assets' && (
                <div className="space-y-6">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Configure the operating colors of MART.OS branding and load vector logos in correct ratios.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex-1 rounded-2xl border border-slate-200 p-4 text-center">
                      <div className="h-12 w-full bg-header-gradient rounded-xl mb-3 shadow" />
                      <span className="font-bold text-xs text-brand-navy">Cosmic Slate Preset</span>
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 p-4 text-center">
                      <div className="h-12 w-full bg-footer-gradient rounded-xl mb-3 shadow" />
                      <span className="font-bold text-xs text-brand-navy">Terracotta Sunset Preset</span>
                    </div>
                  </div>
                  <button onClick={() => alert('MART.OS Vector Graphics packages compiled as .svg files in app resources. Mock download completed.')} className="w-full rounded-2xl bg-[#4c0519] py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                    Save Branding Assets ZIP
                  </button>
                </div>
              )}

              {/* Enterprise SOW Content */}
              {activeFooterTab === 'enterprise-sow' && (
                <div className="space-y-6">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed border-b border-slate-100 pb-4">
                    Statement of Work Cost Calculator. Tailor premium fulfillment metrics to forecast delivery expenditures.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">SLA Target</div>
                      <span className="text-lg font-black text-rose-950">12 Min Ultrafast</span>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 text-center">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Gross Contract Value</div>
                      <span className="text-lg font-black text-emerald-700">₹8,500/Mo</span>
                    </div>
                  </div>
                  <button onClick={() => alert('Drafting Enterprise SOW Proposal with SLA targets: 12-min dispatch, BKC HQ clusters. Check local workspace logs.')} className="w-full rounded-2xl bg-slate-900 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors shadow-lg active:scale-95 transition-transform">
                    Authorize & Export Enterprise SOW
                  </button>
                </div>
              )}

              {/* Protocol Tab Content */}
              {activeFooterTab === 'protocol' && (
                <div className="space-y-6 text-left">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Configure high-performance routing protocols for instant-delivery SLA, failsafe backup hubs, and secure payload encoding.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                    <span className="text-[10px] text-slate-400 font-sans font-black uppercase tracking-wider block">Select Active Dispatch Protocol Mode</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'standard', title: 'Standard Dispatch', desc: 'Symmetric load balancing over standard city roads & delivery vans.', color: 'border-slate-300 text-slate-700 bg-white' },
                        { id: 'multicast', title: 'Aggressive Multicast', desc: 'Activates priority drone paths & BKC hyper-cores. Sub-10 min SLA.', color: 'border-rose-450 text-rose-900 bg-rose-50/20' },
                        { id: 'redundant', title: 'Fail-Safe Redundant', desc: 'Bypasses high-congestion matrices automatically. Peak-hours defense.', color: 'border-sky-300 text-sky-900 bg-sky-50/20' }
                      ].map((mode) => {
                        const isSelected = protocolMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => {
                              setProtocolMode(mode.id);
                              setLogStream(prev => [
                                `[${new Date().toLocaleTimeString()}] PROTOCOL CHANGE: Shifted dispatch model to [${mode.title.toUpperCase()}]`,
                                ...prev
                              ]);
                            }}
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-[#c82a5c] ring-2 ring-[#c82a5c]/10 bg-rose-50/40' 
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-extrabold text-xs text-brand-navy block mb-1">{mode.title}</span>
                            <p className="text-[10px] text-slate-500 font-medium leading-normal">{mode.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy">Core Cryptographic System Secret Link</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This key authenticates high-priority fulfillment pipelines between central databases and dark store pickers. Enter customized salt parameters or sync live tags.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input 
                        type="text" 
                        value={protocolSecureKey}
                        onChange={(e) => setProtocolSecureKey(e.target.value)}
                        placeholder="System Security Key Salt"
                        className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-xs font-mono font-bold text-brand-navy focus:outline-none focus:border-[#c82a5c]"
                      />
                      <button 
                        onClick={() => {
                          alert(`Cryptographic Token Verified!\n\nSystem registered: ${protocolSecureKey}\nChecksum: SHAKE-256 Successful.`);
                          setLogStream(prev => [
                            `[${new Date().toLocaleTimeString()}] CRYPTO: Validated block integrity token [${protocolSecureKey}]`,
                            ...prev
                          ]);
                        }} 
                        className="rounded-xl bg-[#c82a5c] text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all cursor-pointer text-center"
                      >
                        Authorize & Bind Key
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-900 text-xs">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-black uppercase tracking-wide block mb-0.5">Sensitive Administrative Core</strong>
                      <p className="leading-relaxed font-semibold">Toggling these protocols overrides real-time dark store picker layouts. Changes propagate immediately to all active courier applications.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab Content */}
              {activeFooterTab === 'privacy' && (
                <div className="space-y-6 text-left">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Manage GDPR, CCPA, and Indian Digital Personal Data Protection (DPDP) standards. Your privacy rights are secured local-first on this browser session.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-brand-navy">Local Session Caching</span>
                        <input 
                          type="checkbox" 
                          checked={privacySessionCaching}
                          onChange={(e) => {
                            setPrivacySessionCaching(e.target.checked);
                            setLogStream(prev => [
                              `[${new Date().toLocaleTimeString()}] PRIVACY: Session memory cache toggled to [${e.target.checked}]`,
                              ...prev
                            ]);
                          }}
                          className="h-4 w-4 accent-[#c82a5c] cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Saves active cart selections, filters, and merchant configurations in local browser storage for high-availability launches.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-brand-navy">Regulations Standard</span>
                        <select 
                          value={privacyConsentStandard}
                          onChange={(e) => {
                            setPrivacyConsentStandard(e.target.value);
                            setLogStream(prev => [
                              `[${new Date().toLocaleTimeString()}] COMPLIANCE: Regulation compliance updated to standard [${e.target.value}]`,
                              ...prev
                            ]);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-brand-navy focus:outline-none cursor-pointer"
                        >
                          <option value="GDPR+CCPA">GDPR & CCPA Standard</option>
                          <option value="DPDP">India DPDP Framework 2023</option>
                          <option value="MINIMALST">Minimal Essential Only</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Determines physical localization requirements for transit order logging parameters across regional server caches.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-3xl border border-slate-150 bg-white space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy flex items-center gap-2">
                      <Fingerprint className="h-5 w-5 text-[#c82a5c]" />
                      Sovereign Digital Right Controls
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Under Indian DPDP / GDPR guidelines, you retain full ownership of your checkout telemetry. Purge transient session records, cart state, or active variables instantly.
                    </p>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          if (confirm('Are you absolutely sure you want to purge all active caching, cart lists, and custom grocery SKUs? This resets local-first browser state.')) {
                            localStorage.clear();
                            setLogStream(prev => [
                              `[${new Date().toLocaleTimeString()}] SYSTEM RESET: State purge requested.`,
                              ...prev
                            ]);
                            alert('Local storage memory purged! Reload the browser to clear residual context state.');
                          }
                        }}
                        className="flex-1 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-750 py-3 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Purge All Session data
                      </button>
                      <button 
                        onClick={() => {
                          alert(`Consent certificate created!\n\nStandard: ${privacyConsentStandard}\nIP Address: Local browser sandbox\nConsent status: Authorized`);
                        }}
                        className="flex-1 bg-slate-900 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-850 transition-colors cursor-pointer text-center"
                      >
                        Generate GDPR Consent Dec.
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nodes Tab Content */}
              {activeFooterTab === 'nodes' && (
                <div className="space-y-6 text-left">
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Monitor active distribution terminals, inventory nodes, and low-latency database servers routing orders and stocks.
                  </p>

                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <select 
                        value={nodeFilterCity} 
                        onChange={(e) => setNodeFilterCity(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-navy focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Regions</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Pune">Pune</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Filtering Live Clusters</span>
                    </div>

                    <div className="flex bg-[#8b163d]/10 text-[#c82a5c] rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold uppercase">
                      Network: 100% Sync
                    </div>
                  </div>

                  <div className="grid gap-3 max-h-64 overflow-y-auto pr-1">
                    {clusterNodes
                      .filter(node => nodeFilterCity === 'All' || node.city === nodeFilterCity)
                      .map((node) => (
                        <div key={node.id} className="border border-slate-150 rounded-2xl p-4 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-brand-navy">{node.name}</span>
                              <span className="text-[8.5px] font-mono bg-slate-200 font-bold px-1.5 py-0.5 rounded text-slate-600">{node.ip}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400">
                              Load: <strong className="text-brand-navy">{node.load}%</strong> • Latency: <strong className="text-brand-navy">{node.latency}ms</strong> • Logs: {node.txCount.toLocaleString()} orders
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] uppercase tracking-wider font-extrabold ${
                              node.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-105'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${node.status === 'Healthy' ? 'bg-emerald-505 animate-pulse rounded bg-emerald-500' : 'bg-amber-500 animate-bounce'}`} />
                              {node.status}
                            </span>

                            <button
                              onClick={() => {
                                const randLatency = Math.floor(Math.random() * 20) + 2;
                                setClusterNodes(prev => prev.map(n => n.id === node.id ? { ...n, latency: randLatency, txCount: n.txCount + 1 } : n));
                                setLogStream(prev => [
                                  `[${new Date().toLocaleTimeString()}] PING: Direct trace telemetry sent to [${node.ip}]. Roundtrip: ${randLatency}ms.`,
                                  ...prev
                                ]);
                              }}
                              className="bg-white hover:bg-slate-100 text-brand-navy border border-slate-200 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl cursor-pointer"
                            >
                              ⚡ Tracert
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        alert('Propagating emergency re-sync signal to all active node database caches.');
                        setClusterNodes(prev => prev.map(n => ({ ...n, latency: Math.max(2, n.latency - 1) })));
                        setLogStream(prev => [
                          `[${new Date().toLocaleTimeString()}] NODES RE-SYNC: Dispatched global multicast pulse to cluster.`,
                          ...prev
                        ]);
                      }}
                      className="flex-1 bg-slate-900 text-white rounded-xl py-3.5 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-pointer text-center"
                    >
                      🔄 Global Cluster Multicast Re-Sync
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Offers & Promo Code Modal */}
      <AnimatePresence>
        {isOffersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-55 bg-[#0f172a]/70 backdrop-blur-sm"
              onClick={() => setIsOffersOpen(false)}
            />
            <motion.div
              initial={{ y: '50px', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '50px', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-20 z-55 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c82a5c]">Promotional Engine</div>
                    <h3 className="text-xl font-black text-brand-navy tracking-tight">Available Offers & Deals</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOffersOpen(false)} 
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-500 leading-relaxed text-left">
                  Maximize your savings on MART.OS hyper-local fulfillment with direct codes. Copy or apply directly onto your cart session.
                </p>

                {/* Offer cards list */}
                <div className="space-y-3">
                  {[
                    { code: 'FAST15', title: '15% Off Total Groceries', desc: 'No minimum order required. Saves flat 15% of your subtotal sum.', badge: 'Popular Deal' },
                    { code: 'MART50', title: '₹50 Flat Discount', desc: 'Applicable on physical cart orders exceeding ₹300.', badge: 'Bulk Deal' },
                    { code: 'FREESHIP', title: 'Free Delivery Waiver', desc: 'Saves you the ₹20.00 logistics transit & dispatch fee completely.', badge: 'Zero Delivery' },
                    { code: 'WELCOME100', title: '₹100 New User Welcome', desc: 'Save ₹100 flat on high-volume baskets worth ₹500 or more.', badge: 'Exclusive Voucher' }
                  ].map((offer) => {
                    const isActive = appliedPromo === offer.code;
                    return (
                      <div 
                        key={offer.code} 
                        className={`relative rounded-2xl border-2 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 ${isActive ? 'bg-emerald-50/50 border-emerald-500 shadow-sm' : 'bg-slate-50/30 border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="space-y-1 max-w-[70%] text-left">
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {offer.badge}
                            </span>
                            {isActive && <span className="text-xs text-emerald-600 font-bold">Applied ✓</span>}
                          </div>
                          <h4 className="font-bold text-sm text-brand-navy">{offer.title}</h4>
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{offer.desc}</p>
                        </div>

                        <div className="flex sm:flex-col items-stretch gap-2 w-full sm:w-auto">
                          <div className="flex items-center justify-between sm:justify-center rounded-xl bg-slate-100 px-3 py-1.5 border border-dashed border-slate-300 font-mono text-xs font-black text-brand-navy tracking-widest text-center select-all cursor-pointer hover:bg-slate-200 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(offer.code);
                              alert(`Code ${offer.code} copied securely! Paste into checkout promo field.`);
                            }}
                            title="Click to copy code"
                          >
                            <span>{offer.code}</span>
                          </div>
                          <button
                            onClick={() => {
                              setAppliedPromo(offer.code);
                              const toastMsg = cart.length > 0 
                                ? `Coupon ${offer.code} applied! Your grand total is updated.`
                                : `Promo code ${offer.code} saved to active session. Complete your cart list to view your savings!`;
                              alert(toastMsg);
                              setIsOffersOpen(false);
                              if (cart.length > 0) {
                                setIsCartOpen(true);
                              }
                            }}
                            className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all text-center flex-1 sm:flex-none cursor-pointer ${isActive ? 'bg-emerald-600 text-white' : 'bg-brand-navy text-white hover:bg-slate-800'}`}
                          >
                            {isActive ? 'Applied' : 'Apply Deal'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Input Fields Section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-left">Exclusive Codes Entry</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter other custom code (e.g. WELCOME100)..." 
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        setPromoError(null);
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-navy"
                    />
                    <button 
                      onClick={() => {
                        const code = promoInput.trim();
                        if (!code) return;
                        const validCodes = ['FAST15', 'MART50', 'FREESHIP', 'WELCOME100'];
                        if (validCodes.includes(code)) {
                          setAppliedPromo(code);
                          setPromoError(null);
                          setPromoInput('');
                          alert(`Validation Verified! Active discount code "${code}" initialized for checkout.`);
                          setIsOffersOpen(false);
                          if (cart.length > 0) {
                            setIsCartOpen(true);
                          }
                        } else {
                          setPromoError('Unknown discount code key. Try one of the preloaded voucher blocks.');
                        }
                      }}
                      className="rounded-xl bg-[#4c0519] text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#c82a5c] active:scale-95 transition-all cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] font-semibold text-rose-600 mt-1 text-left">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-xs font-bold text-emerald-950">
                      <span>Currently Active: <span className="font-mono text-emerald-700 font-extrabold">{appliedPromo}</span></span>
                      <button 
                        onClick={() => {
                          setAppliedPromo(null);
                          alert('Promo removed. Restored standard gross margins.');
                        }}
                        className="text-[10px] text-rose-600 hover:text-rose-800 underline uppercase tracking-widest cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Customer Account & System-Wide Credentials Directory Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-55 bg-[#0f172a]/70 backdrop-blur-sm"
              onClick={() => setIsAuthModalOpen(false)}
            />
            <motion.div
              initial={{ y: '50px', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '50px', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-20 z-55 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600 border border-emerald-100">
                    <Fingerprint className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c82a5c]">Sovereign Identity</div>
                    <h3 className="text-xl font-black text-brand-navy tracking-tight">{userAuth.isLoggedIn ? "Consumer Profile Account" : "Identity Sign-In Gateway"}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAuthModalOpen(false)} 
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {userAuth.isLoggedIn ? (
                /* LOGGED IN ACCOUNT VIEWS */
                <div className="space-y-6">
                  {/* Profile info cards */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-left">
                    <div>
                      <h4 className="font-extrabold text-sm text-brand-navy">{userAuth.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1">{userAuth.email} • {userAuth.phone}</p>
                    </div>
                    <div className="bg-brand-green/20 text-brand-navy text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                      ★ Active session
                    </div>
                  </div>

                  {/* Wallet & Points balance panel */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 p-3 bg-white text-left space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Wallet Funds</span>
                      <div className="font-mono text-xl font-black text-brand-navy">₹{userAuth.walletBalance.toFixed(2)}</div>
                      {/* Flex direct load panel */}
                      <div className="flex gap-1.5 mt-2">
                        <button 
                          onClick={() => {
                            setUserAuth(prev => ({ ...prev, walletBalance: prev.walletBalance + 500 }));
                            alert("₹500.00 topped up directly! Your transaction ledger is securely updated.");
                          }}
                          className="flex-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-1 text-[8.5px] font-black uppercase transition-all cursor-pointer text-center"
                        >
                          + ₹500
                        </button>
                        <button 
                          onClick={() => {
                            setUserAuth(prev => ({ ...prev, walletBalance: prev.walletBalance + 1000 }));
                            alert("₹1,000.00 topped up directly! Your transaction ledger is securely updated.");
                          }}
                          className="flex-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-1 text-[8.5px] font-black uppercase transition-all cursor-pointer text-center"
                        >
                          + ₹1K
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-3 bg-white text-left space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-bold">Loyalty Points</span>
                      <div className="font-mono text-xl font-black text-[#c82a5c]">{userAuth.loyaltyPoints} PTS</div>
                      <div className="text-[9px] text-[#c82a5c] font-bold uppercase tracking-wider mt-2.5">★ Platinum Tier Status</div>
                    </div>
                  </div>

                  {/* Quick features & referrals */}
                  <div className="border border-indigo-100 bg-indigo-50/20 p-4 rounded-2xl flex justify-between items-center text-left">
                    <div className="space-y-0.5">
                      <span className="text-[8px] text-indigo-500 font-black uppercase tracking-widest">Active Invite Code</span>
                      <div className="font-mono text-xs font-black text-indigo-900">{userAuth.referralCode}</div>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(userAuth.referralCode);
                        alert("Referral code copied successfully! Gift ₹250 to your buddies.");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all"
                    >
                      Copy Invite
                    </button>
                  </div>
                  
                  {/* Log out option */}
                  <div className="text-right">
                    <button 
                      onClick={() => {
                        setUserAuth(prev => ({ ...prev, isLoggedIn: false }));
                        alert("User session logged out successfully!");
                      }} 
                      className="text-[9px] text-rose-600 font-black tracking-widest uppercase hover:underline cursor-pointer"
                    >
                      Logout Consumer Profile
                    </button>
                  </div>
                </div>
              ) : (
                /* LOGGED OUT USER / SIGN IN PROCESS */
                <div className="space-y-6 text-left">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-brand-navy uppercase text-left">Authenticate Phone Instance</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold text-left">Enter your phone code. We will simulate an instant 12-second OTP bypass handshake.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Mobile Contact Phone</span>
                      <div className="flex gap-2">
                        <input 
                          type="tel" 
                          placeholder="+91 98200 12345"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#c82a5c]"
                        />
                        <button 
                          onClick={() => {
                            if (!phoneInput) {
                              alert("Please enter phone number first!");
                              return;
                            }
                            setOtpSent(true);
                            alert(`Bypass: Test Authentication OTP generated!\n\nOTP Code: "1234" sent to ${phoneInput}.`);
                          }} 
                          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Send OTP
                        </button>
                      </div>
                    </div>

                    {otpSent && (
                      <div>
                        <span className="text-[9px] font-black uppercase text-[#c82a5c] block mb-1 animate-pulse">Enter 4-Digit Verification Code</span>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. 1234"
                            maxLength={4}
                            value={otpVal}
                            onChange={(e) => setOtpVal(e.target.value)}
                            className="flex-1 rounded-xl bg-[#c82a5c]/5 border border-[#c82a5c]/20 px-3.5 py-2.5 text-xs font-mono font-black text-brand-navy focus:outline-none"
                          />
                          <button 
                            onClick={() => {
                              if (otpVal !== '1234') {
                                alert("Invalid demo passcode! Type '1234' to verify.");
                                return;
                              }
                              setUserAuth({
                                isLoggedIn: true,
                                name: "Rajesh Kumar",
                                email: "rajesh.kumar@mumbai.io",
                                phone: phoneInput || "+91 98200 12345",
                                walletBalance: 1450.00,
                                loyaltyPoints: 360,
                                referralCode: "MART-MUM-982"
                              });
                              setOtpSent(false);
                              setOtpVal('');
                              alert("User verified successfully using phone telemetry! Connected to Mumbai instance.");
                            }} 
                            className="rounded-xl bg-[#c82a5c] text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all cursor-pointer"
                          >
                            Verify & Enter
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick Autofill login */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left">
                      <div className="text-left space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-slate-400 block">Demonstration Quick Sign-in</span>
                        <p className="text-[10px] font-mono font-bold text-slate-600">No input needed: +91 98200 12345 (OTP: 1234)</p>
                      </div>
                      <button 
                        onClick={() => {
                          setUserAuth({
                            isLoggedIn: true,
                            name: "Rajesh Kumar",
                            email: "rajesh.kumar@mumbai.io",
                            phone: "+91 98200 12345",
                            walletBalance: 1450.00,
                            loyaltyPoints: 360,
                            referralCode: "MART-MUM-982"
                          });
                          alert("Demo Profile signed in securely!");
                        }}
                        className="rounded-lg bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1.5 text-[8px] font-black tracking-widest uppercase text-emerald-800 transition-colors cursor-pointer"
                      >
                        ⚡ Autofill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM CREDENTIALS DIRECTORY OF EACH PANEL */}
              <div className="border-t border-slate-100 pt-6 mt-6 text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#c82a5c] block mb-3">
                  🔑 SYSTEM CREDENTIALS DIRECTORY (ALL PANELS)
                </span>
                <p className="text-[10px] text-slate-550 font-semibold mb-4 leading-relaxed">
                  Easily switch panels, authenticate identities, or access restricted layers using the credentials below:
                </p>

                <div className="space-y-3.5">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase text-brand-navy">1. Consumer Shop & Checkout</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Phone: <strong className="font-mono text-slate-800">+91 98200 12345</strong> • Passcode (OTP): <strong className="font-mono text-[#c82a5c] bg-rose-50 px-1 py-0.5 rounded">1234</strong>
                    </p>
                    <button 
                      onClick={() => {
                        setUserAuth({
                          isLoggedIn: true,
                          name: "Rajesh Kumar",
                          email: "rajesh.kumar@mumbai.io",
                          phone: "+91 98200 12345",
                          walletBalance: 1450.00,
                          loyaltyPoints: 360,
                          referralCode: "MART-MUM-982"
                        });
                        alert("Customer Profile authenticated successfully!");
                      }} 
                      className="absolute right-2.5 top-2.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[8px] font-bold px-2 py-1 uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Bypass
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-black uppercase text-brand-navy">2. Courier/Rider App Portal</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Rider ID: <strong className="font-mono text-slate-800">RIDER-881</strong> • Password (Passcode): <strong className="font-mono text-[#c82a5c] bg-rose-50 px-1 py-0.5 rounded">12345</strong>
                    </p>
                    <button 
                      onClick={() => {
                        setRiderAuth(prev => ({ ...prev, isLoggedIn: true, username: "RIDER-881" }));
                        setView('admin');
                        setAdminTab('delivery');
                        setIsAuthModalOpen(false);
                        alert("Rider Dashboard logged in successfully! Directing there.");
                      }} 
                      className="absolute right-2.5 top-2.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[8px] font-bold px-2 py-1 uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Bypass
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span className="text-[9px] font-black uppercase text-brand-navy">3. Staples-Farm Vendor Terminal</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Authorized Code: <strong className="font-mono text-slate-800">VEND-BOMBAYAGRO</strong>
                    </p>
                    <button 
                      onClick={() => {
                        setVendorAuthCode("VEND-BOMBAYAGRO");
                        setView('admin');
                        setAdminTab('vendor');
                        setIsAuthModalOpen(false);
                        alert("Vendor Dashboard configured successfully! Directing there.");
                      }} 
                      className="absolute right-2.5 top-2.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[8px] font-bold px-2 py-1 uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Bypass
                    </button>
                  </div>

                  <div className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[9px] font-black uppercase text-brand-navy">4. Operator Panel (S.Admin, Corporate, etc.)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Simply toggle top active access buttons inside Operator view <strong>(No credentials required)</strong>
                    </p>
                    <button 
                      onClick={() => {
                        setView('admin');
                        setActiveRole('Super Admin');
                        setIsAuthModalOpen(false);
                        alert("Role changed to Super Admin! Directing to full-access Operator panel.");
                      }} 
                      className="absolute right-2.5 top-2.5 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[8px] font-bold px-2 py-1 uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      Bypass
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{getTranslation("Cart Manifest", language)}</div>
                    <h2 className="text-xl font-black tracking-tight text-brand-navy">{getTranslation("Order Summary", language)}</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="rounded-lg p-2 hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                      <ShoppingBasket className="h-16 w-16 mb-6 text-slate-200" />
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{getTranslation("Payload: Null", language)}</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-4 rounded-3xl border border-slate-100 p-4 bg-slate-50/50">
                        <img src={item.image} className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
                        <div className="flex flex-1 flex-col">
                          <h4 className="text-sm font-bold text-brand-navy">{getTranslatedProductName(item.name, language)}</h4>
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
                  {/* Cart Promo Input and Active status */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <span>Voucher / Code</span>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          setIsOffersOpen(true);
                        }}
                        className="text-[#c82a5c] hover:underline cursor-pointer font-bold"
                      >
                        Offers list
                      </button>
                    </div>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-950">
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3 w-3 text-emerald-600" />
                          <span>Code <span className="font-mono">{appliedPromo}</span></span>
                        </div>
                        <button 
                          onClick={() => {
                            setAppliedPromo(null);
                          }}
                          className="text-[9px] uppercase font-black text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. FAST15" 
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-navy"
                        />
                        <button 
                          onClick={() => {
                            const code = promoInput.trim();
                            const valids = ['FAST15', 'MART50', 'FREESHIP', 'WELCOME100'];
                            if (valids.includes(code)) {
                              setAppliedPromo(code);
                              setPromoInput('');
                              alert(`Validated! Code "${code}" applied successfully.`);
                            } else {
                              alert('Unknown promotional code key. Click "Offers list" for valid codes.');
                            }
                          }}
                          className="rounded-xl bg-brand-navy px-3 text-xs font-bold text-white uppercase hover:bg-slate-800 cursor-pointer"
                        >
                          {getTranslation("Apply", language)}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>{getTranslation("Subtotal", language)}</span>
                      <span className="text-brand-navy">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-emerald-600">
                        <span>{language === 'hi' ? 'विशेष छूट' : language === 'mr' ? 'खास सवलत' : 'Discount'} ({appliedPromo})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>{getTranslation("Delivery Fee", language)}</span>
                      <span className="text-brand-navy">
                        {cart.length > 0 ? (
                          shippingFee === 0 ? <span className="text-emerald-600 font-black">{language === 'hi' ? 'मुफ़्त' : language === 'mr' ? 'मोफत' : 'FREE'}</span> : `₹${shippingFee.toFixed(2)}`
                        ) : '₹0.00'}
                      </span>
                    </div>
                    
                    {/* Notice if minimum threshold for MART50 / WELCOME100 is not met */}
                    {appliedPromo === 'MART50' && subtotal < 300 && (
                      <div className="rounded-lg bg-orange-50 p-2 text-[9px] font-bold text-orange-700 leading-normal uppercase text-left">
                        {language === 'hi' 
                          ? `₹५० की छूट पाने के लिए ₹${(300 - subtotal).toFixed(2)} का सामान और जोड़ें।` 
                          : language === 'mr'
                          ? `₹५० ची सवलत मिळवण्यासाठी आणखी ₹${(300 - subtotal).toFixed(2)} चा माल जोडा.`
                          : `Add ₹${(300 - subtotal).toFixed(2)} more to trigger ₹50 discount.`}
                      </div>
                    )}
                    {appliedPromo === 'WELCOME100' && subtotal < 500 && (
                      <div className="rounded-lg bg-orange-50 p-2 text-[9px] font-bold text-orange-700 leading-normal uppercase text-left">
                        {language === 'hi'
                          ? `₹१०० की छूट पाने के लिए ₹${(500 - subtotal).toFixed(2)} का सामान और जोड़ें।`
                          : language === 'mr'
                          ? `₹१०० ची सवलत मिळवण्यासाठी आणखी ₹${(500 - subtotal).toFixed(2)} चा माल जोडा.`
                          : `Add ₹${(500 - subtotal).toFixed(2)} more to trigger ₹100 discount.`}
                      </div>
                    )}

                    {/* Simulated Payment Selector */}
                    <div className="space-y-2 border-t border-slate-200/50 pt-3">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 text-left">
                        {language === 'hi' ? 'भुगतान एवं निस्तारण' : language === 'mr' ? 'पेमेंट आणि सेटलमेंट' : 'Fulfillment Settlement Protocol'}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'wallet', name: language === 'hi' ? 'डिजिटल वॉलेट' : language === 'mr' ? 'डिजिटल वॉलेट' : 'Digital Wallet', balanceText: `₹${userAuth.walletBalance.toFixed(2)}` },
                          { id: 'card', name: language === 'hi' ? 'कार्ड / यूपीआई' : language === 'mr' ? 'कार्ड / यूपीआय' : 'Cards / UPI', balanceText: language === 'hi' ? 'सुरक्षित' : language === 'mr' ? 'सुरक्षित' : 'Secure Gateway' },
                          { id: 'cod', name: language === 'hi' ? 'कैश ऑन डिलीवरी' : language === 'mr' ? 'कॅश ऑन डिलिव्हरी' : 'POD / Cash', balanceText: language === 'hi' ? 'घर पहुंच भुगतान' : language === 'mr' ? 'घरी पैसे देणे' : 'Standard COD' }
                        ].map((p) => {
                          const isSel = payMethod === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setPayMethod(p.id as any)}
                              className={`rounded-xl border p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isSel ? 'border-brand-green bg-emerald-50/20 text-[#c82a5c]' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-wide">{p.name}</span>
                              <span className="text-[8px] font-bold opacity-75">{p.balanceText}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-slate-200 pt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{getTranslation("Grand Total", language)}</span>
                      <span className="text-3xl font-black tracking-tighter text-brand-navy">
                        ₹{(cart.length > 0 ? finalTotal : 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button 
                    disabled={cart.length === 0 || isOrdering}
                    onClick={() => checkout(payMethod)}
                    className="group w-full rounded-2xl bg-brand-green py-5 text-xs font-black uppercase tracking-[0.2em] text-brand-navy shadow-xl shadow-green-200/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isOrdering 
                      ? (language === 'hi' ? 'ऑर्डर की पुष्टि हो रही है...' : language === 'mr' ? 'ऑर्डरची पडताळणी...' : 'CONFIRMING ORDER...') 
                      : (language === 'hi' ? 'सुरक्षित भुगतान करें' : language === 'mr' ? 'सुरक्षित पेमेंट करा' : 'INITIATE SECURE CHECKOUT')
                    }
                    {!isOrdering && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        </>
      )}
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

