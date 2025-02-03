import type { NextApiResponse } from "next"
import { type AuthenticatedRequest, authMiddleware } from "@/middleware/auth"
import dbConnect from "@/lib/dbConnect"
import Post from "@/models/Post"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "POST") {
    try {
      const { postId } = req.body
      const originalPost = await Post.findById(postId)

      if (!originalPost) {
        return res.status(404).json({ message: "Post not found" })
      }

      const sharedPost = new Post({
        user: req.userId,
        content: `Shared: ${originalPost.content}`,
        image: originalPost.image,
        originalPost: postId,
      })

      await sharedPost.save()
      res.status(201).json(sharedPost)
    } catch (error) {
      console.error("Error sharing post:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler)
