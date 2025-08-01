'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StickyLogoProps {
  logoSrc: string;
  fixedTop?: number;
  width?: number;
  height?: number;
}

const StickyLogo = ({
  logoSrc = './../public/logo/logo_h.svg',
  fixedTop = 80,
  width = 300,
  height = 73,
}: StickyLogoProps) => {
  const logoRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [originalTop, setOriginalTop] = useState<number | null>(null);

  useEffect(() => {
    const element = logoRef.current;
    if (!element) return;

    const getOriginalTop = () => {
      const rect = element.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    // Set original top
    setTimeout(() => {
      setOriginalTop(getOriginalTop());
    }, 100);

    const handleScroll = () => {
      if (originalTop == null) return;
      const scrollTop = window.scrollY;
      const logoTop = originalTop - scrollTop;

      if (!isFixed && logoTop <= fixedTop) {
        setIsFixed(true);
      } else if (isFixed && logoTop > fixedTop) {
        setIsFixed(false);
      }
    };

    const throttled = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttled);
    window.addEventListener('resize', () => {
      setOriginalTop(getOriginalTop());
    });

    return () => {
      window.removeEventListener('scroll', throttled);
    };
  }, [originalTop, isFixed, fixedTop]);

  return (
    <div
      ref={logoRef}
      className={`z-50 transition-all duration-300 ease-out ${
        isFixed ? 'fixed left-1/2 -translate-x-1/2' : 'relative'
      }`}
      style={isFixed ? { top: `${fixedTop}px` } : {}}
    >
      <div className="flex items-center justify-center">
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Sticky Logo"
            width={width}
            height={height}
            className="scale-80 invert pr-2 pt-3 pb-10"
            priority
          />
        </Link>
      </div>
    </div>
  );
};

export default StickyLogo;
