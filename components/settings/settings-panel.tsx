"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

// Update imports to use the consolidated file
import { useThemeSettings, useLanguageSettings } from "@/hooks/use-settings-store"
import { ColorSelectorDropdown } from "@/components/settings/color-selector-dropdown"

export function SettingsPanel() {
  const { theme, setTheme } = useTheme()
  const { radiusValue, setRadiusValue } = useThemeSettings()
  const { language, setLanguage, t } = useLanguageSettings()

  const handleThemeChange = (value: string) => {
    if (value) {
      try {
        setTheme(value)
      } catch (error) {
        console.error("Error setting theme:", error)
      }
    }
  }

  const handleLanguageChange = (value: string) => {
    if (value && (value === "en" || value === "pt")) {
      try {
        setLanguage(value as "en" | "pt")
      } catch (error) {
        console.error("Error setting language:", error)
      }
    }
  }

  const radiusValues = [
    { value: "0", label: "0" },
    { value: "0.3", label: "0.3" },
    { value: "0.5", label: "0.5" },
    { value: "0.75", label: "0.75" },
    { value: "1.0", label: "1.0" },
  ]

  return (
    <div className="space-y-6 px-5">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">{t("theme")}</h3>
        <ToggleGroup type="single" value={theme || "system"} onValueChange={handleThemeChange} className="w-auto">
          <ToggleGroupItem value="light" aria-label="Light Mode" title="Light Mode" className="px-2">
            <Sun className="mr-2 h-4 w-4" />
            <span>{t("light")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark Mode" title="Dark Mode" className="px-2">
            <Moon className="mr-2 h-4 w-4" />
            <span>{t("dark")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">{t("language")}</h3>
        <ToggleGroup type="single" value={language} onValueChange={handleLanguageChange} className="w-auto">
          <ToggleGroupItem value="en" aria-label="English" title="English" className="px-4">
            <span>{t("english")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="pt" aria-label="Portuguese" title="Portuguese" className="px-4">
            <span>{t("portuguese")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

    </div>
  )
}
