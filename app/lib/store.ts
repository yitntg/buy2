import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Coupon } from './types';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  user_id: number;
  product: Product;
}

export interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getCartTotal: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      
      addToCart: (product, quantity = 1) =>
        set((state) => {
          // 检查库存
          const availableStock = product.stock_quantity;
          
          // 检查是否已经在购物车中
          const existingItem = state.items.find(item => item.product_id === product.id);
          
          if (existingItem) {
            // 如果已经在购物车中，检查增加数量后是否超过库存
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > availableStock) {
              console.warn('Cannot add more items than available stock');
              return state;
            }
            
            // 更新数量
            return {
              items: state.items.map(item =>
                item.product_id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            };
          } else {
            // 如果是新商品，检查数量是否超过库存
            if (quantity > availableStock) {
              console.warn('Cannot add more items than available stock');
              return state;
            }
            
            // 添加新商品
            const newItem: CartItem = {
              id: Date.now(), // 使用时间戳作为临时ID
              product_id: product.id,
              quantity,
              user_id: 1, // 这里应该使用实际的用户ID
              product
            };
            
            return {
              items: [...state.items, newItem]
            };
          }
        }),
      
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter(item => item.product_id !== productId)
        })),
      
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find(item => item.product_id === productId);
          if (!item) return state;
          
          // 检查库存
          const availableStock = item.product.stock_quantity;
          if (quantity > availableStock) {
            console.warn('Cannot update quantity to more than available stock');
            return state;
          }
          
          return {
            items: state.items.map(item =>
              item.product_id === productId
                ? { ...item, quantity }
                : item
            )
          };
        }),
      
      clearCart: () => set({ items: [], coupon: null }),
      
      applyCoupon: (coupon) => set({ coupon }),
      
      removeCoupon: () => set({ coupon: null }),
      
      getCartTotal: () => {
        const { items, coupon } = get();
        
        const subtotal = items.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity, 
          0
        );
        
        // 根据不同优惠券类型计算折扣
        let discount = 0;
        if (coupon) {
          if (coupon.discount_type === 'percentage') {
            discount = subtotal * (coupon.discount_value / 100);
          } else if (coupon.discount_type === 'fixed') {
            discount = Math.min(coupon.discount_value, subtotal); // 不能超过小计
          }
        }
        
        // 运费计算逻辑（简化）
        const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 15) : 0;
        
        const total = subtotal + shipping - discount;
        
        return {
          subtotal,
          discount,
          shipping,
          total
        };
      }
    }),
    {
      name: 'cart-storage', // localStorage 的键名
    }
  )
);

// 收藏夹存储
export interface WishlistItem {
  id: string;
  product_id: number;
  user_id: string;
  product: Product;
}

export interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      
      addToWishlist: (product) =>
        set((state) => {
          // 检查是否已经在收藏夹中
          if (state.items.some(item => item.product_id === product.id)) {
            return state;
          }
          
          const newItem: WishlistItem = {
            id: Math.random().toString(36).substr(2, 9),
            product_id: product.id,
            user_id: 'current-user', // 这里应该使用实际的用户ID
            product
          };
          
          return {
            items: [...state.items, newItem]
          };
        }),
      
      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter(item => item.product_id !== productId)
        })),
      
      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'wishlist-storage', // localStorage 的键名
    }
  )
); 