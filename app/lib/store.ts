import { create } from 'zustand';
import { CartItem, Product } from './types';

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (product, quantity = 1) => 
    set((state) => {
      const existingItem = state.items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return {
        items: [
          ...state.items,
          {
            id: Math.random().toString(36).substring(2, 9), // 临时ID
            product_id: product.id,
            quantity,
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
    set((state) => ({
      items: state.items.map(item => 
        item.product_id === id
          ? { ...item, quantity }
          : item
      ),
    })),
  
  clearCart: () => set({ items: [] }),
}));

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
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
})); 