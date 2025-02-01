import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "./components/sidebar"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vicharcha",
  description: "A responsible social media application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="flex-1 pt-16 pb-20 md:pt-0 md:pb-0">
                <div className="container mx-auto p-4">{children}</div>
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

