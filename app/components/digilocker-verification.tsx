"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface DigiLockerVerificationProps {
  username: string
  onVerificationComplete?: () => void
}

export function DigiLockerVerification({ username, onVerificationComplete }: DigiLockerVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerification = async () => {
    setIsVerifying(true)
    try {
      const response = await fetch("/api/auth/digilocker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
      
      if (!response.ok) {
        throw new Error("DigiLocker verification failed")
      }
      
      // Handle the DigiLocker redirect URL from the response
      const { redirectUrl } = await response.json()
      window.location.href = redirectUrl
      
      if (onVerificationComplete) {
        onVerificationComplete()
      }
    } catch (error) {
      toast.error("DigiLocker verification failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Connect with DigiLocker to verify your identity and access additional features. DigiLocker is a secure digital locker service by the Government of India.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Benefits of verification:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verified user badge</li>
              <li>Access to premium features</li>
              <li>Higher trust score</li>
              <li>Priority support</li>
            </ul>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800"
            onClick={handleVerification}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Connecting to DigiLocker...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Verify with DigiLocker</span>
              </div>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By verifying, you agree to share your DigiLocker profile information with us.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
