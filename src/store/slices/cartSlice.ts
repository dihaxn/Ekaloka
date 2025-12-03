import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  availableStock: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
};

// Helper functions
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        // Ensure quantity doesn't exceed available stock
        if (existingItem.quantity > existingItem.availableStock) {
          existingItem.quantity = existingItem.availableStock;
        }
      } else {
        state.items.push(action.payload);
      }
      
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },
    
    updateItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      
      if (item) {
        const newQuantity = Math.max(0, Math.min(action.payload.quantity, item.availableStock));
        item.quantity = newQuantity;
        
        // Remove item if quantity is 0
        if (newQuantity === 0) {
          state.items = state.items.filter(item => item.productId !== action.payload.productId);
        }
        
        state.total = calculateTotal(state.items);
        state.itemCount = calculateItemCount(state.items);
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    
    updateItemStock: (state, action: PayloadAction<{ productId: string; availableStock: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId);
      
      if (item) {
        item.availableStock = action.payload.availableStock;
        
        // Adjust quantity if it exceeds new stock
        if (item.quantity > item.availableStock) {
          item.quantity = item.availableStock;
        }
        
        state.total = calculateTotal(state.items);
        state.itemCount = calculateItemCount(state.items);
      }
    },
    
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  updateItemStock,
  setCartItems,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

// Export selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartItemCount = (state: { cart: CartState }) => state.cart.itemCount;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

// Export reducer
export default cartSlice.reducer;
