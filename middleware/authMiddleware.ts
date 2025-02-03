import type { NextApiRequest, NextApiResponse } from "next"
import type { NextApiHandler } from "next"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string
    phoneNumber: string
  }
}

export function authMiddleware(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "Authentication required" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; phoneNumber: string }
      req.user = decoded

      return handler(req, res)
    } catch (error) {
      console.error("Auth error:", error)
      return res.status(401).json({ message: "Invalid token" })
    }
  }
}

