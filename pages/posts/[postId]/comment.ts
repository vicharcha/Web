import type { NextApiResponse } from "next"
import { type AuthenticatedRequest, authMiddleware } from "../../../middleware/auth"
import dbConnect from "../../../lib/dbConnect"
import mongoose, { Schema, Document } from 'mongoose';

export interface Post extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  comments: Array<{ user: string; content: string }>;
}

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [{
    user: { type: String, required: true },
    content: { type: String, required: true }
  }]
});

const PostModel = mongoose.models.Post || mongoose.model<Post>('Post', PostSchema);

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await dbConnect()

  const { postId } = req.query

  if (req.method === "POST") {
    try {
      const { content } = req.body
      const post = await PostModel.findById(postId)

      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      post.comments.push({ user: req.userId, content })
      await post.save()

      res.status(201).json(post)
    } catch (error) {
      console.error("Error adding comment:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default authMiddleware(handler);
