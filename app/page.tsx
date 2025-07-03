"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

export default function HomePage() {
  const logoStickyRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const ref = logoStickyRef.current;
    if (!ref) return;
    const handleScroll = () => {
      const rect = ref.getBoundingClientRect();
      setIsStuck(rect.top <= 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <main className="relative">
        <div className="relative m-0 p-0">
          {/* Hero Image with Responsive Height */}
          <div className="relative w-screen  h-screen md:h-screen">
            <Image
              className="w-full h-full object-cover object-top"
              src="/imgs/f.jpeg"
              alt="Fruta Miúda a crescer em Pedrógão Grande - PICO DA ROSA logo"
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
            {/* Radial gradient overlay to darken area around text */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10 pb-55">
              <div className="w-[100vw] h-[100vw] max-w-300 max-h-300 rounded-full"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 3%, rgba(0,0,0,0.0) 100%)',
                  filter: 'blur(30px)',
                }}
              />
            </div>
            {/* Hero Content: logo column left, text column right */}
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center w-full h-full z-20 animate-fadein">
              {/* Logo column (top on mobile, left on desktop) - sticky, conditional bg/filter */}
              <div
                ref={logoStickyRef}
                className={`flex flex-col items-start justify-center font-burford min-w-[270px] w-full md:w-auto mb-6 md:mb-0 sticky top-0 z-50 px-3 pt-1 transition-all duration-300 ${isStuck ? 'bg-white/80 dark:bg-black/80 backdrop-blur shadow-sm' : ''}`}
              >
                <div className="flex items-center mb-2">
                  <Link href="/">
                    <Image
                      className={`transition-all duration-300 scale-135 pr-2 ${isStuck ? 'dark:invert' : 'filter invert brightness-200'}`}
                      src="/PICODAROSA_logo-img.svg"
                      alt="PICO DA ROSA logo"
                      width={100}
                      height={30}
                      priority
                    />
                  </Link>
                  <Link href="/">
                    <Image
                      className={`transition-all duration-300 scale-130 ${isStuck ? 'dark:invert' : 'filter invert brightness-200'}`}
                      src="/PICODAROSA_text-img.png"
                      alt="PICO DA ROSA text logo"
                      width={160}
                      height={35}
                      priority
                    />
                  </Link>
                </div>
              </div>
              {/* Text column (below on mobile, right on desktop) */}
              <div className="flex flex-col items-end justify-center text-right w-full md:w-auto">
                <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold drop-shadow-md text-white font-burford">
                  Fruta Miúda
                </h2>
                <h3 className="text-xl sm:text-lg md:text-xl font-medium text-white drop-shadow-md font-burford">
                  de Pedrógão Grande
                </h3>
                <Link href="/products" passHref>
                  <Button
                    className="mt-2 pb-2 px-4 rounded-lg p-1 text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 font-burford"
                  >
                    encomendar
                  </Button>
                </Link>
                <div className="text-white text-opacity-90 text-base sm:text-3xl md:text-3xl drop-shadow-md font-semibold font-burford">
                  Mirtilos<br />Framboesas<br />groselhas
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Fade-in animation keyframes */}
      <style jsx global>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
