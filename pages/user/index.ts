import type { NextApiResponse } from "next"
import { authMiddleware, type AuthenticatedRequest } from "@/middleware/authMiddleware"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const user = await User.findById(req.user!.id).select("-password")
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler)
