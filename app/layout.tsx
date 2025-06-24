import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsStoreProvider } from "@/hooks/use-settings-store";
import { CartProvider } from "@/contexts/cart-context";
import HeaderWithPathname from "./HeaderWithPathname";
import { VerticalHeader } from "@/components/header-vertical";

import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Pico da Rosa",
  description: "Loja Online de Frutos Vermelhos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsStoreProvider>
            <CartProvider>
              <HeaderWithPathname />
              <VerticalHeader />
              <main className="pt-0">{children}</main>
              <Footer />
            </CartProvider>
          </SettingsStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
