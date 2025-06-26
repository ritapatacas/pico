"use client";

import HeaderWithPathname from "@/app/HeaderWithPathname";
import { Footer } from "./footer";
import { VerticalHeader } from "./header-vertical";
import { useCartDrawer } from "@/contexts/cart-drawer-context";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isCartOpen, setIsCartOpen } = useCartDrawer();

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      {/* Sidebar fixa à direita, responsiva */}
      <div
        className={`fixed right-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
          ${isCartOpen ? 'w-full md:w-[30vw] md:min-w-[200px] md:max-w-[500px]' : 'w-24 md:w-24'}
        `}
      >
        <VerticalHeader />
      </div>

      {/* Backdrop para fechar a sidebar ao clicar fora */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 cursor-pointer md:hidden"
          onClick={() => setIsCartOpen(false)}
          aria-label="Fechar carrinho"
        />
      )}

      {/* Main content area, empurrado pela sidebar à direita apenas em md+ */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${isCartOpen ? 'md:mr-[30vw]' : 'md:mr-24'}`}
      >
        <HeaderWithPathname />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 