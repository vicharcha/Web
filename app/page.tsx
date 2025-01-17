"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { TopMenu } from '@/components/top-menu'
import { BottomNav } from '@/components/bottom-nav'
import { MainContent } from '@/components/main-content'
import { Sidebar } from '@/components/sidebar'
import { ChatInterface } from '@/components/chat/chat-interface'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null // Return null while redirecting
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopMenu />
        <main className="flex-1 overflow-hidden flex">
          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-2xl mx-auto">
              <MainContent />
            </div>
          </div>
          
          {/* Chat interface */}
          <div className="w-96 border-l border-border">
            <ChatInterface />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}