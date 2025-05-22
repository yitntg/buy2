import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Coupon } from './types';

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
          
          const existingItem = state.items.find(item => item.product_id === product.id);
          
          if (existingItem) {
            // 确保不超过库存
            const newQuantity = Math.min(existingItem.quantity + quantity, availableStock);
            
            return {
              items: state.items.map(item => 
                item.product_id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }
          
          const newQuantity = Math.min(quantity, availableStock);
          
          return {
            items: [
              ...state.items,
              {
                id: Math.random().toString(36).substring(2, 9), // 临时ID
                product_id: product.id,
                quantity: newQuantity,
                user_id: '', // 临时用户ID，实际应该从身份验证获取
                product,
              },
            ],
          };
        }),
      
      removeFromCart: (id) => 
        set((state) => ({
          items: state.items.filter(item => item.product_id !== id),
        })),
      
      updateQuantity: (id, quantity) => 
        set((state) => {
          const item = state.items.find(item => item.product_id === id);
          if (!item) return state;
          
          // 确保数量不超过库存
          const availableStock = item.product?.stock_quantity || 1;
          const newQuantity = Math.min(Math.max(1, quantity), availableStock);
          
          return {
            items: state.items.map(item => 
              item.product_id === id
                ? { ...item, quantity: newQuantity }
                : item
            ),
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
          if (coupon.type === 'percentage') {
            discount = subtotal * (coupon.value / 100);
          } else if (coupon.type === 'fixed') {
            discount = Math.min(coupon.value, subtotal); // 不能超过小计
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

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      addToWishlist: (product) => 
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return state;
          }
          
          return {
            items: [...state.items, product],
          };
        }),
      
      removeFromWishlist: (id) => 
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        })),
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage', // localStorage 的键名
    }
  )
); 