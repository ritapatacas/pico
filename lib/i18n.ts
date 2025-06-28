import enTranslations from "@/locales/en.json"
import ptTranslations from "@/locales/pt.json"

export type Language = "en" | "pt"

export const translations: Record<Language, Record<string, any>> = {
  en: enTranslations,
  pt: ptTranslations,
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}
