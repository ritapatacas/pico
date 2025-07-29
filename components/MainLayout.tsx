"use client";

import { Footer } from "./footer";
import { Sidebar } from "./sidebar";
import { useDevice } from "./DeviceProvider";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isMobile, isLoading } = useDevice();

  // Loading state para evitar layout shift
  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gray-50/50">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 pb-16 w-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50/50">
      <div className="flex flex-col min-h-screen transition-all duration-300">

        <div className="flex flex-1">

          { /* Main content area */ }
          <main 
            className={`
              flex-1 
              transition-all 
              duration-300 
              ease-in-out
              ${isMobile 
                ? 'pb-16 w-full' // Mobile: space for bottom navigation
                : 'pr-64 w-full' // Desktop: space for right sidebar
              }
            `}
          >
            {children}
          </main>

          { /* Desktop Sidebar - fixed to the right */ }
          <aside 
            className={`
              fixed 
              right-0 
              top-0 
              h-full 
              w-64 
              bg-background 
              border-l 
              border-border 
              transition-all 
              duration-300 
              ease-in-out 
              z-[120]
              ${isMobile ? 'hidden' : 'block'}
            `}
          >
            <Sidebar version="0.1.0" />
          </aside>
        </div>

        { /* Footer */ }
        <Footer />
      </div>

      { /* Mobile Sidebar - bottom navigation */ }
      <div 
        className={`
          md:hidden 
          fixed 
          bottom-0 
          left-0 
          right-0 
          z-[120] 
          bg-background 
          border-t 
          border-border
          transition-all 
          duration-300 
          ease-in-out
        `}
      >
        <Sidebar version="0.1.0" />
      </div>
    </div>
  );
}