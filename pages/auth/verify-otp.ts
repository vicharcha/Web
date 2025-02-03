import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  await dbConnect()

  const { phoneNumber, otp } = req.body

  try {
    // In a real-world scenario, you would verify the OTP here
    // For this example, we'll assume the OTP is always correct

    const user = await User.findOne({ phoneNumber })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    res.status(200).json({ token, user })
  } catch (error) {
    console.error("OTP verification error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
