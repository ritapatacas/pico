"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook } from "lucide-react"
import { siGooglemaps, siInstagram } from "simple-icons"
import { useLanguageSettings } from "@/hooks/use-settings-store"

export function Footer() {
  const { t } = useLanguageSettings()

  return (
    <footer className="h-full">
      <div className="h-15 max-w-screen overflow-hidden">

        <Image
          className="h-full object-cover scale-200"
          src="/imgs/roza_eyes.webp"
          alt="Roza eyes"
          width={1920}
          height={38}
          priority
        />
      </div>

      <div className="bg-primary text-primary-foreground px-4 pt-10 w-full">
        <div className="container mx-auto max-w-4xl">
          <div className="mt-2 mb-8">
            <div className="flex items-center space-x-2">
              <Image
                className="dark:invert"
                src="/PICODAROSA_logo.png"
                alt="PICO DA ROSA logo"
                width={50}
                height={38}
                priority
              />
              <Image
                className="dark:invert"
                src="/PICODAROSA_text-img.png"
                alt="PICO DA ROSA text logo"
                width={150}
                height={38}
                priority
              />

            </div>

            <div id="footer-text" className="px-2">
              <h2 className="text-2xl font-medium mb-2"></h2>
              <p className="text-primary-foreground/90 max-w-2xl text-md">
                <br></br><b>Rosa Américo - Fruta Miúda</b>
                <span className="text-primary-foreground/80 max-w-2xl text-s">
                  <br></br>{t("footer.address")}
                  <br></br>{t("footer.city")}

                </span>
              </p>
              <p className="text-primary-foreground max-w-2xl text-s">
                <br></br><b>{t("footer.email")}</b>
              </p>
              <br></br>
              <p className="text-primary-foreground max-w-2xl text-md">
                {t("footer.nif")}: <b>236 427 660</b><br></br>
                {t("footer.iban")}: <b>PT50 0035 0085 00097819000 25</b>
              </p>
            </div>

          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-4 px-2">


            {/* Social */}
            <div className="flex items-center space-x-4">
              <button
                className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 scale-80 hover:scale-90 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 rounded-lg p-1"
                onClick={() => window.open(
                  'https://reformaagraria.pt/',
                  '_blank',
                  'noopener,noreferrer'
                )}
                title="Visit Reforma Agraria"
              >
                <span className="sr-only">Reforma Agraria</span>
                <div className="w-5 h-10 flex items-center justify-center">
                  <Image
                    src="/reforma-agraria-logo-white.png"
                    alt="Reforma Agraria"
                    width={33}
                    height={65}
                    className="opacity-70 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 rounded-lg p-1"
                onClick={() => window.open(
                  'https://www.instagram.com/opicodarosa/',
                  '_blank',
                  'noopener,noreferrer'
                )}
                title="Follow us on Instagram"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={siInstagram.path} />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 rounded-lg p-1"
                onClick={() => window.open(
                  'https://maps.app.goo.gl/nVRRADEmNuzbJLsz5',
                  '_blank',
                  'noopener,noreferrer'
                )}
                title="Find us on Google Maps"
              >
                <span className="sr-only">Google Maps</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={siGooglemaps.path} />
                </svg>
              </button>
            </div>

            {/*           <Link href="/" className="hover:underline">
            Heim
          </Link>
          <Link href="/om-smio" className="hover:underline">
            Om SmiO
          </Link>
          <Link href="#" className="hover:underline">
            +
          </Link>
          <Link href="/meld-deg-inn" className="hover:underline">
            Meld deg inn!
          </Link>
          <Link href="/klassiske-bokverk" className="hover:underline">
            Klassiske bokverk
          </Link>
          <Link href="/bibelen" className="hover:underline">
            Bibelen
          </Link> */}

          </nav>



          <div className="border-t border-primary-foreground/20">
            <div className="text-sm text-primary-foreground/70">
              <div className="pb-4">{t("footer.published")}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
