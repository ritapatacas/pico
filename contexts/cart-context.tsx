"use client"

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from "react"
import { useLanguageSettings } from "@/hooks/use-settings-store"

export interface CartItem {
  id: string; // e.g., 'mirtilo-125g' or 'mirtilo-granel'
  name: string;
  price: number; // price for the unit (or per kg)
  quantity: number;
  image: string;
  size?: string; // e.g., '125g'
  product_key?: string; // e.g., 'BLU_125', 'BLU_1000'
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'picodarosa_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { t } = useLanguageSettings();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Check if cart items have product_key field, if not, clear the cart
        const hasProductKeys = parsedCart.every((item: any) => item.product_key);
        if (!hasProductKeys) {
          console.log('Clearing old cart without product keys');
          localStorage.removeItem(CART_STORAGE_KEY);
          setCartItems([]);
        } else {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = item.size ? `mirtilo-${item.size}` : `mirtilo-granel`;
    
    console.log('Adding item to cart:', item);
    
    // Translate the product name based on the current language
    let translatedName = item.name;
    if (item.name.includes('Mirtilos')) {
      if (item.size) {
        translatedName = `${t("product.blueberries")} (${item.size})`;
      } else {
        translatedName = `${t("product.blueberries")} ${t("product.bulk")}`;
      }
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(i =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      // If item doesn't exist, add it to the cart
      const newItem = { ...item, id, name: translatedName };
      console.log('New cart item:', newItem);
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
    // Also clear from localStorage
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };
  
  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + (item.size ? item.quantity : 1), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cartItems, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 