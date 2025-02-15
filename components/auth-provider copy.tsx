"use client"

import { createContext, useContext, ReactNode } from "react"

import { User } from "../lib/types";

interface AuthContextType {
  user: User | null
  signIn?: () => Promise<void>
  signOut?: () => Promise<void>
}

const defaultUser: User = {
  id: "1",
  name: "Demo User",
  phoneNumber: "1234567890",
  verificationStatus: "verified",
  isPremium: false,
  digiLockerVerified: false,
  joinedDate: new Date().toISOString(),
  lastActive: new Date().toISOString()
}

const AuthContext = createContext<AuthContextType>({
  user: defaultUser
})

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo purposes, always return a default user
  const value = {
    user: defaultUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
