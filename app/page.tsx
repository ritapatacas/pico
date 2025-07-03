"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      <main className=" relative">
        <div className="">

          <Image
            className="w-full h-screen object-cover object-top"
            src="/imgs/PR-01.webp"
            alt="PICO DA ROSA logo"
            width={1920}
            height={1080}
            priority
            style={{ marginTop: '-100px' }}
          />
          <div className="flex items-center ">


              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10">
            <div className="pb-5">
                <h2 className="title pb-3">
                  Fruta Miúda<br></br>
                </h2>
                <h3 className="subtitle text-md">
                  A crescer em Pedrógão Grande
                </h3>
              </div>

              <Link href="/mirtilos" passHref>
                <Button className="absolute text-white text-xl font-bold rounded transition pt-1 z-10 transform transition-transform duration-300 hover:scale-90 hover:shadow-lg active:scale-95" style={{ backgroundColor: 'rgb(25, 19, 39)' }}>
                  Encomendar Mirtilos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div>
        </div>

      </main>
    </div>
  );
}
