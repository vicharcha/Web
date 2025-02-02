"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ContentFilterProps {
  onFilterChange: (filters: { keywords: string[]; safeMode: boolean }) => void
}

export function ContentFilter({ onFilterChange }: ContentFilterProps) {
  const [keywords, setKeywords] = useState<string[]>([])
  const [safeMode, setSafeMode] = useState<boolean>(false)

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeywords = e.target.value.split(",").map((kw) => kw.trim())
    setKeywords(newKeywords)
    onFilterChange({ keywords: newKeywords, safeMode })
  }

  const handleSafeModeChange = (checked: boolean) => {
    setSafeMode(checked)
    onFilterChange({ keywords, safeMode: checked })
  }

  return (
    <div className="p-4 border rounded-lg">
      <Label htmlFor="keywords">Keywords (comma-separated)</Label>
      <Input
        id="keywords"
        type="text"
        value={keywords.join(", ")}
        onChange={handleKeywordChange}
        placeholder="Enter keywords to filter content"
      />
      <div className="mt-4 flex items-center space-x-2">
        <Switch
          id="safe-mode"
          checked={safeMode}
          onCheckedChange={handleSafeModeChange}
        />
        <Label htmlFor="safe-mode">Safe Mode</Label>
      </div>
    </div>
  )
}
