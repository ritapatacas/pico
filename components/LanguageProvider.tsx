"use client"

import { useEffect } from "react"
import { useLanguageSettings } from "@/hooks/use-settings-store"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageSettings()

  useEffect(() => {
    // Update the lang attribute of the html element
    document.documentElement.lang = language
  }, [language])

  return <>{children}</>
} 