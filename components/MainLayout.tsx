"use client";

import { Footer } from "./footer";
import { Sidebar } from "./sidebar";
import { useDevice } from "./DeviceProvider";
import { useEffect, useState } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isMobile, isLoading } = useDevice();
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const checkHeroVisibility = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isHeroVisible = rect.bottom > 0; // Hero is visible when bottom is in viewport
        const isVisible = !isHeroVisible && window.scrollY > 100; // Show sidebar when hero is out of view
        
        setIsTopbarVisible(isVisible);
        
        // Animate sidebar when hero disappears (desktop only)
        if (isVisible && !isSidebarVisible && !isMobile) {
          setTimeout(() => {
            setIsSidebarVisible(true);
          }, 300); // Shorter delay for better responsiveness
        }
        
        // Hide sidebar when hero becomes visible again (desktop only)
        if (!isVisible && isSidebarVisible && !isMobile) {
          setIsSidebarVisible(false);
        }
      }
    };

    // Check if user is already scrolled down on page load (desktop only)
    const isAlreadyScrolled = window.scrollY > 100;
    if (isAlreadyScrolled && !isMobile) {
      setTimeout(() => {
        setIsSidebarVisible(true);
      }, 800); // Show sidebar after page load if already scrolled
    }

    // Check on scroll
    window.addEventListener('scroll', checkHeroVisibility);
    
    // Initial check after a small delay to ensure DOM is ready
    setTimeout(checkHeroVisibility, 200);

    return () => {
      window.removeEventListener('scroll', checkHeroVisibility);
    };
  }, [isSidebarVisible, isMobile]);

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
                : 'pr-16 w-full' // Desktop: space for right sidebar (64px)
              }
            `}
          >
            {children}
          </main>

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

      { /* Desktop Sidebar - fixed to the right, animated from right */ }
      <div 
        className={`
          hidden 
          md:block 
          fixed 
          right-0 
          top-0 
          h-full 
          z-[120]
          transition-all 
          duration-1000 
          ease-out
          ${isSidebarVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
        `}
        style={{
          visibility: isSidebarVisible ? 'visible' : 'hidden'
        }}
      >
        <Sidebar version="0.1.0" />
      </div>
    </div>
  );
}