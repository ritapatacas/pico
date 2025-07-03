"use client";

import HeaderWithPathname from "@/app/HeaderWithPathname";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-50/50">
      {/* Main content area with proper sidebar spacing */}
      <div className="flex flex-col min-h-screen transition-all duration-300 md:pr-64">
        {/* <HeaderWithPathname /> */}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      {/* Sidebar always rendered, width controlled by VerticalHeader */}
      <div className="fixed right-0 top-0 h-full z-50 transition-all duration-300 ease-in-out">
        <Sidebar version="0.1.0" />
      </div>
    </div>
  );
} 