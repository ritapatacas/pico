"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useCartDrawer } from "@/contexts/cart-drawer-context";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";
import PaymentStep from "./PaymentStep";

export function VerticalHeader() {
  const { cartCount } = useCart();
  const { isCartOpen, setIsCartOpen } = useCartDrawer();
  const [step, setStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleToggleCart = () => {
    // Reset to cart step whenever opening from a closed state
    if (!isCartOpen) {
      setStep('cart');
    }
    setIsCartOpen(!isCartOpen);
  };

  return (
    <header
      className={`h-screen sticky top-0 flex flex-col justify-between bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${
        isCartOpen ? 'w-[420px]' : 'w-24'
      }`}
    >
      {/* Top section with icons and dynamic content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Always visible icons */}
        <div className="flex flex-col items-center space-y-4 p-6 border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={handleToggleCart}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Cart/Checkout/Payment Steps */}
        {isCartOpen && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4">
            <h2 className="text-xl font-bold mb-4 capitalize">
              {step === 'cart' ? 'Carrinho' : step === 'checkout' ? 'Checkout' : 'Pagamento'}
            </h2>
            <div className="flex-1 flex flex-col">
              {step === 'cart' && <CartStep onNext={() => setStep('checkout')} />}
              {step === 'checkout' && <CheckoutStep onNext={() => setStep('payment')} onBack={() => setStep('cart')} />}
              {step === 'payment' && <PaymentStep onBack={() => setStep('checkout')} />}
            </div>
          </div>
        )}
      </div>

      {/* Always visible logo at the bottom */}
      <div className="flex justify-center items-end p-6 mt-auto">
        <Image
          className="dark:invert"
          src="/PICODAROSA_logo.png"
          alt="PICO DA ROSA logo"
          width={100}
          height={30}
          priority
          style={{ transform: "rotate(-90deg)" }}
        />
      </div>
    </header>
  );
}
