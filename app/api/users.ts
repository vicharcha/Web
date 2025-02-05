import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase();
  const usersCollection = db.collection('users');

  switch (req.method) {
    case 'POST':
      // User registration
      try {
        const { phoneNumber, name, email } = req.body;
        const newUser = { phoneNumber, name, email, createdAt: new Date() };
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    case 'GET':
      // Get user profile
      try {
        const { phoneNumber } = req.query;
        const user = await usersCollection.findOne({ phoneNumber });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    case 'PUT':
      // Update user profile
      try {
        const { phoneNumber, name, email } = req.body;
        const result = await usersCollection.updateOne(
          { phoneNumber },
          { $set: { name, email, updatedAt: new Date() } }
        );
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: 'User profile updated successfully' });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
