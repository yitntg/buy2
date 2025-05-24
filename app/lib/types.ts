export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  category: number;
  inventory: number;
  rating: number;
  reviews: number;
  created_at: Date;
  updated_at: Date;
  brand: string;
  model: string;
  specifications: string;
  free_shipping: boolean;
  returnable: boolean;
  warranty: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  thumbnail_url?: string;
  type: 'image' | 'video';
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  user_id: number;
  product: Product;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  user_id: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street_address: string;
  postal_code: string;
  is_default: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
  description: string;
} 