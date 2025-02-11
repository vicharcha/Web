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
}

export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "white" },
  { media: "(prefers-color-scheme: dark)", color: "black" },
]

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col bg-background">
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <div className="container mx-auto p-4 pt-16 pb-20 md:pt-4 md:pb-4">
                    {children}
                  </div>
                </main>
              </div>
            </div>
            <Toaster richColors closeButton position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
