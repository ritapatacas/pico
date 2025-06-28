"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook } from "lucide-react"
import { siGooglemaps, siInstagram } from "simple-icons"

export function Footer() {
  return (
    <footer className="h-full">
      <div className="h-10 w-full ">

        <Image
          className="h-full object-cover scale-200"
          src="/imgs/roza_eyes.png"
          alt="Roza eyes"
          width={1920}
          height={38}
          priority
        />
      </div>

      <div className="bg-gray px-4 py-10 w-full">
        <div className="container mx-auto max-w-4xl">
          <div className="mt-2 mb-8">
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

            <div id="footer-text" className="px-2">
              <h2 className="text-2xl font-medium mb-2"></h2>
              <p className="text-gray-600 max-w-2xl text-md">
                <br></br><b>Rosa Américo - Fruta Miúda</b>
                <span className="text-gray-600 max-w-2xl text-s">
                  <br></br>Rua Américo Pinto da Silva 219
                  <br></br>3270-154 Troviscais, Pedrógão Grande

                </span>
              </p>
              <p className="text-gray-700 max-w-2xl text-s">
                <br></br><b>info@picodarosa.pt</b>
              </p>
              <br></br>
              <p className="text-gray-700 max-w-2xl text-md">
                NIF: <b>236 427 660</b><br></br>
                IBAN: <b>PT50 0035 0085 00097819000 25</b>
              </p>
            </div>

          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-12 px-2">


            {/* Social */}
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-all duration-200 hover:drop-shadow-lg"
                onClick={() => window.open(
                  'https://www.instagram.com/opicodarosa/',
                  '_blank',
                  'noopener,noreferrer'
                )}
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={siInstagram.path} />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-all duration-200 hover:drop-shadow-lg"
                onClick={() => window.open(
                  'https://maps.app.goo.gl/nVRRADEmNuzbJLsz5',
                  '_blank',
                  'noopener,noreferrer'
                )}
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



          <div className="border-t border-gray-300">
            <div className="text-sm text-gray-600">
              <div className="mb-9">Published 16/09/2018</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
