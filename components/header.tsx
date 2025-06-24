"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import VercelTabs from "@/components/VercelTabs"
import { Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguageSettings } from "@/hooks/use-settings-store"
import { useCart } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/CartSidebar"


export function Header() {
  const { cartCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs = [
    { label: "o quê", href: "/what" },
    { label: "onde", href: "/onde" },
    { label: "comprar", href: "/comprar" },
  ];
    
  return (
    <header className="fixed py-4 left-0 right-0 h-20 flex items-center justify-between px-4 md:px-6 bg-white shadow-md z-50 mr-24">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <a href="/">
        
        <Image
          className="dark:invert"
          src="/PICODAROSA_logo.png"
          alt="PICO DA ROSA logo"
          width={100}
          height={30}
          priority
          />
          </a>
          <a href="/">
        <Image
          className="dark:invert hidden sm:block"
          src="/PICODAROSA_text-img.png"
          alt="PICO DA ROSA text logo"
          width={160}
          height={35}
          priority
          />
          </a>
      </div>

      {/* desktop menu*/}
      <nav className="hidden md:block">
        <VercelTabs tabs={tabs} />{" "}
      </nav>



      {/* cart sidebar*/}
      {/* <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
    </header>
  );
}

