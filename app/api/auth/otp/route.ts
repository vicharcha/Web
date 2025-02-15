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
