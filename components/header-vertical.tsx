"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Moon, Sun, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";
import PaymentStep from "./PaymentStep";
import Link from "next/link";

export function VerticalHeader() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleToggleCart = () => {
    if (!isCartOpen) {
      setStep('cart');
    }
    setIsCartOpen((prev) => !prev);
  };

  // Sidebar dinâmica
  const sidebarOpen = isMenuOpen || isCartOpen;
  const sidebarWidth = sidebarOpen
    ? 'w-full md:w-[60vw] lg:w-[40vw] xl:w-[30vw]'
    : 'w-32';

  return (
    <header
      className={`h-screen sticky top-0 flex flex-col justify-between bg-white shadow-lg z-80 transition-all duration-300 ease-in-out`}
    >
      <div className={`content flex flex-col h-full ${sidebarWidth} bg-red-100`}>
        <div className="flex-1 flex flex-col min-h-5">
          {/* Top icons */}
          <div className={`flex flex-col w-full space-y-2 md:space-y-4 border-b border-gray-200 items-start px-4 md:px-6`}>
            {/* Hamburger */}
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="mb-2 mt-4 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            {/* Dark Mode */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={handleToggleCart}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          {/* Content */}
          {sidebarOpen && (
            <div className="flex-1 flex flex-col overflow-y-auto p-4">
              {/* Chevron */}
              <Button
                variant="ghost"
                size="icon"
                className="self-end mb-4"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsCartOpen(false);
                }}
                aria-label="Fechar sidebar"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Checkout */}
              {isCartOpen && (
                <>
                  <h2 className="text-xl font-bold mb-4 capitalize">
                    {step === 'cart' ? 'Carrinho' : step === 'checkout' ? 'Checkout' : 'Pagamento'}
                  </h2>
                  <div className="flex-1 flex flex-col">
                    {/* {step === 'cart' && <CartStep onNext={() => setStep('checkout')} />} */}
                    {/* {step === 'checkout' && <CheckoutStep onNext={() => setStep('payment')} onBack={() => setStep('cart')} />} */}
                    {/* {step === 'payment' && <PaymentStep onBack={() => setStep('checkout')} />} */}
                    <p>Cart content placeholder</p>
                  </div>
                </>
              )}

              {/* Menu */}
              {isMenuOpen && (
                <>
                  <h2 className="text-xl font-bold mb-4">Menu</h2>
                  <nav className="flex flex-col gap-4">
                    {/* {step === 'cart' && <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Início</Link>} */}
                    {/* {step === 'checkout' && <Link href="/product" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Produtos</Link>} */}
                    {/* {step === 'payment' && <Link href="/sobre" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Sobre</Link>} */}
                    {/* {step === 'payment' && <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Definições</Link>} */}
                    <p>Menu content placeholder</p>
                  </nav>
                </>
              )}
            </div>
          )}
        </div>
        {/* Logo */}
        <div className="flex justify-start items-end pl-2 pt-10 pb-6 mt-auto md:pt-0">
          <Image
            className="dark:invert"
            src="/PICODAROSA_logo.png"
            alt="PICO DA ROSA logo"
            width={72}
            height={22}
            priority
            style={{ transform: "rotate(-90deg)", minWidth: 72, maxWidth: 72 }}
          />
        </div>
      </div>
    </header>
  );
}
