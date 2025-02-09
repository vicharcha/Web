import { Client, types } from 'cassandra-driver';
import type { Post, PostCategory, User } from '../types';

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
    // Keyspace
    `CREATE KEYSPACE IF NOT EXISTS social_network 
     WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`,
    
    // Users table
    `CREATE TABLE IF NOT EXISTS social_network.users (
      phone_number text PRIMARY KEY,
      name text,
      email text,
      verification_status text,
      is_premium boolean,
      digi_locker_verified boolean,
      joined_date timestamp,
      last_active timestamp,
      settings map<text, text>
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
    
    // Messages table
    `CREATE TABLE IF NOT EXISTS social_network.messages (
      chat_id text,
      message_id timeuuid,
      sender_id text,
      receiver_id text,
      content text,
      media_urls list<text>,
      created_at timestamp,
      PRIMARY KEY (chat_id, message_id)
    ) WITH CLUSTERING ORDER BY (message_id DESC)`,
    
    // Calls table
    `CREATE TABLE IF NOT EXISTS social_network.calls (
      call_id uuid PRIMARY KEY,
      caller_id text,
      receiver_id text,
      status text,
      start_time timestamp,
      end_time timestamp,
      duration int,
      type text
    )`,
    
    // Reels table
    `CREATE TABLE IF NOT EXISTS social_network.reels (
      reel_id uuid PRIMARY KEY,
      user_id text,
      video_url text,
      thumbnail_url text,
      caption text,
      created_at timestamp,
      likes counter,
      views counter
    )`,
    
    // Social interactions table
    `CREATE TABLE IF NOT EXISTS social_network.social_interactions (
      content_id uuid,
      user_id text,
      interaction_type text,
      created_at timestamp,
      PRIMARY KEY ((content_id, user_id), interaction_type)
    )`,
    
    // User connections table
    `CREATE TABLE IF NOT EXISTS social_network.user_connections (
      user_id text,
      connected_user_id text,
      connection_type text,
      created_at timestamp,
      PRIMARY KEY ((user_id), connected_user_id)
    )`,

    // Create necessary indexes
    `CREATE INDEX IF NOT EXISTS posts_category_idx ON social_network.posts (category)`,
    `CREATE INDEX IF NOT EXISTS posts_age_restricted_idx ON social_network.posts (age_restricted)`,
    `CREATE INDEX IF NOT EXISTS reels_user_idx ON social_network.reels (user_id)`,
    `CREATE INDEX IF NOT EXISTS calls_caller_idx ON social_network.calls (caller_id)`,
    `CREATE INDEX IF NOT EXISTS calls_receiver_idx ON social_network.calls (receiver_id)`
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

// Posts
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

// Users & Auth
export async function createUser(user: Omit<User, 'email'> & { email?: string }) {
  await initializeDb();
  
  const query = `
    INSERT INTO social_network.users 
    (phone_number, name, email, verification_status, is_premium, digi_locker_verified, joined_date, last_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await client.execute(query, [
    user.phoneNumber,
    user.name,
    user.email ?? null,
    user.verificationStatus,
    user.isPremium,
    user.digiLockerVerified,
    new Date(user.joinedDate),
    new Date(user.lastActive)
  ], { prepare: true });

  return user;
}

export async function getUser(phoneNumber: string): Promise<User | null> {
  await initializeDb();

  const query = 'SELECT * FROM social_network.users WHERE phone_number = ?';
  const result = await client.execute(query, [phoneNumber], { prepare: true });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    phoneNumber: row.phone_number,
    name: row.name,
    ...(row.email && { email: row.email }),
    verificationStatus: row.verification_status,
    isPremium: row.is_premium,
    digiLockerVerified: row.digi_locker_verified,
    joinedDate: row.joined_date.toISOString(),
    lastActive: row.last_active.toISOString()
  };
}

