import type { NextApiResponse } from "next"
import { type AuthenticatedRequest, authMiddleware } from "@/middleware/auth"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const user = await User.findById(req.userId).select("-__v")
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json(user)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "PUT") {
    try {
      const { name } = req.body
      const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true }).select("-__v")
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json(user)
    } catch (error) {
      console.error("Error updating user profile:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler)
