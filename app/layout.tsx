import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsStoreProvider } from "@/hooks/use-settings-store";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawerProvider } from "@/contexts/cart-drawer-context";
import { MainLayout } from "@/components/MainLayout";
import { LanguageProvider } from "@/components/LanguageProvider";

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
    <html lang="pt" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SettingsStoreProvider>
            <LanguageProvider>
              <CartProvider>
                <CartDrawerProvider>
                  <MainLayout>
                    {children}
                  </MainLayout>
                </CartDrawerProvider>
              </CartProvider>
            </LanguageProvider>
          </SettingsStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
