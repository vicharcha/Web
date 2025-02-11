"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login, verifyOtp } = useAuth()
  const [step, setStep] = useState("phone")
  const [processingAction, setProcessingAction] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number")
      return
    }

    setProcessingAction(true)
    try {
      await login(phoneNumber)
      toast.success("OTP sent successfully")
      setStep("otp")
    } catch (error) {
      toast.error("Failed to send OTP")
      console.error(error)
    } finally {
      setProcessingAction(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid OTP")
      return
    }

    setProcessingAction(true)
    try {
      await verifyOtp(otp)
      toast.success("Login successful")
      // Router will handle redirect due to auth state change
    } catch (error) {
      toast.error("Failed to verify OTP")
      console.error(error)
      setProcessingAction(false) // Only reset if error, success will redirect
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-violet-500/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Vicharcha</CardTitle>
          <CardDescription>
            {step === "phone" 
              ? "Enter your phone number to continue" 
              : "Enter the OTP sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                disabled={processingAction}
              />
              <Button
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white hover:opacity-90"
                onClick={handlePhoneSubmit}
                disabled={processingAction}
              >
                {processingAction ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-2xl"
                    value={otp[index] || ''}
                    disabled={processingAction}
                    onChange={(e) => {
                      const newOtp = otp.split('')
                      newOtp[index] = e.target.value
                      setOtp(newOtp.join(''))
                      
                      // Auto-focus next input
                      if (e.target.value && index < 5) {
                        const nextInput = document.querySelector(
                          `input[name="otp-${index + 1}"]`
                        ) as HTMLInputElement
                        if (nextInput) nextInput.focus()
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        const prevInput = document.querySelector(
                          `input[name="otp-${index - 1}"]`
                        ) as HTMLInputElement
                        if (prevInput) prevInput.focus()
                      }
                    }}
                    name={`otp-${index}`}
                  />
                ))}
              </div>
              <Button
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white hover:opacity-90"
                onClick={handleOtpSubmit}
                disabled={processingAction || otp.length !== 6}
              >
                {processingAction ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {step === "otp" && (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("phone")
                  setOtp("")
                }}
                disabled={processingAction}
              >
                Change Phone Number
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive OTP?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto"
                  onClick={handlePhoneSubmit}
                  disabled={processingAction}
                >
                  Resend
                </Button>
              </p>
            </>
          )}
          <div className="text-xs text-muted-foreground text-center space-y-2">
            <p>By continuing, you agree to our</p>
            <div className="flex justify-center gap-2">
              <Button variant="link" className="p-0 h-auto text-xs">
                Terms of Service
              </Button>
              <span>and</span>
              <Button variant="link" className="p-0 h-auto text-xs">
                Privacy Policy
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
