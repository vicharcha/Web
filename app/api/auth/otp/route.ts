import { NextRequest, NextResponse } from "next/server"
import { createUser, findUserByPhone, createOTP, verifyOTP } from "@/lib/db"
import { types } from 'cassandra-driver'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioClient = twilio(accountSid, authToken)

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// Send OTP using Twilio
const sendOTP = async (phoneNumber: string, otp: string) => {
  try {
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    })
    return true
  } catch (error) {
    console.error("Failed to send OTP via Twilio:", error)
    return false
  }
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

    // Send OTP via Twilio
    const otpSent = await sendOTP(phoneNumber, otp)
    if (!otpSent) {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully"
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
    const isValidOTP = await verifyOTP(user.id, otp)
    if (!isValidOTP) {
      return NextResponse.json(
        { error: "Invalid OTP" },
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
