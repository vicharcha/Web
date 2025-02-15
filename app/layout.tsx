import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"
import { Sidebar } from "@/app/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vicharcha",
  description: "A responsible social media application",
  keywords: [
    "social media",
    "responsible",
    "community",
    "connection",
    "sharing",
    "india",
    "verified",
  ],
  authors: [
    {
      name: "Vicharcha Team",
    },
  ],
  creator: "Vicharcha",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vicharcha.com",
    title: "Vicharcha - A Responsible Social Media Application",
    description: "Connect, share, and engage responsibly with verified users",
    siteName: "Vicharcha",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vicharcha",
    description: "A responsible social media application",
    creator: "@vicharcha",
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
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
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
