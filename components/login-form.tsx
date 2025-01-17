"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone')
  const [name, setName] = useState('')
  const { login, verifyOTP, setUserName } = useAuth()
  const router = useRouter()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(phoneNumber)
    setStep('otp')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await verifyOTP(otp)
    if (isValid) {
      setStep('name')
    } else {
      alert('Invalid OTP')
    }
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUserName(name)
    router.push('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Vicharcha</CardTitle>
          <CardDescription>
            {step === 'phone' && "Enter your phone number to get started"}
            {step === 'otp' && "Enter the OTP sent to your phone"}
            {step === 'name' && "What's your name?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit}>
              <Input
                type="tel"
                placeholder="Phone number"
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
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4"
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
              <Button type="submit" className="w-full">Complete Sign Up</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

