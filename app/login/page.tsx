"use client"

import { Card, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function LoginPage() {
  const [step, setStep] = useState("email")
  const [otp, setOtp] = useState("")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Card>
        <div className="p-6">{/* rest of code here */}</div>
        <CardFooter className="flex flex-col gap-4">
          {step === "otp" && (
            <>
<Button
  variant="ghost"
  onClick={() => {
    setStep("email")
  }}
              >
                Change Phone Number
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive OTP?{" "}
                <Button variant="link" className="p-0 h-auto">
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
