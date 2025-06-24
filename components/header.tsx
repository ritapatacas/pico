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

  return (
    <header className="fixed py-4 left-0 right-0 h-20 flex items-center justify-between px-4 md:px-6 bg-white shadow-md z-50">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Image
          className="dark:invert"
          src="/PICODAROSA_logo.png"
          alt="PICO DA ROSA logo"
          width={100}
          height={30}
          priority
        />
        <Image
          className="dark:invert hidden sm:block"
          src="/PICODAROSA_text-img.png"
          alt="PICO DA ROSA text logo"
          width={160}
          height={35}
          priority
        />
      </div>

      {/* Navegação Desktop */}
      <nav className="hidden md:block">
        <VercelTabs />
      </nav>

      {/* Ícones à direita */}
      <div className="flex items-center gap-4">
        {/* Menu Mobile */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Abrir carrinho</span>
        </Button>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-20 right-4 bg-white shadow-lg rounded-md py-4 px-6 flex flex-col space-y-4 animate-fade-in z-50">
          <a
            href="/"
            className="hover:underline text-gray-700"
            onClick={() => setMenuOpen(false)}
          >
            Quem somos
          </a>
          <a
            href="/onde"
            className="hover:underline text-gray-700"
            onClick={() => setMenuOpen(false)}
          >
            Onde estamos
          </a>
        </div>
      )}

      {/* Sidebar do Carrinho */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

