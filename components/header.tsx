"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import VercelTabs from "@/components/VercelTabs"
import { useCartDrawer } from "@/contexts/cart-drawer-context"
import { useLanguageSettings } from "@/hooks/use-settings-store"

export function Header({ isHomePage = false }: { isHomePage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const { isCartOpen } = useCartDrawer();
  const { t, language } = useLanguageSettings();

  const tabs = [
    { label: t("navigation.about"), href: "/sobre" },
    { label: t("navigation.products"), href: "/products" },
  ];

  // Debug: log quando as traduções mudam
  useEffect(() => {
    console.log('Header - Idioma:', language);
    console.log('Header - Tabs:', tabs);
  }, [language, tabs]);

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
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
      : "bg-transparent backdrop-blur-0"
    : "bg-white shadow-sm border-b border-border";

  return (
    <header
      className={`sticky top-0 flex items-center justify-between px-2 md:px-6 z-30 transition-all duration-300 ${bgClass}`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-1 transition-all duration-300">
        <Link href="/">
          <Image
            className="py-1 transition-all duration-300"
            src="/PICODAROSA_logo.png"
            alt="PICO DA ROSA logo"
            width={100}
            height={30}
            priority
          />
        </Link>
        <Link href="/">
          <Image
            className="pt-2 transition-all duration-300"
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

