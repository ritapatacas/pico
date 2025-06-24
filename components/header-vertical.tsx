"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ShoppingCart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import CartDrawer from "@/components/CartDrawer";
import { useCartDrawer } from "@/contexts/cart-drawer-context";

export function VerticalHeader() {
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ top: "0px", height: "0px" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    { label: "o quê", href: "/what" },
    { label: "onde", href: "/onde" },
    { label: "comprar", href: "/comprar" },
  ];

  

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetTop, offsetHeight } = hoveredElement;
        setHoverStyle({
          top: `${offsetTop}px`,
          height: `${offsetHeight}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetTop, offsetHeight } = activeElement;
      setActiveStyle({
        top: `${offsetTop}px`,
        height: `${offsetHeight}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const firstTab = tabRefs.current[0];
      if (firstTab) {
        const { offsetTop, offsetHeight } = firstTab;
        setActiveStyle({
          top: `${offsetTop}px`,
          height: `${offsetHeight}px`,
        });
      }
    });
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="fixed top-0 right-0 h-full w-24 flex flex-col justify-between px-6 py-6 bg-white shadow-md z-50">
      {/* Top icons - carrinho e dark mode */}
      <div className="flex">
        <div className="flex flex-col justify-end space-x-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative "
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Abrir carrinho</span>
          </Button>
        </div>
      </div>


      {/* Logotipo no fundo, rotacionado */}
      <div className="flex justify-center items-end w-full mt-auto space-x-4">
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 right-4 bg-white shadow-lg rounded-md py-4 px-6 flex flex-col space-y-4 animate-fade-in z-50 md:hidden">
          {tabs.map((tab) => {
            let href = "/";
            switch (tab.toLowerCase()) {
              case "quem":
                href = "/";
                break;
              case "o quê":
                href = "/what";
                break;
              case "como":
                href = "/how";
                break;
              case "onde":
                href = "/onde";
                break;
              case "comprar":
                href = "/comprar";
                break;
              default:
                href = "/";
            }

            return (
              <a
                key={tab}
                href={href}
                className="hover:underline text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                {tab}
              </a>
            );
          })}
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
