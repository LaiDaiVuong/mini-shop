export interface ProductSpecs {
  brand: string;
  model: string;
  material: string;
  sound?: string;
  fuel?: string;
  origin?: string;
  warranty?: string;
  volume?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  price: string;
  priceNum: number;
  badge?: string;
  img: string;
  desc: string;
  specs: ProductSpecs;
}

export interface CartItem {
  id: string;
  name: string;
  priceNum: number;
  priceFormatted?: string;
  img: string;
  quantity: number;
  categoryName?: string;
}

export interface OrderCustomerInfo {
  fullname: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  district?: string;
  notes?: string;
  paymentMethod: 'bank_transfer' | 'cod';
}

export interface Order {
  id: string;
  createdAt: string;
  customerInfo: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
}

export interface User {
  id?: string;
  email: string;
  fullname: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt?: string;
  status?: 'active' | 'locked';
  spent?: number;
  spentFormatted?: string;
  password?: string;
}
