"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { GalleryVerticalEnd, Home, Menu, Settings, ShoppingCart, X, Users, Store, Mail, Plus, Minus, Trash2, LogIn, LogOut } from "lucide-react"
import { useLanguageSettings } from "@/hooks/use-settings-store"
import { useCart } from "@/contexts/cart-context"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { useAuth } from "@/hooks/use-auth"
import Modal from "@/components/ui/Modal";
import { signIn } from "next-auth/react";
import { Client } from '@/lib/clients';




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
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      console.log('fetchClient called, isAuthenticated:', isAuthenticated, 'user.email:', user?.email);
      if (isAuthenticated && user?.email) {
        setIsClientLoading(true);
        try {
          const response = await fetch(`/api/client/${encodeURIComponent(user.email)}`);
          if (response.ok) {
            const clientData = await response.json();
            console.log('Client data from API:', clientData);
            setClient(clientData);
            setImageLoaded(false); // Reset image loading state
          } else {
            console.log('Error fetching client:', response.status, response.statusText);
            setClient(null);
          }
        } catch (error) {
          console.error('Error fetching client:', error);
          setClient(null);
        }
        setIsClientLoading(false);
      } else {
        console.log('Not authenticated or no email');
        setClient(null);
        setIsClientLoading(false);
      }
    }
    fetchClient();
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    if (client) {
      console.log('client:', client);
      console.log('client.image_url:', client.image_url, typeof client.image_url);
    }
  }, [client]);

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

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { callbackUrl: "/", redirect: false });
    if (result?.url) {
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        result.url,
        "GoogleSignIn",
        `width=${width},height=${height},top=${top},left=${left}`
      );
      const timer = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(timer);
          window.location.reload();
        }
      }, 500);
    }
  };

  if (isMobile) {
    return (
      <div
        className={`fixed left-0 z-40 w-full transition-all duration-300 bg-background border-t border-gray-100 ${isSidebarOpen ? 'bottom-0 h-full' : 'bottom-0 h-16'
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
              <Link href="#about" className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left" onClick={() => setIsSidebarOpen(false)}>
                <Users className="h-4 w-4" />
                {t("sidebar.about")}
              </Link>
              <Link href="#products" className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left" onClick={() => setIsSidebarOpen(false)}>
                <Store className="h-4 w-4" />
                {t("sidebar.products")}
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-3">
              <Accordion type="single" value={openSection ?? undefined} onValueChange={v => setOpenSection(v as typeof openSection)} collapsible>

                <AccordionItem value="cart">
                  <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                    <ShoppingCart className="h-4 w-4" />
                    {t("sidebar.cart")} ({cartCount})
                  </AccordionTrigger>
                  <AccordionContent>
                    {cartItems.length === 0 ? (
                      <p className="text-muted-foreground">
                        {t("sidebar.emptyCart")} <br />
                        {t("sidebar.visitProducts")}{' '}
                        <Link href="#products" className="underline hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                          {t("sidebar.products")}
                        </Link>{' '}
                        {t("sidebar.or")}{' '}
                        <Link href="/info" className="underline hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                          {t("sidebar.contactUs")}
                        </Link>{' '}
                        {t("sidebar.ifProblem")}
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {item.price.toFixed(2).replace(".", ",")}€ × {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive/80"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="mt-8 mx-8 border-t border-border border-gray-400" />
                        <div className="flex justify-between items-center m-4 text-lg ">
                          <span className="font-semibold">{t("sidebar.total")}:</span>
                          <span className="font-bold">{cartTotal.toFixed(2).replace(".", ",")}€</span>
                        </div>
                        <div className="mx-10 my-5">




                          <Button
                            className="px-8 w-full bg-primary bg-black hover:bg-gray-900 text-md font-semibold text-white hover:bg-gray-700"
                            onClick={() => {
                              setIsSidebarOpen(false);
                              router.push('/checkout');
                            }}
                          >
                            {t("sidebar.buy")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contactos">
                  <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                    <Mail className="h-4 w-4" />
                    {t("sidebar.contacts")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-base">{t("sidebar.contactInfo")} <a href="mailto:info@picodarosa.pt" className="underline">info@picodarosa.pt</a> {t("sidebar.orPhone")} <a href="tel:+351912345678" className="underline">+351 912 345 678</a>.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="settings">
                  <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                    <Settings className="h-4 w-4" />
                    {t("sidebar.settings")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <SettingsPanel />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>



              <div id="login" className="flex w-full justify-left h-16 mt-auto items-left transition-colors hover:bg-secondary/50 text-left">

                {/* Auth block for mobile */}
                <div className="">
                  {!isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setIsSignInModalOpen(true)}
                        className="flex items-center gap-2 rounded-md py-4 transition-colors hover:bg-secondary/50 text-left text-2xl font-bold"
                      >
                        <LogIn className={burfordFontClass + " h-4 w-4 mt-2 text-left"} />
                        {t("sidebar.signIn")}
                      </button>
                      <Modal open={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)}>
                        <div className="flex flex-col items-center gap-6 p-4 w-full">
                          <h2 className="text-xl font-bold mb-4">{t("sidebar.signIn")}</h2>
                          <Button
                            onClick={handleGoogleSignIn}
                            className="w-full"
                            variant="outline"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-2">
                              <path
                                d="M21.35 11.1H12.18v2.92h5.19c-.22 1.18-1.32 3.47-5.19 3.47-3.12 0-5.66-2.59-5.66-5.79s2.54-5.79 5.66-5.79c1.78 0 2.97.76 3.65 1.41l2.49-2.41C17.13 3.98 14.89 3 12.18 3 6.65 3 2.25 7.42 2.25 12.01s4.4 9.01 9.93 9.01c5.7 0 9.47-4 9.47-9.62 0-.65-.07-1.14-.16-1.3z"
                                fill="currentColor"
                              />
                            </svg>
                            Entrar com Google
                          </Button>
                        </div>
                      </Modal>
                    </>
                  ) :  (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-lg font-semibold flex items-center gap-3">
                        {isClientLoading ? (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : typeof client?.image_url === 'string' && client.image_url.length > 0 ? (
                          <img 
                            src={client.image_url} 
                            alt="avatar" 
                            className="w-10 h-10 rounded-full object-cover border"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(false)}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 border">
                            <LogIn className="w-6 h-6" />
                          </div>
                        )}
                        {!imageLoaded && typeof client?.image_url === 'string' && client.image_url.length > 0 && (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <div>
                          <p className="font-lg">{user?.name}</p>
                          <p className="text-muted-foreground text-base">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("sidebar.signOut")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
            <span className="text-xs">{t("home")}</span>
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
            <span className="text-xs">{t("sidebar.menu")}</span>
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
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 flex h-4 w-4 pb-1 items-center justify-center rounded-full bg-red-700 text-[11px] text-white font-bold">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-xs">{t("sidebar.cart")}</span>
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
            <span className="text-base font-semibold">PICO DA ROSA</span>
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
            {/* Auth block for desktop */}
            {!isAuthenticated ? (
              <button
                onClick={() => signIn()}
                className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left"
              >
                <LogIn className="h-4 w-4" />
                {t("sidebar.signIn")}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 rounded-md px-3 py-4 transition-colors hover:bg-secondary/50 text-left w-full"
                >
                  <LogOut className="h-4 w-4" />
                  {t("sidebar.signOut")}
                </button>
              </div>
            )}
          </nav>
        </div>
        <div className="p-4 ">
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
