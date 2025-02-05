import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const postsCollection = db.collection('posts');

  switch (req.method) {
    case 'POST':
      // Create a new post
      try {
        const { title, content, author } = req.body;
        const newPost = { title, content, author, createdAt: new Date() };
        const result = await postsCollection.insertOne(newPost);
        res.status(201).json({ message: 'Post created successfully', postId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    case 'GET':
      // Get all posts
      try {
        const posts = await postsCollection.find({}).toArray();
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    case 'PUT':
      // Update a post
      try {
        const { id, title, content } = req.body;
        const result = await postsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, content, updatedAt: new Date() } }
        );
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: 'Post updated successfully' });
        } else {
          res.status(404).json({ message: 'Post not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    case 'DELETE':
      // Delete a post
      try {
        const { id } = req.body;
        const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Post deleted successfully' });
        } else {
          res.status(404).json({ message: 'Post not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
