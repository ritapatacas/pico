"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GalleryVerticalEnd, Home, Menu, Settings, X } from "lucide-react"
import { useLanguageSettings } from "@/hooks/use-settings-store"
import { SettingsPanel } from "@/components/settings/settings-panel"

interface SidebarProps {
  version: string
}

export function Sidebar({ version }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguageSettings()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [openSection, setOpenSection] = useState<'home' | 'settings' | null>(null)

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
        className={`fixed left-0 z-40 w-full transition-all duration-300 bg-background border-t ${
          isSidebarOpen ? 'bottom-0 h-full' : 'bottom-0 h-16'
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
                  <span className="text-base font-semibold">Boilerplate</span>
                  <span className="text-xs text-muted-foreground">v{version}</span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {openSection === 'settings' && (
                <>
                  <h1 className="mb-6 text-2xl font-bold">{t("settings")}</h1>
                  <SettingsPanel />
                </>
              )}
              {openSection === 'home' && (
                <>
                  <h1 className="mb-6 text-2xl font-bold">{t("home")}</h1>
                  {/* Home content goes here. You can customize this section. */}
                  <p className="text-muted-foreground">Welcome to the home section!</p>
                </>
              )}
            </div>
          </>
        )}
        {/* Bottom Navigation (always visible) */}
        <div className="flex w-full items-center justify-around h-16 border-t bg-background pb-1 pt-2 mt-auto">
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
            <span className="text-xs">{t("home")}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isSidebarOpen && openSection === 'settings') {
                setIsSidebarOpen(false);
                setOpenSection(null);
              } else {
                setIsSidebarOpen(true);
                setOpenSection('settings');
              }
            }}
            className={`flex flex-col items-center p-2 ${isSidebarOpen && openSection === 'settings' ? "text-primary" : "text-muted-foreground"}`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t("settings")}</span>
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
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-base transition-colors ${
                  item.current ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary/50"
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
              className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-base transition-colors ${
                isSidebarOpen ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <Settings className="h-5 w-5" />
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
