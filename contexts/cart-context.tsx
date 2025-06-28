"use client"

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react"
import { useLanguageSettings } from "@/hooks/use-settings-store"

export interface CartItem {
  id: string; // e.g., 'mirtilo-125g' or 'mirtilo-granel'
  name: string;
  price: number; // price for the unit (or per kg)
  quantity: number;
  image: string;
  size?: string; // e.g., '125g'
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { t } = useLanguageSettings();

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = item.size ? `mirtilo-${item.size}` : `mirtilo-granel`;
    
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
      return [...prevItems, { ...item, id, name: translatedName }];
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
  }), [cartItems]);

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