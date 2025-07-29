import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsStoreProvider } from "@/hooks/use-settings-store";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawerProvider } from "@/contexts/cart-drawer-context";
import { MainLayout } from "@/components/MainLayout";
import { LanguageProvider } from "@/components/LanguageProvider";
import { PaymentSuccessHandler } from "@/components/PaymentSuccessHandler";
import { DeviceProvider } from "@/components/DeviceProvider";
import { MobileFirstLoader } from "@/components/MobileFirstLoader";
import { Providers } from "./providers";
import { Suspense } from "react";
import { headers } from "next/headers";
import { DeviceInfo } from "@/lib/device-detection";

export const metadata: Metadata = {
  title: "Pico da Rosa",
  description: "Loja Online de Frutos Vermelhos",
};

// Function to detect device on server
async function detectDeviceServerSide(): Promise<DeviceInfo> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  
  // Mobile detection patterns
  const mobilePatterns = [
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /webOS/i,
    /Mobile/i,
    /Opera Mini/i,
    /IEMobile/i,
    /Silk/i
  ];
  
  // Tablet specific patterns
  const tabletPatterns = [
    /iPad/i,
    /Android(?!.*Mobile)/i,
    /Tablet/i
  ];
  
  const isTablet = tabletPatterns.some(pattern => pattern.test(userAgent));
  const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent)) || isTablet;
  const isDesktop = !isMobile;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent
  };
}

async function AppProviders({ children }: { children: React.ReactNode }) {
  const deviceInfo = await detectDeviceServerSide();
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Providers>
        <DeviceProvider initialDeviceInfo={deviceInfo}>
          <MobileFirstLoader />
          <SettingsStoreProvider>
            <LanguageProvider>
              <CartProvider>
                <CartDrawerProvider>
                <Suspense fallback={null}>
                    <PaymentSuccessHandler />
                  </Suspense>                <MainLayout>
                    {children}
                  </MainLayout>
                </CartDrawerProvider>
              </CartProvider>
            </LanguageProvider>
          </SettingsStoreProvider>
        </DeviceProvider>
      </Providers>
    </ThemeProvider>
  );
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // If rendering the 404 page, do not wrap with AppProviders
  // Next.js will render the 404 page at /404, so we check the pathname
  // But since we can't access pathname here, we rely on Next.js to render 404.tsx directly
  // So just always wrap with AppProviders except for 404.tsx
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="antialiased">
        { /* AppProviders will be skipped for 404.tsx automatically by Next.js */ }
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}