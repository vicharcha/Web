import { Client, types } from 'cassandra-driver';
import type { Post, PostCategory } from './index';

const client = new Client({
  contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
  localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
  keyspace: process.env.CASSANDRA_KEYSPACE || 'social_network',
  credentials: {
    username: process.env.CASSANDRA_USER || 'cassandra',
    password: process.env.CASSANDRA_PASSWORD || 'cassandra'
  }
});

let isInitialized = false;

async function initializeDb() {
  if (isInitialized) return;

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
    await client.connect();
    for (const query of queries) {
      await client.execute(query);
    }
    isInitialized = true;
    console.log('Cassandra schema initialized successfully');
  } catch (error) {
    console.error('Error initializing Cassandra schema:', error);
    throw error;
  }
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
  await initializeDb();

  const id = types.Uuid.random();
  const now = new Date();

  const query = `
    INSERT INTO social_network.posts 
    (id, user_id, content, category, age_restricted, media_urls, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await client.execute(query, [
    id,
    post.userId,
    post.content,
    post.category,
    post.ageRestricted,
    post.mediaUrls,
    now,
    now
  ], { prepare: true });

  return {
    ...post,
    id: id.toString(),
    createdAt: now,
    updatedAt: now
  };
}

export async function getPosts(options: {
  category?: PostCategory;
  ageRestricted?: boolean;
}) {
  await initializeDb();

  let query = 'SELECT * FROM social_network.posts';
  const params: any[] = [];
  const conditions: string[] = [];

  if (options.category) {
    conditions.push('category = ?');
    params.push(options.category);
  }

  if (typeof options.ageRestricted === 'boolean') {
    conditions.push('age_restricted = ?');
    params.push(options.ageRestricted);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC ALLOW FILTERING';

  const result = await client.execute(query, params, { prepare: true });

  return result.rows.map(row => ({
    id: row.id.toString(),
    userId: row.user_id,
    content: row.content,
    category: row.category as PostCategory,
    ageRestricted: row.age_restricted,
    mediaUrls: row.media_urls,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function deletePost(id: string, userId: string) {
  await initializeDb();

  const verifyQuery = 'SELECT user_id FROM social_network.posts WHERE id = ?';
  const verifyResult = await client.execute(verifyQuery, [types.Uuid.fromString(id)], { prepare: true });

  if (verifyResult.rows.length === 0) {
    throw new Error('Post not found');
  }

  if (verifyResult.rows[0].user_id !== userId) {
    throw new Error('Unauthorized');
  }

  const query = 'DELETE FROM social_network.posts WHERE id = ?';
  await client.execute(query, [types.Uuid.fromString(id)], { prepare: true });
}
