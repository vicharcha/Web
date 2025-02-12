"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function LoginForm() {
  const { login, verifyOtp } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [username, setUsername] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp" | "username">("phone")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formattedPhone = `+91${phoneNumber.replace(/^\+91/, '')}`
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      })
      
      const data = await response.json()
      setStep("otp")
      
      // Show OTP prominently for demo
      if (data.demo && data.message) {
        // Request notification permission
        if (Notification.permission === "granted") {
          new Notification("Demo OTP Code", {
            body: `Your OTP is: ${data.otp}`,
            icon: "/placeholder-logo.png"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Demo OTP Code", {
                body: `Your OTP is: ${data.otp}`,
                icon: "/placeholder-logo.png"
              });
            }
          });
        }
        
        // Show prominent toast
        toast.message(
          <div className="flex flex-col items-center space-y-2">
            <p className="font-semibold">Demo OTP Generated</p>
            <p className="text-2xl font-mono bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">
              {data.otp}
            </p>
          </div>,
          {
            duration: 10000, // Show for 10 seconds
            position: "top-center"
          }
        );
      } else {
        toast.success("OTP sent successfully!")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/otp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+91${phoneNumber.replace(/^\+91/, '')}`,
          otp
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP")
      }

      if (data.success) {
        if (data.requiresUsername) {
          setStep("username")
          toast.success("Phone number verified! Please choose a username.")
        } else if (data.user) {
          await login(`+91${phoneNumber.replace(/^\+91/, '')}`, data.user.username || '')
          await verifyOtp(otp)
          toast.success("Successfully logged in!")
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+91${phoneNumber.replace(/^\+91/, '')}`,
          username
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === "Username already taken") {
          toast.error("Username already taken. Please choose another one.")
          return
        }
        throw new Error(error.error || "Registration failed")
      }

      const { user } = await response.json()
      await login(`+91${phoneNumber.replace(/^\+91/, '')}`, username)
      toast.success("Successfully registered!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {step === "phone" && "Welcome to Vicharcha"}
            {step === "otp" && "Verify Your Number"}
            {step === "username" && "Create Your Account"}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {step === "phone" && "Enter your Indian mobile number to get started"}
            {step === "otp" && "We've sent a 6-digit code to your phone"}
            {step === "username" && "Choose a unique username for your profile"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSendOTP}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="flex">
                  <div className="inline-flex items-center px-4 border border-r-0 border-input rounded-l-md bg-muted">
                    <span className="text-sm font-medium">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const number = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhoneNumber(number)
                    }}
                    className="rounded-l-none text-lg tracking-wide"
                    maxLength={10}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Demo: Try 1234567890</p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading || phoneNumber.length !== 10}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleVerifyOTP}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const code = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtp(code)
                  }}
                  className="text-2xl tracking-[0.5em] text-center"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500">Demo: Any 6 digits work</p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-500"
                onClick={() => {
                  setStep("phone")
                  setOtp("")
                }}
              >
                Change Phone Number
              </Button>
            </motion.form>
          )}

          {step === "username" && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleUsernameSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="text-lg"
                  required
                  minLength={3}
                  pattern="^[a-z0-9_]+$"
                  title="Only lowercase letters, numbers, and underscores allowed"
                />
                <p className="text-xs text-gray-500">
                  Letters, numbers, and underscores only
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading || username.length < 3}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </motion.form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
