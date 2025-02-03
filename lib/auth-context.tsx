"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type VerificationStatus = "unverified" | "pending" | "verified"

type User = {
  phoneNumber: string
  name: string
  verificationStatus: VerificationStatus
  isPremium: boolean
} | null

type AuthContextType = {
  user: User
  login: (phoneNumber: string) => Promise<void>
  logout: () => void
  verifyOTP: (otp: string) => Promise<boolean>
  setUserName: (name: string) => void
  startDigiLockerVerification: () => Promise<void>
  checkVerificationStatus: () => Promise<VerificationStatus>
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
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
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

    // Simulate API call to send OTP
    console.log(`Sending OTP to ${phoneNumber}`)
    setUser({
      phoneNumber,
      name: "",
      verificationStatus: "unverified",
      isPremium: false,
    })
  }

  const startDigiLockerVerification = async () => {
    // Simulate DigiLocker API integration
    console.log("Starting DigiLocker verification flow")
    if (user) {
      const updatedUser = { ...user, verificationStatus: "pending" }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const checkVerificationStatus = async (): Promise<VerificationStatus> => {
    // Simulate checking DigiLocker verification status
    if (user) {
      const status = user.verificationStatus
      return status
    }
    return "unverified"
  }

  const verifyOTP = async (otp: string) => {
    // Simulate OTP verification
    console.log(`Verifying OTP: ${otp}`)
    return true
  }

  const setUserName = (name: string) => {
    if (user) {
      const updatedUser = { ...user, name }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
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

