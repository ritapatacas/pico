"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, Star, Minus, Plus, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray px-4 py-12 w-full">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
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
          <h2 className="text-2xl font-medium mb-2"></h2>
          <p className="text-gray-600 max-w-2xl text-s">
            <br></br><b>Rosa Américo - Fruta Miúda</b>
            <br></br>Rua Américo Pinto da Silva 219
            <br></br>3270-154 Troviscais, Pedrógão Grande
          </p>
          <p className="text-gray-400 max-w-2xl text-s">
          <br></br>info@picodarosa.pt
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-12">
        {/* Social */}
        
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={() => window.open(
              'https://www.instagram.com/opicodarosa/',
              '_blank',
              'noopener,noreferrer'
            )}
          >
            <span className="sr-only">Share on Instagram</span>
            <Instagram className="w-5 h-5" />
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
          <Link
            href="https://maps.app.goo.gl/nVRRADEmNuzbJLsz5"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Google Maps
          </Link>
        </nav>



        <div className="border-t border-gray-300 pt-4">
          <div className="text-sm text-gray-600">
            <div className="mb-1">Published 16/09/2018</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
