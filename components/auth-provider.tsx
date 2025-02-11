"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phoneNumber: string) => Promise<void>
  verifyOtp: (otp: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Protect routes
  useEffect(() => {
    if (!loading) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.push('/login')
      } else if (user && publicRoutes.includes(pathname)) {
        router.push('/')
      }
    }
  }, [user, loading, pathname, router])

  const checkAuth = async () => {
    try {
      // Check local storage first
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        // Verify user still exists
        const response = await fetch(`/api/login?phoneNumber=${userData.phoneNumber}`)
        if (response.ok) {
          const user = await response.json()
          setUser(user)
        } else {
          // Clear invalid user data
          localStorage.removeItem('user')
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (phoneNumber: string): Promise<void> => {
    setLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      // For demo, we'll use mock OTP flow
      localStorage.setItem('pendingAuth', phoneNumber)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (otp: string): Promise<void> => {
    setLoading(true)
    try {
      const phoneNumber = localStorage.getItem('pendingAuth')
      if (!phoneNumber) throw new Error("No pending authentication")

      const response = await fetch("/api/login", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          verificationStatus: "verified",
        }),
      })

      if (!response.ok) throw new Error("Verification failed")

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.removeItem('pendingAuth')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock auth state helper for testing
export const mockAuthState = async (userData: Partial<User>) => {
  const mockUser: User = {
    phoneNumber: "1234567890",
    name: "Test User",
    verificationStatus: "verified",
    isPremium: false,
    digiLockerVerified: false,
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    ...userData
  }
  localStorage.setItem('user', JSON.stringify(mockUser))
  return mockUser
}
