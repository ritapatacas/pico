"use client";
import StickyTopbar from "@/components/StickyTopbar";
import Link from "next/link";
import Image from "next/image";

export default function HeroWithStickyTopbar() {
  const { useRef } = require("react");
  const logoRef = useRef(null);
  return (
    <>
      <StickyTopbar logoRef={logoRef} />
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
    </>
  );
} 