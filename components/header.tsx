"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import VercelTabs from "@/components/VercelTabs"
import { useCartDrawer } from "@/contexts/cart-drawer-context"

export function Header({ isHomePage = false }: { isHomePage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const { isCartOpen } = useCartDrawer();

  const tabs = [
    { label: "o quê", href: "/what" },
    { label: "comprar", href: "/comprar" },
  ];

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const bgClass = isHomePage
    ? scrolled
      ? "bg-white/90 backdrop-blur-md"
      : "bg-white/0 backdrop-blur-0"
    : "bg-white shadow-md";

  return (
    <header
      className={`sticky top-0 flex items-center justify-between px-2 md:px-6 z-30 transition-all duration-300 ${bgClass}`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Image
            className="dark:invert"
            src="/PICODAROSA_logo.png"
            alt="PICO DA ROSA logo"
            width={100}
            height={30}
            priority
          />
        </Link>
        <Link href="/">
          <Image
            className="dark:invert hidden sm:block"
            src="/PICODAROSA_text-img.png"
            alt="PICO DA ROSA text logo"
            width={160}
            height={35}
            priority
          />
        </Link>
      </div>

      {/* desktop menu*/}
      <nav className="hidden md:block">
        <VercelTabs tabs={tabs} />
      </nav>

      {/* cart sidebar*/}
      {/* <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </header>
  );
}

