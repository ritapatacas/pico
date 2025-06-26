"use client";

import HeaderWithPathname from "@/app/HeaderWithPathname";
import { Footer } from "./footer";
import { VerticalHeader } from "./header-vertical";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-50/50">
      {/* Sidebar always rendered, width controlled by VerticalHeader */}
      <div className="fixed right-0 top-0 h-full z-40 transition-all duration-300 ease-in-out">
        <VerticalHeader />
      </div>

      {/* Main content area, not pushed by sidebar */}
      <div className="flex flex-col min-h-screen transition-all duration-300">
        <HeaderWithPathname />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 