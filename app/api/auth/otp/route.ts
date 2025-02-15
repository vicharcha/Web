import { NextRequest, NextResponse } from "next/server"
import { createUser, findUserByPhone, createOTP, verifyOTP } from "@/lib/db"
import { types } from 'cassandra-driver'

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

import { sendOTP } from '@/lib/sms-service'

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, username } = await req.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }

    // Check if user exists or create new one
    let user = await findUserByPhone(phoneNumber)
    
    if (!user) {
      // Create new user
      user = await createUser({
        phone_number: phoneNumber,
        username: username || undefined,
        is_verified: false,
        phone_verified: false
      })
    }

    // Generate and store OTP
    const otp = generateOTP()
    await createOTP(user.id, otp)

    // Send OTP via SMS
    const smsSent = await sendOTP(phoneNumber, otp)

    const isDevelopment = process.env.NODE_ENV === 'development'
    return NextResponse.json({
      success: true,
      message: isDevelopment ? "Demo mode: OTP generated" : "OTP sent successfully",
      demo: isDevelopment,
      otp: isDevelopment ? otp : undefined // Only include OTP in development mode
    })

  } catch (error) {
    console.error("OTP error:", error)
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { phoneNumber, otp } = await req.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      )
    }

    // Find user by phone number
    const user = await findUserByPhone(phoneNumber)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Verify OTP
    const isValid = await verifyOTP(user.id, otp)
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      requiresUsername: !user.username,
      user: {
        id: user.id,
        username: user.username,
        phone_number: user.phone_number,
        is_verified: true,
        phone_verified: true
      }
    })

  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    )
  }
}
