import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string
}

export function authMiddleware(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]
      if (!token) {
        return res.status(401).json({ message: "Authentication required" })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      req.userId = (decoded as any).userId

      return handler(req, res)
    } catch (error) {
      console.error("Auth error:", error)
      return res.status(401).json({ message: "Invalid token" })
    }
  }
}

