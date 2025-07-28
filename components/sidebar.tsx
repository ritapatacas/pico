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
import { useAuth } from "@/hooks/use-auth"

import { Client } from '@/lib/clients';
import { SocialNav } from "./SocialNav"




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
          console.log('API response status:', response.status);
          if (response.ok) {
            const clientData = await response.json();
            console.log('Client data from API:', clientData);
            setClient(clientData);
            setImageLoaded(false); // Reset image loading state
          } else {
            console.log('Error fetching client:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Error response:', errorText);
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
      <>
        <div
        className={`fixed left-0 z-[120] w-full transition-all duration-300 bg-lavender  ${isSidebarOpen ? 'bottom-16 h-[calc(100%-64px)]' : 'bottom-0 h-16'
          } flex flex-col`}
        style={{ willChange: 'height' }}
      >

        {/* (only when open) */}
        {isSidebarOpen && (
          <>
            {/* sidebar header */}
            <div id="sidebar-header" className="flex w-full justify-between items-center px-4 py-3 border-b-2 border-gray-500">
              <div className="flex items-center gap-3">

                {/* loggin */}
                {isClientLoading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>

                ) : isAuthenticated ? (
                  <img
                    src={client?.image_url || "/imgs/roza.webp"}
                    alt="avatar"
                    className="w-10 h-10 mt-3 ml-3 mb-1 rounded-full object-cover border"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(false)}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                  />
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-1 rounded-md py-1 transition-colors hover:bg-secondary/100 text-lg leading-none"
                  >

                    <div className="w-7 h-7 flex items-center justify-center">
                      <LogIn className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="pb-1 hover:font-bold transition-all">
                      Login
                    </span>
                  </button>
                )}

                <div>
                  {isAuthenticated && user && (
                    <>
                      <p className="text-xl font-bold">{user.name}</p>
                      <div id="link-account" className="hidden">
                        <button
                          onClick={() => signOut()}
                          className="flex items-center justify-center gap-2 rounded-md transition-colors hover:bg-secondary/50 text-sm leading-none"
                        >
                          <div className="pt-1">



                          </div>
                          <span className="flex items-center">Conta</span>
                        </button>
                      </div>

                      {client && (
                        <button
                          onClick={() => signOut()}
                          className="flex items-center justify-center gap-2 rounded-md py-1 transition-colors hover:bg-secondary/50 text-sm leading-none"
                        >
                          <LogOut className="h-4 w-4 flex-shrink-0" />
                          <span className="flex items-center pb-1">{t("sidebar.signOut")}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* logout */}
              <div className=" flex justify-right pt-2">

                {isAuthenticated && client && (
                  <button
                    onClick={() => signOut()}
                    className="hidden flex items-center justify-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-secondary/50 text-sm leading-none"
                  >
                    <span className="flex items-center pb-1">{t("sidebar.signOut")}</span>
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                  </button>
                )}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>


            {/* sidebar nav */}
            <div id="nav" className="flex flex-col flex-1 px-8 py-4 overflow-y-auto">

              {/* sidebar content */}
              <div className="flex-1">
                <Accordion type="single" value={openSection ?? undefined} onValueChange={v => setOpenSection(v as typeof openSection)} collapsible>

                  {/* sidebar about */}
                  <AccordionItem value="about" className="border-none">
                    <AccordionTrigger
                      className={burfordFontClass + " text-left flex items-center gap-2"}
                      onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('#about');
                      }}
                    >
                      <Users className="h-4 w-4" />
                      <span className="pb-1 text-[18px]">
                        {t("sidebar.about")}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* Conteúdo vazio - apenas para navegação */}
                    </AccordionContent>
                  </AccordionItem>

                  {/* sidebar products */}
                  <AccordionItem value="products" className="border-none">
                    <AccordionTrigger
                      className={burfordFontClass + " text-left flex items-center gap-2"}
                      onClick={() => {
                        setIsSidebarOpen(false);
                        router.push('#products');
                      }}
                    >
                      <Store className="h-4 w-4" />
                      <span className="pb-1 text-[18px]">                        {t("sidebar.products")}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* Conteúdo vazio - apenas para navegação */}
                    </AccordionContent>
                  </AccordionItem>

                  {/* sidebar contacts */}
                  <AccordionItem value="contactos" className="border-none">
                    <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                      <Mail className="h-4 w-4" />
                      <span className="pb-1 text-[18px]">                        {t("sidebar.contacts")}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p className="text-base">{t("sidebar.contactInfo")} <a href="mailto:info@picodarosa.pt" className="underline">info@picodarosa.pt</a> {t("sidebar.orPhone")} <a href="tel:+351912345678" className="underline">+351 912 345 678</a>.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* divider border */}
                  <div className="border-b border-gray-300 my-2" />

                  {/* sidebar cart */}
                  <AccordionItem value="cart" className="border-none">
                    <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2"}>
                      <ShoppingCart className="h-4 w-4" />
                      <span className="pb-2 pl-1 text-[18px]">                          {t("sidebar.cart")} {cartCount > 0 && `(${cartCount})`}
                      </span>
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

                </Accordion>
              </div>

              {/* sidebar footer */}
              <div className={burfordFontClass + " text-left flex justify-between items-end gap-2"}>

                {/* sidebar settings */}
                <div className="w-full">

                  <Accordion type="single" value={openSection ?? undefined} onValueChange={v => setOpenSection(v as typeof openSection)} collapsible>
                    <AccordionItem value="settings">
                      <AccordionTrigger className={burfordFontClass + " text-left flex items-center gap-2 pb-0"}>
                        <Settings className="h-5 w-5" />
                        {openSection === 'settings' && <span className="pb-1 text-[18px]">Configurações</span>}
                      </AccordionTrigger>
                      <AccordionContent>
                        <SettingsPanel />
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>

                  <div className=" flex justify-center">
                  </div>
                </div>

                {/* sidebar social */}
                <SocialNav className="flex-col mr-1" />
              </div>
            </div>

          </>
        )}
        </div>

        {/* bottom (always visible) - now outside the sidebar container */}
        <div className="fixed bottom-0 left-0 z-[999] w-full flex items-center justify-around h-16 border-t-2 border-muted-foreground/50 bg-lavender  pb-1 pt-2">
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
                <span className="absolute -top-2 -right-4 flex h-5 w-5 pb-1 items-center justify-center rounded-full bg-red-700 text-[11px] text-white font-bold">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-xs">{t("sidebar.cart")}</span>
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
