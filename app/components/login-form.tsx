"use client"

import { useState } from "react"
import { useAuth } from "@/app/components/auth-provider" // Updated import path
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function LoginForm() {
  const { login, verifyOTP } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`
      await login(formattedPhone)
      setIsOtpSent(true)
      toast.success("OTP sent successfully!")
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
      const isVerified = await verifyOTP(otp)
      if (isVerified) {
        toast.success("Successfully logged in!")
        // Router will handle redirect in auth provider
      } else {
        toast.error("Invalid OTP")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Vicharcha</CardTitle>
        <CardDescription>
          {isOtpSent
            ? "Enter the OTP sent to your phone"
            : "Enter your phone number to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={isOtpSent ? handleVerifyOTP : handleSendOTP}>
          {!isOtpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  pattern="^(\+91)?[6-9]\d{9}$"
                  className="text-base"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  pattern="\d{6}"
                  maxLength={6}
                  className="text-lg tracking-widest text-center"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {isOtpSent && (
          <Button
            variant="ghost"
            onClick={() => {
              setIsOtpSent(false)
              setOtp("")
            }}
          >
            Change Phone Number
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

