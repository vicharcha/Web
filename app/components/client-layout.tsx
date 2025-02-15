"use client"

import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/app/components/sidebar"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="relative flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
