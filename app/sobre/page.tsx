import Image from "next/image";
import VercelTabs from "@/components/VercelTabs";
import { Footer } from "@/components/footer"

export default function About() {
  return (
    <main>
      <header className="fixed py-15 left-0 right-0 h-20 flex items-center justify-between px-6 bg-white shadow-md z-50">
        <div className="flex items-center space-x-6">
          <Image
            className="dark:invert"
            src="/PICODAROSA_logo.png"
            alt="PICO DA ROSA logo"
            width={180}
            height={38}
            priority
          />
          <Image
            className="dark:invert"
            src="/PICODAROSA_text-img.png"
            alt="PICO DA ROSA text logo"
            width={180}
            height={38}
            priority
          />

        </div>
  <nav>
    <VercelTabs />
  </nav>
</header>

{/* Conteúdo principal, afastado do header */}
<div className="pt-20 p-6">
<Image
            className="dark:invert"
            src="/rosa.jpeg"
            alt="PICO DA ROSA text logo"
            width={1920}
            height={38}
            priority
          />
  {/* resto da página */}
</div>
<Footer />
    </main>
  );
}
