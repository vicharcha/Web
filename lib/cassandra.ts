import { Client, types } from 'cassandra-driver';

export const client = new Client({
  contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
  localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'social_network',
  credentials: {
    username: process.env.CASSANDRA_USER || 'cassandra',
    password: process.env.CASSANDRA_PASSWORD || 'cassandra'
  }
});

export const PostCategories = {
  GENERAL: 'general',
  NEWS: 'news',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
  ADULT: 'adult'
} as const;

export type PostCategory = typeof PostCategories[keyof typeof PostCategories];

export interface Post {
  id: types.Uuid;
  userId: string;
  content: string;
  category: PostCategory;
  ageRestricted: boolean;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Initialize database schema
export async function initializeCassandra() {
  const queries = [
    `CREATE KEYSPACE IF NOT EXISTS social_network 
     WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`,
    
    `CREATE TABLE IF NOT EXISTS social_network.posts (
      id uuid PRIMARY KEY,
      user_id text,
      content text,
      category text,
      age_restricted boolean,
      media_urls list<text>,
      created_at timestamp,
      updated_at timestamp
    )`,
    
    `CREATE INDEX IF NOT EXISTS posts_category_idx ON social_network.posts (category)`,
    `CREATE INDEX IF NOT EXISTS posts_age_restricted_idx ON social_network.posts (age_restricted)`
  ];

  try {
    for (const query of queries) {
      await client.execute(query);
    }
    console.log('Cassandra schema initialized successfully');
  } catch (error) {
    console.error('Error initializing Cassandra schema:', error);
    throw error;
  }
}

// Connect to Cassandra
export async function connectToCassandra() {
  try {
    await client.connect();
    console.log('Connected to Cassandra');
    await initializeCassandra();
  } catch (error) {
    console.error('Error connecting to Cassandra:', error);
    throw error;
  }
}
