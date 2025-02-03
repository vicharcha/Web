import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import jwt from "jsonwebtoken"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  await dbConnect()

  const { phoneNumber } = req.body

  try {
    let user = await User.findOne({ phoneNumber })

    if (!user) {
      user = new User({ phoneNumber, name: "" })
      await user.save()
    }

    // In a real-world scenario, you would send an OTP to the phone number here
    // For this example, we'll skip that step and generate a token directly

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" })

    res.status(200).json({ token, user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
