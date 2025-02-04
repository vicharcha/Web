"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'components/ui/card'
import { Alert, AlertDescription } from 'components/ui/alert'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('+91')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'name' | 'verification'>('phone')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { login, verifyOTP, setUserName, startDigiLockerVerification, checkVerificationStatus } = useAuth()
  const router = useRouter()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(phoneNumber)
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid phone number')
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await verifyOTP(otp)
    if (isValid) {
      setStep('name')
    } else {
      setError('Invalid OTP')
    }
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUserName(name)
    setStep('verification')
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await startDigiLockerVerification()
      const status = await checkVerificationStatus()
      if (status === 'pending') {
        router.push('/')
      } else {
        setError('Verification failed')
      }
    } catch (err) {
      setError('Verification failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to Vicharcha</CardTitle>
          <CardDescription>
            {step === 'phone' && "Enter your Indian mobile number"}
            {step === 'otp' && "Enter the OTP sent to your phone"}
            {step === 'name' && "What's your name?"}
            {step === 'verification' && "Verify your identity"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit}>
              <Input
                type="tel"
                placeholder="+91 99999 99999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" className="w-full">Send OTP</Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4"
                maxLength={6}
              />
              <Button type="submit" className="w-full">Verify OTP</Button>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={handleNameSubmit}>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          )}

          {step === 'verification' && (
            <form onSubmit={handleVerificationSubmit}>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Why verify with DigiLocker?</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Get verified badge
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Access premium features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Enhanced trust in the community
                    </li>
                  </ul>
                </div>
                <Button type="submit" className="w-full">
                  Verify with DigiLocker
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

