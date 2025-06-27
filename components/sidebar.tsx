"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GalleryVerticalEnd, Home, Menu, Settings, ShoppingCart, X, Users, Store, Mail } from "lucide-react"
import { useLanguageSettings } from "@/hooks/use-settings-store"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import "@/app/globals.css"

interface SidebarProps {
  version: string
}

const burfordFontClass = "font-burford text-2xl text-left font-bold";

export function Sidebar({ version }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguageSettings()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openSection, setOpenSection] = useState<'home' | 'settings' | 'cart' | null>(null)

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
      <div
        className={`fixed left-0 z-40 w-full transition-all duration-300 bg-background border-t ${isSidebarOpen ? 'bottom-0 h-full' : 'bottom-0 h-16'
          } flex flex-col`}
        style={{ willChange: 'height' }}
      >
        {/* Header and Content (only when open) */}
        {isSidebarOpen && (
          <>
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-semibold">PICO DA ROSA</span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Main navigation styled like accordion triggers */}
            <div className={`space-y-2 ${burfordFontClass}`}>
              <Link href="/sobre" className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left" onClick={() => setIsSidebarOpen(false)}>
                <Users className="h-4 w-4" />
                Sobre nós
              </Link>
              <Link href="/mirtilos" className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left" onClick={() => setIsSidebarOpen(false)}>
                <Store className="h-4 w-4" />
                Produtos
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <Accordion type="single" value={openSection ?? undefined} onValueChange={v => setOpenSection(v as typeof openSection)} collapsible>
                <AccordionItem value="settings">
                  <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                    <Settings className="h-4 w-4" />
                    Configurações
                  </AccordionTrigger>
                  <AccordionContent>
                    <SettingsPanel />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cart">
                  <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                    <ShoppingCart className="h-4 w-4" />
                    Carrinho
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      O carrinho está vazio. <br />
                      Visite a página{' '}
                      <Link href="/mirtilos" className="underline hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                        produtos
                      </Link>{' '}
                      ou{' '}
                      <Link href="/info" className="underline hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                        contacte-nos
                      </Link>{' '}
                      se encontrar algum problema
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contactos">
                  <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                    <Mail className="h-4 w-4" />
                    Contactos
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-base">Pode contactar-nos através do email <a href="mailto:info@picodarosa.pt" className="underline">info@picodarosa.pt</a> ou pelo telefone <a href="tel:+351912345678" className="underline">+351 912 345 678</a>.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
        {/* Bottom Navigation (always visible) */}
        <div className="flex w-full items-center justify-around h-16 border-t bg-background pb-1 pt-2 mt-auto">
          <Link
            href="/"
            className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isSidebarOpen && openSection === 'home') {
                setIsSidebarOpen(false);
                setOpenSection(null);
              } else {
                setIsSidebarOpen(true);
                setOpenSection('home');
              }
            }}
            className={`flex flex-col items-center p-2 ${isSidebarOpen && openSection === 'home' ? "text-primary" : "text-muted-foreground"}`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">Menu</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isSidebarOpen && openSection === 'cart') {
                setIsSidebarOpen(false);
                setOpenSection(null);
              } else {
                setIsSidebarOpen(true);
                setOpenSection('cart');
              }
            }}
            className={`flex flex-col items-center p-2 ${isSidebarOpen && openSection === 'cart' ? "text-primary" : "text-muted-foreground"}`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">{t("cart")}</span>
          </button>
        </div>
      </div>
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
            <span className="text-base font-semibold">Boilerplate</span>
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
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-base transition-colors ${item.current ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary/50"
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
              className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-base transition-colors ${isSidebarOpen ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary/50"
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
