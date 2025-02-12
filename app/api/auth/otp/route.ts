import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/cassandra"
import { v4 as uuidv4 } from "uuid"

// This should be implemented with a proper SMS service
const mockSendOTP = async (phoneNumber: string, otp: string) => {
  console.log(`Sending OTP ${otp} to ${phoneNumber}`)
  return true
}

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
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

    // Check if phone number exists
    const existingUser = await executeQuery(
      "SELECT id, username FROM social_network.users WHERE phone_number = ? ALLOW FILTERING",
      [phoneNumber]
    )

    let userId: string

    if (existingUser.rowLength > 0) {
      // Existing user
      userId = existingUser.rows[0].id
    } else if (username) {
      // New user with username
      userId = uuidv4()
      await executeQuery(
        `INSERT INTO social_network.users (
          id, username, phone_number, created_at, last_active, is_verified
        ) VALUES (?, ?, ?, toTimestamp(now()), toTimestamp(now()), false)`,
        [userId, username, phoneNumber]
      )
    } else {
      // New user without username yet
      userId = uuidv4()
      // Store phone number in temporary table
      await executeQuery(
        `INSERT INTO social_network.pending_users (
          id, phone_number, created_at
        ) VALUES (?, ?, toTimestamp(now()))`,
        [userId, phoneNumber]
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    await executeQuery(
      `INSERT INTO social_network.otp_verification (
        user_id, otp, created_at, expires_at
      ) VALUES (?, ?, toTimestamp(now()), toTimestamp(now() + 300))`, // OTP expires in 5 minutes
      [userId, otp]
    )

    if (phoneNumber === "+911234567890") {
      // Demo user - show OTP in console for testing
      console.log("Demo user OTP:", otp)
      return NextResponse.json({
        success: true,
        message: "Demo mode: Use any 6-digit OTP",
        demo: true
      })
    }

    // For real users
    await mockSendOTP(phoneNumber, otp)
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

    // First check if user exists in users table
    const existingUser = await executeQuery(
      "SELECT id, username FROM social_network.users WHERE phone_number = ? ALLOW FILTERING",
      [phoneNumber]
    )

    // If not in users table, check pending_users
    const pendingUser = existingUser.rowLength === 0 ? await executeQuery(
      "SELECT id FROM social_network.pending_users WHERE phone_number = ? ALLOW FILTERING",
      [phoneNumber]
    ) : null

    if (existingUser.rowLength === 0 && (!pendingUser || pendingUser.rowLength === 0)) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userId = existingUser.rowLength > 0 ? existingUser.rows[0].id : pendingUser!.rows[0].id

    // Demo user auto-verification
    if (phoneNumber === "+911234567890") {
      if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json(
          { error: "Please enter 6 digits" },
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        success: true,
        requiresUsername: true,
        demo: true,
        message: "Demo mode: OTP verified"
      })
    }

    // Regular OTP verification logic
    try {
      const otpResult = await executeQuery(
        "SELECT * FROM social_network.otp_verification WHERE user_id = ? AND otp = ? ALLOW FILTERING",
        [userId, otp]
      )

      if (!otpResult.rowLength) {
        return NextResponse.json(
          { error: "Invalid OTP" },
          { status: 401 }
        )
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      return NextResponse.json(
        { error: "OTP verification failed" },
        { status: 500 }
      )
    }

    // Clear used OTP and return success
    await executeQuery(
      "DELETE FROM social_network.otp_verification WHERE user_id = ? AND otp = ?",
      [userId, otp]
    )

    // Update user status
    await executeQuery(
      "UPDATE social_network.users SET last_active = toTimestamp(now()), phone_verified = true WHERE id = ?",
      [userId]
    )

    // Prepare response based on user status
    if (existingUser.rowLength > 0) {
      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          username: existingUser.rows[0].username,
          phone_number: phoneNumber,
          is_verified: false,
          phone_verified: true
        }
      })
    }

    // New user needs username
    return NextResponse.json({
      success: true,
      requiresUsername: true,
      user: {
        id: userId,
        phone_number: phoneNumber,
        is_verified: false,
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
