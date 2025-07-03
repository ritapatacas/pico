import Image from "next/image";
import Link from "next/link";

export function StickyHeader({ show }: { show: boolean }) {
  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'} bg-white/80 dark:bg-black/80 backdrop-blur shadow-sm`}
      style={{ pointerEvents: show ? 'auto' : 'none' }}
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center">
        <Link href="/">
          <Image
            className="transition-all duration-300 filter invert-0 dark:invert scale-110 pr-2"
            src="/PICODAROSA_logo-img.svg"
            alt="PICO DA ROSA logo"
            width={60}
            height={20}
            priority
          />
        </Link>
        <Link href="/">
          <Image
            className="transition-all duration-300 filter invert-0 dark:invert scale-100"
            src="/PICODAROSA_text-img.png"
            alt="PICO DA ROSA text logo"
            width={100}
            height={22}
            priority
          />
        </Link>
      </div>
    </div>
  );
} 