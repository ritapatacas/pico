"use client"

import Image from "next/image"
import { useLanguageSettings } from "@/hooks/use-settings-store"
import { SocialNav } from "./SocialNav"

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

      <div className="bg-white text-secondary-foreground px-6 pt-7 w-full">
        <div className="container mx-auto max-w-4xl">
          <div className="mt-2 mb-5">

            { /* logo */ }
            <div className="flex items-center space-x-2">
              <Image
                className=""
                src="/PICODAROSA_logo.png"
                alt="PICO DA ROSA logo"
                width={50}
                height={38}
                priority
              />
              <Image
                className=""
                src="/PICODAROSA_text-img.png"
                alt="PICO DA ROSA text logo"
                width={150}
                height={38}
                priority
              />

            </div>

            { /* contact info */ }
            <div id="footer-text" className="px-2">
              <h2 className="text-2xl font-medium mb-2"></h2>
              <p className="text-secondary-foreground/90 max-w-2xl text-md">
                <br></br><b>Rosa Américo - Fruta Miúda</b>
                <span className="text-secondary-foreground/80 max-w-2xl text-s">
                  <br></br>{t("footer.address")}
                  <br></br>{t("footer.city")}

                </span>
              </p>
              <p className="text-secondary-foreground max-w-2xl text-s">
                <br></br><b>{t("footer.email")}</b>
              </p>
              <br></br>
              <p className="text-secondary-foreground max-w-2xl text-md">
                {t("footer.nif")}: <b>236 427 660</b><br></br>
                {t("footer.iban")}: <b>PT50 0035 0085 00097819000 25</b>
              </p>
            </div>

          </div>

          { /* social */ }
            <SocialNav className="mb-4 px-2"/>

          { /* divider */ }
          <div className="border-t border-primary-foreground/20" />

          { /* copyright */ }
          <div className="text-sm text-secondary-foreground/70">
            <div className="pb-4">{t("footer.published")}</div>

          </div>
        </div>
      </div>
    </footer>
  )
}
