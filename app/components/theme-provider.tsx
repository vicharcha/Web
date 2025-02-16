"use client"

import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { defaultThemes } from "@/lib/theme-settings"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const response = await fetch("/api/settings/theme")
        const data = await response.json()
        
        // Apply color theme if available
        if (data.colorTheme) {
          const selectedTheme = defaultThemes.find(t => t.id === data.colorTheme)
          if (selectedTheme) {
            const root = document.documentElement
            Object.entries(selectedTheme.colors).forEach(([key, value]) => {
              root.style.setProperty(`--${key}`, value)
            })
          }
        }
      } catch (error) {
        console.error("Failed to load theme preferences:", error)
      }
    }
    
    loadThemePreferences()
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
