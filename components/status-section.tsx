"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function StatusSection() {
  const [status, setStatus] = useState("")

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value)
  }

  const handleSubmit = () => {
    // Handle status submission
    console.log("Status submitted:", status)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Status</h2>
      <Input
        type="text"
        placeholder="What's on your mind?"
        value={status}
        onChange={handleStatusChange}
      />
      <Button onClick={handleSubmit}>Post</Button>
    </div>
  )
}
