import Image from "next/image";
import VercelTabs from "@/components/VercelTabs";
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <main>
      <Header />
      

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
