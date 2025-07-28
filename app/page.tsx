"use client";

// app/page.tsx
import Products from "@/components/Products";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import AboutSection from "@/components/AboutSection";
import { scrollToSection } from "@/lib/utils";

export default function HomePage() {
  const logoRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(entry.intersectionRatio < 1); // sticky quando cola ao topo
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

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const sectionTop = rect.top + scrolled;
        const sectionHeight = rect.height;
        
        // Calcula o offset baseado na posição da seção na tela
        const progress = Math.max(0, Math.min(1, (scrolled - sectionTop + window.innerHeight) / (sectionHeight + window.innerHeight)));
        const maxOffset = -(rect.height * 0.3); // Máximo 30% da altura da seção
        const rate = progress * maxOffset;
        
        setParallaxOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <div
        className={`fixed top-0 left-0 w-full h-20 z-[100] bg-white shadow-md flex items-center
    transition-opacity duration-500 ease-in-out
    ${isSticky ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >


        {/* topbar */}
        <Link href="/">
          <Image
            className={`transition-all duration-250 ${isSticky ? "scale-76 " : "scale-80 invert"
              } pr-1`}
            src="logo/logo_h.svg"
            alt="PICO DA ROSA logo"
            width={300}
            height={73}
            priority
          />
        </Link>
{/*         <Link href="#products">
          <Button className="bg-gray-400 text-black font-bold">Encomendar</Button>
        </Link> */}
      </div>


      <main className="relative m-0 p-0">
        {/* HERO SECTION */}
        <div className="relative w-screen h-screen">
          {/* hero content */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center w-full h-full z-20 animate-fadein">

            {/* HERO logo (sticky dentro da hero) */}
            <div
              ref={logoRef}
              className={`
                 top-0 z-50 w-full flex transition-all duration-200 bg-transparent py-0`}
            >
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    className={`transition-all duration-200 scale-80 invert pr-2 pt-3 pb-10`}
                    src="logo/logo_h.svg"
                    alt="PICO DA ROSA logo"
                    width={300}
                    height={73}
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Texto */}
            <div className="flex flex-col items-end justify-center text-right w-full md:w-auto pr-10 z-20">
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

          {/* imagem de fundo */}
          <div className="flex w-screen bg-white -z-40">
            <Image
              className="w-full h-full object-cover object-top"
              src="/imgs/f.jpeg"
              alt="Fruta Miúda em Pedrógão Grande"
              fill
              priority
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </div>

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

          {/* blur effect */}
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

        <section>
          <p className="text-lg leading-relaxed px-20 py-10 !text-center">
            Produção de <br /><b>frutos vermelhos</b><br />no centro do país.
          </p>
        </section>


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

        {/* Products */}
        <div className="px-10 pb-10" id="products">
        <Products />
        </div>

        {/* About */}
        <div id="about">
          <AboutSection />
        </div>

      </main>

      {/* Fade-in animation keyframes */}
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
