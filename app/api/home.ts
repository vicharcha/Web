import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db('mydatabase');
      const collection = database.collection('homeData');
      const homeData = await collection.find({}).toArray();
      res.status(200).json({ message: 'Welcome to the home page!', data: homeData });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