// Messages
export async function sendMessage(chatId: string, senderId: string, receiverId: string, content: string, mediaUrls: string[] = []) {
  await initializeDb();

  const messageId = types.TimeUuid.now();
  const query = `
    INSERT INTO social_network.messages 
    (chat_id, message_id, sender_id, receiver_id, content, media_urls, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await client.execute(query, [
    chatId,
    messageId,
    senderId,
    receiverId,
    content,
    mediaUrls,
    new Date()
  ], { prepare: true });

  return messageId.toString();
}

export async function getMessages(chatId: string, limit = 50) {
  await initializeDb();

  const query = 'SELECT * FROM social_network.messages WHERE chat_id = ? LIMIT ?';
  const result = await client.execute(query, [chatId, limit], { prepare: true });

  return result.rows.map(row => ({
    messageId: row.message_id.toString(),
    chatId: row.chat_id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    mediaUrls: row.media_urls,
    createdAt: row.created_at
  }));
}

// Reels
export async function createReel(userId: string, videoUrl: string, thumbnailUrl: string, caption: string) {
  await initializeDb();

  const reelId = types.Uuid.random();
  const query = `
    INSERT INTO social_network.reels 
    (reel_id, user_id, video_url, thumbnail_url, caption, created_at, likes, views)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0)
  `;

  await client.execute(query, [
    reelId,
    userId,
    videoUrl,
    thumbnailUrl,
    caption,
    new Date()
  ], { prepare: true });

  return reelId.toString();
}

export async function getReels(userId?: string) {
  await initializeDb();

  let query = 'SELECT * FROM social_network.reels';
  const params: any[] = [];

  if (userId) {
    query += ' WHERE user_id = ?';
    params.push(userId);
  }

  query += ' ALLOW FILTERING';

  const result = await client.execute(query, params, { prepare: true });

  return result.rows.map(row => ({
    reelId: row.reel_id.toString(),
    userId: row.user_id,
    videoUrl: row.video_url,
    thumbnailUrl: row.thumbnail_url,
    caption: row.caption,
    createdAt: row.created_at,
    likes: row.likes ? Number(row.likes.toString()) : 0,
    views: row.views ? Number(row.views.toString()) : 0
  }));
}

// Calls
export async function createCall(callerId: string, receiverId: string, type: string) {
  await initializeDb();

  const callId = types.Uuid.random();
  const query = `
    INSERT INTO social_network.calls 
    (call_id, caller_id, receiver_id, status, start_time, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  await client.execute(query, [
    callId,
    callerId,
    receiverId,
    'initiated',
    new Date(),
    type
  ], { prepare: true });

  return callId.toString();
}

export async function updateCallStatus(callId: string, status: string, endTime?: Date) {
  await initializeDb();

  const query = `
    UPDATE social_network.calls 
    SET status = ?, end_time = ?, duration = ?
    WHERE call_id = ?
  `;

  const startTime = (await client.execute(
    'SELECT start_time FROM social_network.calls WHERE call_id = ?',
    [types.Uuid.fromString(callId)]
  )).rows[0]?.start_time;

  const duration = endTime && startTime ? 
    Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 
    null;

  await client.execute(query, [
    status,
    endTime || null,
    duration,
    types.Uuid.fromString(callId)
  ], { prepare: true });
}

export async function getCalls(userId: string) {
  await initializeDb();

  const query = `
    SELECT * FROM social_network.calls 
    WHERE caller_id = ? OR receiver_id = ? 
    ALLOW FILTERING
  `;

  const result = await client.execute(query, [userId, userId], { prepare: true });

  return result.rows.map(row => ({
    callId: row.call_id.toString(),
    callerId: row.caller_id,
    receiverId: row.receiver_id,
    status: row.status,
    startTime: row.start_time,
    endTime: row.end_time,
    duration: row.duration,
    type: row.type
  }));
}

// Social Interactions
export async function createInteraction(contentId: string, userId: string, type: string) {
  await initializeDb();

  const query = `
    INSERT INTO social_network.social_interactions 
    (content_id, user_id, interaction_type, created_at)
    VALUES (?, ?, ?, ?)
  `;

  await client.execute(query, [
    types.Uuid.fromString(contentId),
    userId,
    type,
    new Date()
  ], { prepare: true });
}

export async function getInteractions(contentId: string) {
  await initializeDb();

  const query = `
    SELECT * FROM social_network.social_interactions 
    WHERE content_id = ?
  `;

  const result = await client.execute(query, [types.Uuid.fromString(contentId)], { prepare: true });

  return result.rows.map(row => ({
    contentId: row.content_id.toString(),
    userId: row.user_id,
    type: row.interaction_type,
    createdAt: row.created_at
  }));
}

export async function updateUserSettings(userId: string, settings: Record<string, string>) {
  await initializeDb();

  const query = `
    UPDATE social_network.users
    SET settings = ?
    WHERE phone_number = ?
  `;

  await client.execute(query, [settings, userId], { prepare: true });
}

export async function getUserSettings(userId: string) {
  await initializeDb();

  const query = 'SELECT settings FROM social_network.users WHERE phone_number = ?';
  const result = await client.execute(query, [userId], { prepare: true });

  return result.rows[0]?.settings || {};
}
