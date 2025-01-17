"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { TopMenu } from '@/components/top-menu'
import { BottomNav } from '@/components/bottom-nav'
import { MainContent } from '@/components/main-content'
import { Sidebar } from '@/components/sidebar'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    // Handle authentication redirect
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    // Simulate page content loading
    if (user) {
      const timer = setTimeout(() => {
        setIsPageLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

  // Show loading state while checking auth or loading page
  if (authLoading || isPageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Return null if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top menu - fixed at the top */}
        <div className="sticky top-0 z-10">
          <TopMenu />
        </div>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto px-4">
            <MainContent />
          </div>
        </div>

        {/* Bottom navigation - fixed at bottom on mobile */}
        <div className="md:hidden sticky bottom-0 z-10">
          <BottomNav />
        </div>
      </main>
    </div>
  )
}