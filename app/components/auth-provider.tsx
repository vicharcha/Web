"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type VerificationStatus = "unverified" | "pending" | "verified"

type User = {
  phoneNumber: string
  name: string
  email?: string
  verificationStatus: VerificationStatus
  isPremium: boolean
  digiLockerVerified: boolean
  joinedDate: string
  lastActive: string
} | null

type AuthContextType = {
  user: User
  login: (phoneNumber: string) => Promise<void>
  logout: () => void
  verifyOTP: (otp: string) => Promise<boolean>
  setUserName: (name: string) => void
  startDigiLockerVerification: () => Promise<void>
  checkVerificationStatus: () => Promise<VerificationStatus>
  upgradeToPremuim: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const validateIndianPhoneNumber = (phone: string) => {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      localStorage.removeItem("user")
    }
  }, [])

  const login = async (phoneNumber: string) => {
    if (!phoneNumber.startsWith("+91")) {
      throw new Error("Only Indian phone numbers (+91) are allowed")
    }

    const cleanNumber = phoneNumber.replace("+91", "")
    if (!validateIndianPhoneNumber(cleanNumber)) {
      throw new Error("Invalid phone number format")
    }

    try {
      const newUser = {
        phoneNumber,
        name: "",
        verificationStatus: "unverified" as const,
        isPremium: false,
        digiLockerVerified: false,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Error during login:", error)
      throw new Error("Login failed. Please try again.")
    }
  }

  const startDigiLockerVerification = async () => {
    if (!user) {
      throw new Error("User must be logged in to start verification")
    }

    try {
      // Simulate DigiLocker API integration
      const updatedUser = {
        ...user,
        verificationStatus: "pending" as const,
        digiLockerVerified: false,
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Redirect to DigiLocker OAuth page
      window.location.href = "https://api.digitallocker.gov.in/public/oauth2/1/authorize"
    } catch (error) {
      console.error("Error during DigiLocker verification:", error)
      throw new Error("Verification process failed. Please try again.")
    }
  }

  const checkVerificationStatus = async (): Promise<VerificationStatus> => {
    if (!user) {
      return "unverified"
    }

    try {
      // Simulate checking DigiLocker verification status
      if (user.digiLockerVerified) {
        return "verified"
      }
      return user.verificationStatus
    } catch (error) {
      console.error("Error checking verification status:", error)
      throw new Error("Unable to check verification status")
    }
  }

  const verifyOTP = async (otp: string): Promise<boolean> => {
    if (!otp || otp.length !== 6) {
      throw new Error("Invalid OTP format")
    }

    try {
      // Simulate OTP verification
      return true
    } catch (error) {
      console.error("Error during OTP verification:", error)
      throw new Error("OTP verification failed")
    }
  }

  const setUserName = (name: string) => {
    if (!user) {
      throw new Error("User must be logged in to set name")
    }

    if (!name.trim()) {
      throw new Error("Name cannot be empty")
    }

    try {
      const updatedUser = { ...user, name }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error setting user name:", error)
      throw new Error("Failed to update user name")
    }
  }

  const upgradeToPremuim = async () => {
    if (!user) {
      throw new Error("User must be logged in to upgrade")
    }

    try {
      const updatedUser = { ...user, isPremium: true }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error upgrading to premium:", error)
      throw new Error("Failed to upgrade to premium")
    }
  }

  const logout = () => {
    try {
      setUser(null)
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        verifyOTP,
        setUserName,
        startDigiLockerVerification,
        checkVerificationStatus,
        upgradeToPremuim,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

