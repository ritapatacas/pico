import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsStoreProvider } from "@/hooks/use-settings-store";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawerProvider } from "@/contexts/cart-drawer-context";
import { MainLayout } from "@/components/MainLayout";
import { LanguageProvider } from "@/components/LanguageProvider";
import { PaymentSuccessHandler } from "@/components/PaymentSuccessHandler";
import { Providers } from "./providers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pico da Rosa",
  description: "Loja Online de Frutos Vermelhos",
};

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Providers>
        <SettingsStoreProvider>
          <LanguageProvider>
            <CartProvider>
              <CartDrawerProvider>
                <PaymentSuccessHandler />
                <MainLayout>
                  {children}
                </MainLayout>
              </CartDrawerProvider>
            </CartProvider>
          </LanguageProvider>
        </SettingsStoreProvider>
      </Providers>
    </ThemeProvider>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // If rendering the 404 page, do not wrap with AppProviders
  // Next.js will render the 404 page at /404, so we check the pathname
  // But since we can't access pathname here, we rely on Next.js to render 404.tsx directly
  // So just always wrap with AppProviders except for 404.tsx
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="antialiased">
        {/* AppProviders will be skipped for 404.tsx automatically by Next.js */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}