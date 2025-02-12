import { Client, types } from 'cassandra-driver';

// Initialize client without keyspace
export const client = new Client({
  contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
  localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
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

// Create keyspace and initialize schema
export async function initializeCassandra() {
  try {
    // Create keyspace first (without using it)
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS social_network 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
    `);

    // Create a new client with the keyspace
    const keyspaceClient = new Client({
      contactPoints: [process.env.CASSANDRA_HOST || 'localhost'],
      localDataCenter: process.env.CASSANDRA_DC || 'datacenter1',
      credentials: {
        username: process.env.CASSANDRA_USER || 'cassandra',
        password: process.env.CASSANDRA_PASSWORD || 'cassandra'
      },
      keyspace: 'social_network'
    });

    // Connect to the keyspace
    await keyspaceClient.connect();
    console.log('Connected to social_network keyspace');
  const queries = [
    // Drop existing tables
    `DROP TABLE IF EXISTS social_network.posts`,
    `DROP TABLE IF EXISTS social_network.reels`,
    `DROP TABLE IF EXISTS social_network.reel_metrics`,
    `DROP TABLE IF EXISTS social_network.calls`,
    `DROP TABLE IF EXISTS social_network.connections`,
    `DROP TABLE IF EXISTS social_network.activities`,
    `DROP TABLE IF EXISTS social_network.reactions`,
    `DROP TABLE IF EXISTS social_network.users`,
    `DROP TABLE IF EXISTS social_network.pending_users`,
    `DROP TABLE IF EXISTS social_network.messages`,
    `DROP TABLE IF EXISTS social_network.group_chats`,
    `DROP TABLE IF EXISTS social_network.media_attachments`,
    `DROP TABLE IF EXISTS social_network.digilocker_auth`,

    // Keyspace creation
    `CREATE KEYSPACE IF NOT EXISTS social_network 
     WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`,

    // Users table
    `CREATE TABLE IF NOT EXISTS social_network.users (
      id uuid PRIMARY KEY,
      username text,
      email text,
      password_hash text,
      full_name text,
      bio text,
      avatar_url text,
      digilocker_id text,
      phone_number text,
      created_at timestamp,
      last_active timestamp,
      settings map<text, text>,
      is_verified boolean
    )`,

    // Messages table
    `CREATE TABLE IF NOT EXISTS social_network.messages (
      chat_id uuid,
      message_id uuid,
      sender_id uuid,
      recipient_id uuid,
      content text,
      message_type text,
      media_urls list<text>,
      sticker_id text,
      document_info map<text, text>,
      sent_at timestamp,
      delivered_at timestamp,
      read_at timestamp,
      is_edited boolean,
      reactions map<uuid, text>,
      PRIMARY KEY ((chat_id), sent_at, message_id)
    ) WITH CLUSTERING ORDER BY (sent_at DESC)`,

    // Group Chats table
    `CREATE TABLE IF NOT EXISTS social_network.group_chats (
      chat_id uuid PRIMARY KEY,
      name text,
      description text,
      creator_id uuid,
      created_at timestamp,
      avatar_url text,
      settings map<text, text>,
      members list<uuid>,
      admins list<uuid>
    )`,

    // Media Attachments table
    `CREATE TABLE IF NOT EXISTS social_network.media_attachments (
      id uuid PRIMARY KEY,
      user_id uuid,
      media_type text,
      url text,
      thumbnail_url text,
      mime_type text,
      file_size bigint,
      dimensions map<text, int>,
      duration int,
      metadata map<text, text>,
      created_at timestamp
    )`,

    // DigiLocker Integration table
    `CREATE TABLE IF NOT EXISTS social_network.digilocker_auth (
      user_id uuid PRIMARY KEY,
      digilocker_id text,
      access_token text,
      refresh_token text,
      token_expiry timestamp,
      authorized_documents list<text>,
      last_sync timestamp
    )`,
    
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
    
    // Pending Users table for OTP verification
    `CREATE TABLE IF NOT EXISTS social_network.pending_users (
      id uuid PRIMARY KEY,
      phone_number text,
      otp text,
      otp_expiry timestamp,
      verification_attempts int,
      created_at timestamp
    )`,

    // Reels table - without counter columns
    `CREATE TABLE IF NOT EXISTS social_network.reels (
      id uuid PRIMARY KEY,
      user_id text,
      video_url text,
      thumbnail_url text,
      caption text,
      duration int,
      music_info text,
      tags list<text>,
      created_at timestamp,
      is_premium boolean,
      age_restricted boolean
    )`,

    // Reel metrics table - for counter columns
    `CREATE TABLE IF NOT EXISTS social_network.reel_metrics (
      reel_id uuid PRIMARY KEY,
      views counter,
      likes counter,
      shares counter,
      comments counter
    )`,

    // Call History table
    `CREATE TABLE IF NOT EXISTS social_network.calls (
      id uuid,
      user_id text,
      participant_id text,
      start_time timestamp,
      end_time timestamp,
      duration int,
      call_type text,
      status text,
      quality_metrics map<text, float>,
      PRIMARY KEY (user_id, start_time)
    ) WITH CLUSTERING ORDER BY (start_time DESC)`,

    // Social Connections table
    `CREATE TABLE IF NOT EXISTS social_network.connections (
      user_id text,
      connected_user_id text,
      connection_type text,
      created_at timestamp,
      updated_at timestamp,
      PRIMARY KEY (user_id, connected_user_id)
    )`,

    // OTP Verification table
    `CREATE TABLE IF NOT EXISTS social_network.otp_verification (
      user_id uuid PRIMARY KEY,
      otp text,
      created_at timestamp,
      expires_at timestamp
    )`,

    // Social Activity table
    `CREATE TABLE IF NOT EXISTS social_network.activities (
      user_id text,
      activity_id uuid,
      activity_type text,
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
      reaction_type text,
      created_at timestamp,
      PRIMARY KEY ((content_id), user_id)
    )`,

    // Create indexes for efficient querying
    `CREATE INDEX IF NOT EXISTS users_username_idx ON social_network.users (username)`,
    `CREATE INDEX IF NOT EXISTS users_email_idx ON social_network.users (email)`,
    `CREATE INDEX IF NOT EXISTS users_phone_idx ON social_network.users (phone_number)`,
    `CREATE INDEX IF NOT EXISTS pending_users_phone_idx ON social_network.pending_users (phone_number)`,
    `CREATE INDEX IF NOT EXISTS users_digilocker_idx ON social_network.users (digilocker_id)`,
    `CREATE INDEX IF NOT EXISTS messages_sender_idx ON social_network.messages (sender_id)`,
    `CREATE INDEX IF NOT EXISTS messages_recipient_idx ON social_network.messages (recipient_id)`,
    `CREATE INDEX IF NOT EXISTS media_user_idx ON social_network.media_attachments (user_id)`,
    `CREATE INDEX IF NOT EXISTS posts_category_idx ON social_network.posts (category)`,
    `CREATE INDEX IF NOT EXISTS posts_age_restricted_idx ON social_network.posts (age_restricted)`,
    `CREATE INDEX IF NOT EXISTS reels_user_id_idx ON social_network.reels (user_id)`,
    `CREATE INDEX IF NOT EXISTS activities_activity_type_idx ON social_network.activities (activity_type)`,
    `CREATE INDEX IF NOT EXISTS connections_type_idx ON social_network.connections (connection_type)`,
    `CREATE INDEX IF NOT EXISTS reactions_type_idx ON social_network.reactions (reaction_type)`
  ];

    // Execute each query in sequence
    for (const query of queries) {
      try {
        await keyspaceClient.execute(query);
      } catch (error) {
        console.error('Error executing query:', query);
        console.error('Error details:', error);
        throw error;
      }
    }

    // Update the main client to use the keyspace
    await client.execute('USE social_network');
    
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
    if (error instanceof Error) {
      console.error('Failed to connect to Cassandra:', error.message);
      if ('code' in error) {
        console.error('Error code:', (error as any).code);
      }
    }
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
