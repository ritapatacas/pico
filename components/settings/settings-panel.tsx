"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Monitor, User, LogOut } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Update imports to use the consolidated file
import { useThemeSettings, useLanguageSettings } from "@/hooks/use-settings-store"
import { useAuth } from "@/hooks/use-auth"
import { ColorSelectorDropdown } from "@/components/settings/color-selector-dropdown"

export function SettingsPanel() {
  const { theme, setTheme } = useTheme()
  const { radiusValue, setRadiusValue } = useThemeSettings()
  const { language, setLanguage, t } = useLanguageSettings()
  const { user, isAuthenticated, signOut } = useAuth()

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
    <div className="space-y-2 px-5 pl-8">

      {/* divider border */}
      <div className="border-b border-gray-300 my-2 mb-5" />
      
      {/* sidebar settings theme */}
      <div className="flex items-center justify-between h-6">
        <h3 className="text-sm font-rotunda-regular mr-5">{t("theme")}</h3>
        <ToggleGroup type="single" value={theme || "system"} onValueChange={handleThemeChange} className=" h-6 p-0 w-18">
          <ToggleGroupItem value="light" aria-label="Light Mode" title="Light Mode" className="text-md flex-1  h-6">
            <Sun className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark Mode" title="Dark Mode" className="text-md flex-1  h-6">
            <Moon className="h-3 w-3" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* sidebar settings language */}
      <div className="flex items-center justify-between h-6">
        <h3 className="text-sm font-rotunda-regular mr-5">{t("language")}</h3>
        <ToggleGroup type="single" value={language} onValueChange={handleLanguageChange} className=" h-6 p-0 w-18">
          <ToggleGroupItem value="en" aria-label="English" title="English" className="text-xs text-black flex-1  h-6">
            <span>{t("english")}</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="pt" aria-label="Portuguese" title="Portuguese" className="text-xs flex-1  h-6">
            <span>{t("portuguese")}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isAuthenticated && user && (
        <>
          {/* sidebar settings account */}
          <div className="flex items-center justify-between h-6">
            <h3 className="text-sm font-rotunda-regular self-center">{t("auth.account")}</h3>
            {/*             <Button variant="ghost" size="sm" className="px-2 text-xs self-start h-6">
              <User className="mr-1 h-3 w-3 " />
              <span>{user.name}</span>
            </Button> */}
          </div>

          {/* sidebar settings logout */}
          <div className="flex items-center h-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-s hover:text-red-700 hover:bg-red-50 h-6"
            >
              <LogOut className="mr-1 h-3 w-3 mb-1" />
              <span className="text-sm font-rotunda-regular">{t("auth.signOut")}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
