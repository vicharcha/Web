"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Settings() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="theme-toggle"
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
        />
        <Label htmlFor="theme-toggle">Dark Mode</Label>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => alert("Logout functionality not implemented")}>
          Logout
        </Button>
        <Button onClick={() => alert("Login functionality not implemented")}>
          Login
        </Button>
      </div>
    </div>
  )
}
