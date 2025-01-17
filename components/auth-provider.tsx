"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  phoneNumber: string
  name: string
} | null

type AuthContextType = {
  user: User
  login: (phoneNumber: string) => Promise<void>
  logout: () => void
  verifyOTP: (otp: string) => Promise<boolean>
  setUserName: (name: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (phoneNumber: string) => {
    // Simulate API call to send OTP
    console.log(`Sending OTP to ${phoneNumber}`)
    // In a real app, you'd make an API call here
    setUser({ phoneNumber, name: '' })
  }

  const verifyOTP = async (otp: string) => {
    // Simulate OTP verification
    console.log(`Verifying OTP: ${otp}`)
    // In a real app, you'd verify the OTP with your backend here
    return true
  }

  const setUserName = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyOTP, setUserName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

