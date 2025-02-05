import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db('mydatabase');
}

export { connectToDatabase };
