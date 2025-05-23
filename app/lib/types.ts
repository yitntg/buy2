export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_id: string;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  type?: 'image' | 'video';  // 媒体类型
  format?: string;  // 文件格式，如jpg、png、mp4等
  width?: number;
  height?: number;
  duration?: number;  // 视频时长（秒）
  thumbnail_url?: string;  // 视频缩略图
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  user_id: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  is_active: boolean;
}

export interface Address {
  id: string;
  user_id: string;
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
  id: string;
  name: string;
  icon: string;
  description: string;
} 