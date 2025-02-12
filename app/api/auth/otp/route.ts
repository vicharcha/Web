import { NextRequest, NextResponse } from "next/server"
import { createUser, findUserByPhone, createOTP, verifyOTP } from "@/lib/db"
import { types } from 'cassandra-driver'

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// This would be implemented with a proper SMS service
const mockSendOTP = async (phoneNumber: string, otp: string) => {
  console.log(`Mock: Sending OTP ${otp} to ${phoneNumber}`)
  return true
}

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

    // For demo purposes, always show OTP
    console.log("Generated OTP:", otp)
    return NextResponse.json({
      success: true,
      message: "Demo mode: OTP generated",
      demo: true,
      otp: otp // Include OTP in response for demo
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

    // Demo mode - accept any 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: "Please enter 6 digits" },
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
