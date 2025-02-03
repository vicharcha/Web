import mongoose from 'mongoose';
import type { NextApiResponse } from "next"
import { type AuthenticatedRequest, authMiddleware } from "@/middleware/auth"
import dbConnect from "@/lib/dbConnect"
import Post from "@/models/Post"

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  const { postId } = req.query

  if (req.method === "POST") {
    try {
      const postId = req.query.postId as string;
const post = await Post.findById(new mongoose.Types.ObjectId(postId));

      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      const likeIndex = post.likes.indexOf(new mongoose.Types.ObjectId(req.userId));
      if (likeIndex === -1) {
        post.likes.push(new mongoose.Types.ObjectId(req.userId));
      } else {
        post.likes.splice(likeIndex, 1);
      }

      await post.save()

      res.status(200).json(post)
    } catch (error) {
      console.error("Error toggling like:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler)
