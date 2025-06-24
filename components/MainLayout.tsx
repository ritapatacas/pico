"use client";

import HeaderWithPathname from "@/app/HeaderWithPathname";
import { Footer } from "./footer";
import { VerticalHeader } from "./header-vertical";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <HeaderWithPathname />
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Vertical Header / Sidebar */}
      <VerticalHeader />
    </div>
  );
} 