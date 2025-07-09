"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StickyTopbar({ logoRef }: { logoRef: React.RefObject<HTMLDivElement | null> }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsSticky(entry.intersectionRatio < 1);
    }, { threshold: [1] });

    if (logoRef.current) observer.observe(logoRef.current);
    return () => observer.disconnect();
  }, [logoRef]);

  return (
    <div className={`fixed top-0 left-0 w-full h-20 z-[100] bg-white shadow-md flex items-center transition-opacity duration-500 ease-in-out ${isSticky ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <Link href="/">
        <Image className={`transition-all duration-250 ${isSticky ? "scale-80" : "scale-80 invert"} pr-1`} src="logo/logo_h.svg" alt="PICO DA ROSA logo" width={300} height={73} priority />
      </Link>
      <Link href="/products">
        <Button className="bg-primary text-white font-bold">Encomendar</Button>
      </Link>
    </div>
  );
} 