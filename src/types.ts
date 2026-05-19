export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  location: { lat: number; lng: number };
  deliveryRadius: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  unit: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  branchId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
}

export interface AdminStats {
  totalSales: number;
  todayOrders: number;
  pendingOrders: number;
  branchPerformance: { name: string; sales: number }[];
}
