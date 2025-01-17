import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { Sidebar } from '@/components/layout/sidebar/sidebar'
import { TopMenu } from '@/components/layout/top-menu/top-menu'
import { BottomNav } from '@/components/layout/bottom-nav/bottom-nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vicharcha App',
  description: 'Connect, Share, and Engage with Vicharcha',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {isDev && (
          <div className="bg-red-500 text-white text-center p-2 text-sm">
            Development Mode
          </div>
        )}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] h-screen">
              <Sidebar />
              <div className="relative flex flex-col min-h-screen overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-pink-500/5 to-purple-500/5 pointer-events-none" />
                <TopMenu />
                <main className="flex-1 overflow-auto relative">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                  {children}
                </main>
                <BottomNav />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

