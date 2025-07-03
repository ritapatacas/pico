"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"
import { GalleryVerticalEnd, Home, Menu, Settings, ShoppingCart, X, Users, Store, Mail, Plus, Minus, Trash2 } from "lucide-react"
import { useLanguageSettings } from "@/hooks/use-settings-store"
import { useCart } from "@/contexts/cart-context"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import "@/app/globals.css"

interface SidebarProps {
  version: string
}

const burfordFontClass = "font-burford text-2xl text-left font-bold";

export function Sidebar({ version }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguageSettings()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openSection, setOpenSection] = useState<'home' | 'settings' | 'cart' | null>(null)
  const { cartItems, cartCount, cartTotal, updateItemQuantity, removeFromCart } = useCart()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const mainNavigation = [{ name: t("home"), href: "/", icon: Home, current: pathname === "/" }]

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    }
  }

  const handleSidebarClick = (e: React.MouseEvent) => {
    // If clicking on the sidebar container but not on navigation items, toggle open/close
    if (e.target === e.currentTarget) {
      setIsSidebarOpen(!isSidebarOpen)
    }
  }

  if (isMobile) {
    return (
      <>
        {/* Full-screen sidebar drawer for secondary links */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-background flex flex-col transition-all duration-300"
            onClick={handleSidebarClick} // tap-outside to close
            style={{ willChange: 'height' }}
          >
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                {/* Logo */}
                <div className="flex items-center space-x-1 transition-all scale-60 duration-300 pb-3 pt-2">
                  <Image
                    className="transition-all duration-300"
                    src="/PICODAROSA_logo.png"
                    alt="PICO DA ROSA logo"
                    width={100}
                    height={30}
                    priority
                  />
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Secondary navigation links */}
            <div className={`space-y-3 pt-6 px-10 ${burfordFontClass}`}>
              <Link href="/sobre" className="flex items-center gap-2 rounded-md transition-colors hover:bg-secondary/50 text-left" onClick={() => setIsSidebarOpen(false)}>
                <Users className="h-4 w-4" />
                {t("sidebar.about")}
              </Link>
              <Link href="/contactos" className="flex items-center gap-2 rounded-md pt-2 transition-colors hover:bg-secondary/50 text-left" onClick={() => setIsSidebarOpen(false)}>
                <Mail className="h-4 w-4" />
                {t("sidebar.contacts")}
              </Link>
              {/* Discrete Settings link/section */}
              <div className="mt-8 pt-4 border-t border-border">
                <Link href="/settings" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsSidebarOpen(false)}>
                  <Settings className="h-4 w-4" />
                  {t("settings")}
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* Menu button always visible at bottom */}
        <div className="fixed bottom-0 left-0 w-full h-16 flex items-center justify-between px-5 border-t bg-background z-40">
          <div className="flex space-x-1 transition-all scale-60 duration-300 pb-3 pt-2">
            <Image
              className="transition-all duration-300"
              src="/PICODAROSA_logo.png"
              alt="PICO DA ROSA logo"
              width={100}
              height={30}
              priority
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className={`flex pr-8 scale-100 items-center ${isSidebarOpen ? "text-primary" : "text-muted-foreground"}`}
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="hidden w-64 border-r bg-background md:block">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-lg font-semibold">PICO DA ROSA</span>
            <span className="text-xs text-muted-foreground">v{version}</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col justify-between h-[calc(100%-4rem)]">
        <div className="p-4">
          <nav className="space-y-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 text-base transition-colors ${item.current ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary/50"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <nav className="space-y-2">
            <button
              onClick={handleSettingsClick}
              className={`flex w-full items-center gap-3 rounded-md px-3 text-base transition-colors ${isSidebarOpen ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary/50"
                }`}
            >
              <Settings className="h-4 w-4" />
              <span>{t("settings")}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop Settings Panel */}
      {isSidebarOpen && (
        <div className="absolute left-full top-0 h-full w-80 border-l bg-background">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <h2 className="text-lg font-semibold">{t("settings")}</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
            <SettingsPanel />
          </div>
        </div>
      )}
    </div>
  )
}
