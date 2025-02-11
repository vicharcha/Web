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
    // Keyspace creation
    `CREATE KEYSPACE IF NOT EXISTS social_network 
     WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`,
    
    // Posts table
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
    
    // Reels table
    `CREATE TABLE IF NOT EXISTS social_network.reels (
      id uuid PRIMARY KEY,
      user_id text,
      video_url text,
      thumbnail_url text,
      caption text,
      duration int,
      views counter,
      likes counter,
      shares counter,
      comments counter,
      music_info text,
      tags list<text>,
      created_at timestamp,
      is_premium boolean,
      age_restricted boolean
    )`,

    // Call History table
    `CREATE TABLE IF NOT EXISTS social_network.calls (
      id uuid,
      user_id text,
      participant_id text,
      start_time timestamp,
      end_time timestamp,
      duration int,
      call_type text,  // 'audio' or 'video'
      status text,     // 'completed', 'missed', 'declined'
      quality_metrics map<text, float>,
      PRIMARY KEY (user_id, start_time)
    ) WITH CLUSTERING ORDER BY (start_time DESC)`,

    // Social Connections table
    `CREATE TABLE IF NOT EXISTS social_network.connections (
      user_id text,
      connected_user_id text,
      connection_type text,  // 'following', 'blocked', 'close_friend'
      created_at timestamp,
      updated_at timestamp,
      PRIMARY KEY (user_id, connected_user_id)
    )`,

    // Social Activity table
    `CREATE TABLE IF NOT EXISTS social_network.activities (
      user_id text,
      activity_id uuid,
      activity_type text,  // 'post', 'reel', 'comment', 'like', 'share'
      target_id text,
      created_at timestamp,
      content text,
      media_urls list<text>,
      PRIMARY KEY (user_id, created_at, activity_id)
    ) WITH CLUSTERING ORDER BY (created_at DESC)`,

    // User Reactions table
    `CREATE TABLE IF NOT EXISTS social_network.reactions (
      content_id uuid,
      user_id text,
      reaction_type text,  // 'like', 'love', 'haha', 'wow', 'sad', 'angry'
      created_at timestamp,
      PRIMARY KEY ((content_id), user_id)
    )`,

    // Indexes
    `CREATE INDEX IF NOT EXISTS posts_category_idx ON social_network.posts (category)`,
    `CREATE INDEX IF NOT EXISTS posts_age_restricted_idx ON social_network.posts (age_restricted)`,
    `CREATE INDEX IF NOT EXISTS reels_user_id_idx ON social_network.reels (user_id)`,
    `CREATE INDEX IF NOT EXISTS activities_activity_type_idx ON social_network.activities (activity_type)`,
    `CREATE INDEX IF NOT EXISTS connections_type_idx ON social_network.connections (connection_type)`,
    `CREATE INDEX IF NOT EXISTS reactions_type_idx ON social_network.reactions (reaction_type)`
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

// Query helper functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await client.execute(query, params, { prepare: true });
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Batch query helper
export async function executeBatch(queries: { query: string; params: any[] }[]) {
  try {
    return await client.batch(
      queries.map(q => ({ query: q.query, params: q.params })),
      { prepare: true }
    );
  } catch (error) {
    console.error('Error executing batch:', error);
    throw error;
  }
}
