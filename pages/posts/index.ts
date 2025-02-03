import type { NextApiResponse } from "next"
import { type AuthenticatedRequest, authMiddleware } from "@/middleware/auth"
import dbConnect from "@/lib/dbConnect"
import Post from "@/models/Post"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const { category, user } = req.query
      let query = {}

      if (category) {
        query = { ...query, category }
      }

      if (user) {
        query = { ...query, user }
      }

      const posts = await Post.find(query).sort({ createdAt: -1 }).limit(20).populate("user", "name")

      res.status(200).json(posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "POST") {
    try {
      const { content, image } = req.body
      const post = new Post({ user: req.userId, content, image })
      await post.save()
      res.status(201).json(post)
    } catch (error) {
      console.error("Error creating post:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler)
