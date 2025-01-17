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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="flex flex-col h-screen">
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-h-0">
                  <TopMenu />
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                  <BottomNav />
                </div>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

