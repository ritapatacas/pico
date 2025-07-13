"use client"

import Image from "next/image"
import { siGooglemaps, siInstagram } from "simple-icons"

interface SocialNavProps {
  className?: string
}

export function SocialNav({ className = "" }: SocialNavProps) {
  return (
    <nav className={`flex flex-wrap gap-x-4 gap-y-2 ${className}`}>
      <div className="flex items-center space-x-4">
        <button
          className="text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 scale-75 invert hover:scale-80 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 rounded-lg p-1"
          onClick={() => window.open(
            'https://reformaagraria.pt/perfis/10243/',
            '_blank',
            'noopener,noreferrer'
          )}
          title="Visit Reforma Agraria"
        >
          <span className="sr-only">Reforma Agraria</span>
          <div className="w-5 h-10 flex items-center justify-center">
            {/* Black logo for light theme */}
            <Image
              src="/reforma-agraria-logo-black.svg"
              alt="Reforma Agraria"
              width={33}
              height={65}
              className="block dark:hidden opacity-70 hover:opacity-100 transition-all duration-300"
            />
            {/* White logo for dark theme */}
            <Image
              src="/reforma-agraria-logo-white.png"
              alt="Reforma Agraria"
              width={33}
              height={65}
              className="hidden dark:block opacity-70 hover:opacity-100 transition-all duration-300"
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
    </nav>
  )
} 