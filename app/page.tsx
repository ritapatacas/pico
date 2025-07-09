// app/page.tsx
import Products from "@/components/Products";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import productsData from "@/products.json";

export default function HomePage() {

  return (
    <div className="relative">
      <div
        className="fixed top-0 left-0 w-full h-20 z-[100] bg-white shadow-md flex items-center transition-opacity duration-500 ease-in-out opacity-100 pointer-events-auto"
      >
        {/* topbar */}
        <Link href="/">
          <Image
            className="transition-all duration-250 scale-80 invert pr-1"
            src="logo/logo_h.svg"
            alt="PICO DA ROSA logo"
            width={300}
            height={73}
            priority
          />
        </Link>
        <Link href="/products">
          <Button className="bg-primary text-white font-bold">Encomendar</Button>
        </Link>
      </div>


      <main className="relative m-0 p-0">
        {/* HERO SECTION */}
        <div className="relative w-screen h-screen">
          {/* hero content */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center w-full h-full z-20 animate-fadein">

            {/* HERO logo (sticky dentro da hero) */}
            <div
              className="top-0 z-50 w-full flex transition-all duration-200 bg-transparent py-0"
            >
              <div className="flex items-center">
                <Link href="/">
                  <Image
                    className="transition-all duration-200 scale-80 invert pr-2 pt-3 pb-10"
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
              <h3 className="text-xl md:text-xl font-semibold text-white drop-shadow-md font-burford">
                de Pedrógão Grande
              </h3>
              <Link href="/products" passHref>
                <Button className="mt-2 rounded pt-1 px-4 bg-white text-primary-foreground/70 font-rotunda font-bold text-lg hover:text-primary-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 font-burford">
                  encomendar
                </Button>
              </Link>
              <div className="text-white text-opacity-90 text-base sm:text-3xl md:text-3xl drop-shadow-lg font-semibold font-burford">
                Mirtilos<br />Framboesas<br />groselhas
              </div>
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
          <p className="text-lg leading-relaxed px-20 py-10">
            Produção de frutos vermelhos no centro do país.
          </p>
        </section>

        {/* About */}
        <AboutSection />

        <section>
          <Image
          src="imgs/PR-01.webp"
          alt="PICO DA ROSA logo"
          width={4032}
          height={3024}
          priority

          />
          <p className="text-lg leading-relaxed px-20 py-10">
            Produção de frutos vermelhos no centro do país.
          </p>
        </section>

        {/* Products */}
        <div className="px-10">
        <Products productsData={productsData} />
        </div>


      </main>

    </div>
  );
}
