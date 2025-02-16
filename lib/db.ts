import { mockDB } from './mock-db';
import { types } from 'cassandra-driver';
import { DBUser, DatabaseResult } from './types';

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';
const useMockDB = process.env.USE_MOCK_DB === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_DB === 'true';

// Log the environment for debugging
if (typeof window === 'undefined') {
  console.log('Database Mode:', {
    isDevelopment,
    useMockDB,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    CASSANDRA_KEYSPACE: process.env.CASSANDRA_KEYSPACE ? 'configured' : 'not configured'
  });
}

let cassandraModule: any = null;

// Basic database operations
export async function executeQuery(query: string, params: any[]): Promise<DatabaseResult> {
  // Always use mock DB in development when configured
  if (useMockDB) {
    console.log('Using mock database');
    return mockDB.query(query, params);
  }

  try {
    // Lazy load Cassandra module
    if (!cassandraModule) {
      cassandraModule = await import('./cassandra');
    }

    const { client, connectToCassandra, executeQuery: cassandraExecute } = cassandraModule;

    // Check connection status
    if (!client.isConnected) {
      try {
        console.log('Attempting to connect to Cassandra...');
        await connectToCassandra();
      } catch (connError) {
        console.error('Cassandra connection failed:', connError);
        if (isDevelopment) {
          console.warn('Falling back to mock database in development');
          return mockDB.query(query, params);
        }
        throw connError;
      }
    }

    try {
      const result = await cassandraExecute(query, params);
      return result;
    } catch (queryError: any) {
      // Handle specific Cassandra errors
      if (queryError.code === 'ECONNREFUSED' && isDevelopment) {
        console.warn('Connection refused, falling back to mock database');
        return mockDB.query(query, params);
      }

      if (queryError.message?.includes('table') && queryError.message?.includes('does not exist')) {
        console.warn('Table not found, attempting to reinitialize schema...');
        await connectToCassandra();
        return cassandraExecute(query, params);
      }

      throw queryError;
    }
  } catch (error) {
    console.error('Database error:', error);
    
    if (isDevelopment) {
      console.warn('Falling back to mock database in development');
      return mockDB.query(query, params);
    }
    
    throw error;
  }
}

// Helper functions for common operations
export async function findUserByPhone(phone: string): Promise<DBUser | undefined> {
  const query = 'SELECT * FROM social_network.users WHERE phone_number = ?';
  const result = await executeQuery(query, [phone]);
  return result.rows?.[0] as DBUser | undefined;
}

export async function createUser(userData: Partial<DBUser>): Promise<DBUser> {
  const id = types.Uuid.random().toString();
  const now = new Date();
  
  const query = `
    INSERT INTO social_network.users 
    (id, username, phone_number, email, is_verified, phone_verified, digilocker_verified, country_code, created_at, last_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    id,
    userData.username || `user_${Math.random().toString(36).substr(2, 9)}`,
    userData.phone_number,
    userData.email || null,
    false, // is_verified
    true,  // phone_verified
    false, // digilocker_verified
    userData.country_code || '+91',
    now,
    now
  ];
  
  await executeQuery(query, params);
  return { 
    id, 
    ...userData, 
    is_verified: false,
    phone_verified: true,
    digilocker_verified: false,
    created_at: now, 
    last_active: now 
  } as DBUser;
}

export async function verifyOTP(userId: string, otp: string): Promise<boolean> {
  const query = 'SELECT * FROM social_network.otp_verification WHERE user_id = ?';
  const result = await executeQuery(query, [userId]);
  
  if (!result.rows?.length) return false;
  
  const stored = result.rows[0];
  
  if (stored.otp !== otp) return false;
  if (new Date(stored.expires_at) < new Date()) return false;
  
  try {
    const updateResult = await executeQuery(
      'UPDATE social_network.users SET is_verified = ? WHERE id = ?',
      [true, userId]
    );
    
    return updateResult.rowLength > 0;
  } catch (error) {
    console.error('Error updating user verification status:', error);
    return false;
  }
}

export async function createOTP(userId: string, otp: string): Promise<boolean> {
  try {
    const now = new Date();
    const expires = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    
    const result = await executeQuery(
      'INSERT INTO social_network.otp_verification (user_id, otp, created_at, expires_at) VALUES (?, ?, ?, ?)',
      [userId, otp, now, expires]
    );
    
    return result.rowLength > 0;
  } catch (error) {
    console.error('Error creating OTP:', error);
    return false;
  }
}

export async function getUser(phoneNumber: string): Promise<DBUser | null> {
  const result = await executeQuery(
    'SELECT * FROM social_network.users WHERE phone_number = ?',
    [phoneNumber]
  );

  return result.rows?.[0] as DBUser || null;
}

// Post related functions
export async function getPosts(): Promise<Post[]> {
  const result = await executeQuery('SELECT * FROM social_network.posts', []);
  return result.rows || [];
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  const id = types.Uuid.random().toString();
  const now = new Date();
  
  const query = `
    INSERT INTO social_network.posts 
    (id, user_id, content, category, age_restricted, media_urls, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  await executeQuery(query, [
    id,
    post.userId,
    post.content,
    post.category,
    post.ageRestricted,
    post.mediaUrls || [],
    now,
    now
  ]);
  
  return {
    id,
    ...post,
    createdAt: now,
    updatedAt: now,
    mediaUrls: post.mediaUrls || []
  };
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  category: string;
  ageRestricted: boolean;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  items: StoryItem[];
  createdAt: Date;
  expiresAt: Date;
  category: string;
  downloadable: boolean;
  isAdult: boolean;
}

export interface StoryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  duration?: number;
}

export async function createStory(data: Omit<Story, 'id' | 'createdAt'>): Promise<Story> {
  const id = types.Uuid.random().toString();
  const now = new Date();
  
  const query = `
    INSERT INTO social_network.stories 
    (id, user_id, items, category, downloadable, is_adult, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  await executeQuery(query, [
    id,
    data.userId,
    JSON.stringify(data.items),
    data.category,
    data.downloadable,
    data.isAdult,
    now,
    data.expiresAt
  ]);
  
  return {
    id,
    userId: data.userId,
    items: data.items,
    category: data.category,
    downloadable: data.downloadable,
    isAdult: data.isAdult,
    createdAt: now,
    expiresAt: data.expiresAt
  };
}

export async function getStories(userId?: string): Promise<Story[]> {
  const now = new Date();
  let query = 'SELECT * FROM social_network.stories WHERE expires_at > ?';
  const params: any[] = [now];

  if (userId) {
    query += ' AND user_id = ? ALLOW FILTERING';
    params.push(userId);
  }

  const result = await executeQuery(query, params);
  return (result.rows || []).map(row => ({
    ...row,
    items: JSON.parse(row.items)
  }));
}

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  createdAt: Date;
}

export async function getReels(userId?: string): Promise<Reel[]> {
  let query = 'SELECT * FROM social_network.reels';
  const params: any[] = [];

  if (userId) {
    query += ' WHERE user_id = ?';
    params.push(userId);
  }

  const result = await executeQuery(query, params);
  return result.rows || [];
}

export async function createReel(
  userId: string,
  videoUrl: string,
  thumbnailUrl?: string,
  caption?: string
): Promise<string> {
  const id = types.Uuid.random().toString();
  const now = new Date();
  
  const query = `
    INSERT INTO social_network.reels 
    (id, user_id, video_url, thumbnail_url, caption, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  await executeQuery(query, [
    id,
    userId,
    videoUrl,
    thumbnailUrl || null,
    caption || null,
    now
  ]);
  
  return id;
}
