"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative">
      <main className=" relative">
        <Image
          className="w-full h-screen object-cover object-top"
          src="/imgs/PR-01.webp"
          alt="PICO DA ROSA logo"
          width={1920}
          height={1080}
          priority
          style={{ marginTop: '-100px' }}
        />
        <h1 className="title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10">
          PICO DA ROSA
        </h1>
      </main>
    </div>
  );
}
