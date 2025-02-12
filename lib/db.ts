import { mockDB } from './mock-db';
import { types } from 'cassandra-driver';

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

export interface User {
  id: string;
  username?: string;
  phone_number: string;
  email?: string;
  is_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  last_active: Date;
  name?: string;
  verificationStatus?: string;
  isPremium?: boolean;
  digiLockerVerified?: boolean;
  joinedDate?: string;
}

export interface OTPVerification {
  user_id: string;
  otp: string;
  created_at: Date;
  expires_at: Date;
}

// Type guard for query results
function isQueryResult(result: any): result is { rows: any[] } {
  return result && Array.isArray(result.rows);
}

// Always use mock DB in development, optionally in production
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockDB = isDevelopment || process.env.USE_MOCK_DB === 'true';

// Basic database operations
export async function executeQuery(query: string, params: any[]) {
  if (useMockDB) {
    return mockDB.query(query, params);
  }

  try {
    const { client, connectToCassandra, executeQuery: cassandraExecute } = await import('./cassandra');
    const result = await cassandraExecute(query, params);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    // Fallback to mock DB if Cassandra fails in development
    if (isDevelopment) {
      return mockDB.query(query, params);
    }
    throw error;
  }
}

// Helper functions for common operations
export async function findUserByPhone(phone: string): Promise<User | undefined> {
  const query = 'SELECT * FROM social_network.users WHERE phone_number = ?';
  const result = await executeQuery(query, [phone]);
  
  if (!isQueryResult(result) || result.rows.length === 0) {
    return undefined;
  }
  
  return result.rows[0] as User;
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const id = types.Uuid.random().toString();
  const now = new Date();
  
  const query = `
    INSERT INTO social_network.users 
    (id, username, phone_number, email, is_verified, phone_verified, created_at, last_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    id,
    userData.username || `user_${Math.random().toString(36).substr(2, 9)}`,
    userData.phone_number,
    userData.email || null,
    false,
    true,
    now,
    now
  ];
  
  await executeQuery(query, params);
  return { id, ...userData, created_at: now, last_active: now } as User;
}

export async function verifyOTP(userId: string, otp: string): Promise<boolean> {
  const query = 'SELECT * FROM social_network.otp_verification WHERE user_id = ?';
  const result = await executeQuery(query, [userId]);
  
  if (!isQueryResult(result) || result.rows.length === 0) {
    return false;
  }
  
  const stored = result.rows[0] as OTPVerification;
  
  if (stored.otp !== otp) {
    return false;
  }
  
  // Check if OTP is expired (5 minutes)
  if (new Date(stored.expires_at) < new Date()) {
    return false;
  }
  
  try {
    // Mark user as verified
    await executeQuery(
      'UPDATE social_network.users SET is_verified = ? WHERE id = ?',
      [true, userId]
    );
    return true;
  } catch (error) {
    console.error('Error updating user verification status:', error);
    return false;
  }
}

// Additional helper for OTP creation
export async function createOTP(userId: string, otp: string): Promise<boolean> {
  try {
    const now = new Date();
    const expires = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    
    await executeQuery(
      'INSERT INTO social_network.otp_verification (user_id, otp, created_at, expires_at) VALUES (?, ?, ?, ?)',
      [userId, otp, now, expires]
    );
    
    return true;
  } catch (error) {
    console.error('Error creating OTP:', error);
    return false;
  }
}

export async function getUser(phoneNumber: string): Promise<User | null> {
  const result = await executeQuery(
    'SELECT * FROM social_network.users WHERE phone_number = ?',
    [phoneNumber]
  );

  if (!isQueryResult(result) || result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as User;
}

// Post related functions
export async function getPosts(): Promise<Post[]> {
  const result = await executeQuery('SELECT * FROM social_network.posts', []);
  if (!isQueryResult(result)) {
    return [];
  }
  return result.rows as Post[];
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
