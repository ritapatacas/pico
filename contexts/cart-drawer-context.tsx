"use client";
import { createContext, useContext, useState } from "react";

type CartDrawerContextType = {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <CartDrawerContext.Provider value={{ isCartOpen, setIsCartOpen }}>
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error("useCartDrawer must be used within CartDrawerProvider");
  return ctx;
} 