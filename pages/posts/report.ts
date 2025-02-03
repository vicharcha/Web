import type { NextApiResponse } from "next"
import { authMiddleware, type AuthenticatedRequest } from "@/middleware/authMiddleware"
import dbConnect from "@/lib/dbConnect"
import Post from "@/models/Post"
import Report from "@/models/Report"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "POST") {
    try {
      const { postId, reason } = req.body
      const post = await Post.findById(postId)
      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      const report = new Report({
        post: postId,
        reportedBy: req.user!.id,
        reason,
      })
      await report.save()

      res.status(201).json({ message: "Post reported successfully" })
    } catch (error) {
      res.status(500).json({ message: "Error reporting post" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler)
