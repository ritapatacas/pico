"use client";

// app/page.tsx
import Products from "@/components/Products";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AboutSection from "@/components/AboutSection";
import { scrollToSection } from "@/lib/utils";
import { useDevice } from "@/components/DeviceProvider";
import StickyLogo from "@/components/StickyLogo";

export default function HomePage() {
  const logoRef = useRef<HTMLImageElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const { isMobile, isDesktop } = useDevice();
  const [heroLogoStyle, setHeroLogoStyle] = useState({});

  const [viewportContainer, setViewportContainer] = useState<HTMLElement | null>(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(entry.intersectionRatio < 1); // sticky when it sticks to the top
      },
      {
        threshold: [1],
      }
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => {
      if (logoRef.current) observer.unobserve(logoRef.current);
    };
  }, []);

  // Capture viewport container when it's available
  useEffect(() => {
    const container = document.getElementById('logo-viewport-container');
    setViewportContainer(container);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Existing parallax logic
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const sectionTop = rect.top + scrolled;
        const sectionHeight = rect.height;

        // Calculate offset based on section position on screen
        const progress = Math.max(0, Math.min(1, (scrolled - sectionTop + window.innerHeight) / (sectionHeight + window.innerHeight)));
        const maxOffset = -(rect.height * 0.3); // Maximum 30% of section height
        const rate = progress * maxOffset;

        setParallaxOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Container query effect to detect hero logo position and size
  useEffect(() => {
    const updateHeroLogoStyle = () => {
      const heroLogo = document.querySelector('[data-hero-logo]');
      if (heroLogo) {
        const rect = heroLogo.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(heroLogo);
        
        setHeroLogoStyle({
          width: rect.width,
          height: rect.height,
          transform: computedStyle.transform,
          padding: computedStyle.padding,
          margin: computedStyle.margin,
          position: 'relative',
          left: rect.left
        });
      }
    };

    // Initial update
    updateHeroLogoStyle();
    
    // Update on resize
    window.addEventListener('resize', updateHeroLogoStyle);
    
    // Update on scroll (for responsive changes)
    window.addEventListener('scroll', updateHeroLogoStyle);

    return () => {
      window.removeEventListener('resize', updateHeroLogoStyle);
      window.removeEventListener('scroll', updateHeroLogoStyle);
    };
  }, []);

  return (
    <div className="relative">

      { /* Viewport Container - Contains logo always */ }
      <div 
        id="logo-viewport-container"
        className="fixed top-0 left-0 w-screen h-screen z-[400] pointer-events-none overflow-hidden"
      >
        {/* Debug line to show viewport boundary */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 opacity-75" />
        


      </div>

      {/* StickyLogo Component - handles its own positioning */}
      {viewportContainer && (
        <StickyLogo
          logoSrc="logo/logo_h.svg"
          fixedTop={80}
          width={300}
          height={73}
        />
      )}

      { /* Topbar - Mobile Only */ }
      <div
        data-topbar
        className={`md:hidden fixed top-0 left-0 w-full h-20 z-[100] bg-white shadow-md flex items-center
    transition-opacity duration-500 ease-in-out
    ${isSticky ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <Link href="/" className="flex items-center">
          <Image
            className={`transition-all duration-250`}
            style={heroLogoStyle}
            src="logo/logo_h.svg"
            alt="PICO DA ROSA logo"
            width={300}
            height={73}
            priority
          />
        </Link>
      </div>

      { /* Fixed Background Image - Desktop Only */ }
      <div className="hidden md:block fixed inset-0 w-full h-full -z-190">
        <Image
          className="w-full h-full object-cover object-top -z-190"
          src="/imgs/f.jpeg"
          alt="Fruta Miúda em Pedrógão Grande"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        { /* overlay - Desktop */ }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        { /* blur effect - Desktop */ }
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center mb-50">
          <div
            className="w-[300vw] h-[150vw] max-w-600 max-h-500 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 1%, rgba(0,0,0,0.0) 100%)",
              filter: "blur(30px)",
            }}
          />
        </div>
      </div>

      <main className="relative m-0 p-0">
        { /* HERO SECTION */ }
        <div data-hero-section className="relative w-screen h-screen">

          { /* hero content */ }
          <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-20 animate-fadein md:px-[15vw]">

            { /* HERO logo - stays here as reference */ }
            <div className="w-full flex">
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    ref={logoRef}
                    data-hero-logo
                    className="scale-80 invert pr-2 pt-3 pb-10 opacity-0"
                    src="logo/logo_h.svg"
                    alt="PICO DA ROSA logo"
                    width={300}
                    height={73}
                    priority
                  />
                </Link>
              </div>
            </div>

            { /* Text */ }
            <div className="flex flex-col items-end text-right w-full pr-10 z-20">
              <h2 className="text-3xl md:text-4xl font-bold drop-shadow-md text-white font-burford">
                Fruta Miúda
              </h2>
              <div className="text-white text-opacity-90 text-base sm:text-3xl md:text-3xl drop-shadow-lg font-semibold font-burford">
                Mirtilos | Framboesas | groselhas
              </div>
              <Button
                onClick={() => scrollToSection('products')}
                className="mt-2 rounded pt-1 px-4 bg-white text-secondary-foreground/70 font-rotunda font-bold text-lg hover:text-primary-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 font-burford"
              >
                encomendar
              </Button>

            </div>
          </div>

          { /* background image - Mobile Only */ }
          <div className="md:hidden flex w-screen bg-white -z-40">
            <Image
              className="w-full h-full object-cover object-top"
              src="/imgs/f.jpeg"
              alt="Fruta Miúda em Pedrógão Grande"
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
            { /* overlay - Mobile */ }
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
            { /* blur effect - Mobile */ }
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center mb-50">
              <div
                className="w-[300vw] h-[150vw] max-w-600 max-h-500 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 1%, rgba(0,0,0,0.0) 100%)",
                  filter: "blur(30px)",
                }}
              />
            </div>
          </div>
        </div>

<div className="bg-white w-screen">
        <section>
          <p className="text-lg leading-relaxed px-20 py-10 !text-center">
            Produção de <br /><b>frutos vermelhos</b><br />no centro do país.
          </p>
        </section>

        { /* Parallax section */ }
          <section ref={parallaxRef} className="relative overflow-hidden h-[25vh]">
            <div
              className="absolute inset-0 w-screen"
              style={{
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.05s ease-out',
                aspectRatio: '4/3',
                height: 'auto'
              }}
            >
              <Image
                src="imgs/PR-01.webp"
                alt="Rosa Américo"
                width={4032}
                height={3024}
                priority
                className="w-full h-auto object-cover"
                style={{ objectPosition: 'center 25%' }}
              />
            </div>
          </section>
        

        { /* Products */ }
        <div className="px-10 pb-10" id="products">
          <Products />
        </div>

        { /* About */ }
        <div id="about">
          <AboutSection />
        </div>
</div>
      </main>

      { /* Fade-in animation keyframes */ }
      <style jsx global>{`
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
