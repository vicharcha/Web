import { types } from 'cassandra-driver';

interface MockUser {
  id: string;
  username: string;
  phone_number: string;
  email?: string;
  password_hash?: string;
  is_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  last_active: Date;
}

interface MockOTPVerification {
  user_id: string;
  otp: string;
  created_at: Date;
  expires_at: Date;
}

interface MockPost {
  id: string;
  userId: string;
  content: string;
  category: string;
  ageRestricted: boolean;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock in-memory storage
const storage = {
  users: new Map<string, MockUser>(),
  pending_users: new Map<string, any>(),
  otp_verification: new Map<string, MockOTPVerification>(),
  posts: new Map<string, MockPost>()
};

// Initialize demo users
const demoUsers: MockUser[] = [
  {
    id: types.Uuid.random().toString(),
    username: 'demo_user1',
    phone_number: '+911234567890',
    email: 'demo1@example.com',
    password_hash: 'demo123', // In a real app, this would be properly hashed
    is_verified: true,
    phone_verified: true,
    created_at: new Date(),
    last_active: new Date()
  },
  {
    id: types.Uuid.random().toString(),
    username: 'demo_user2',
    phone_number: '+911234567891',
    email: 'demo2@example.com',
    password_hash: 'demo123',
    is_verified: true,
    phone_verified: true,
    created_at: new Date(),
    last_active: new Date()
  }
];

// Add demo users to storage
demoUsers.forEach(user => storage.users.set(user.id, user));

// Create demo posts
const demoPosts: MockPost[] = [
  {
    id: types.Uuid.random().toString(),
    userId: demoUsers[0].id,
    content: "Hello world! This is a demo post.",
    category: "general",
    ageRestricted: false,
    mediaUrls: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: types.Uuid.random().toString(),
    userId: demoUsers[1].id,
    content: "Another demo post with some media!",
    category: "entertainment",
    ageRestricted: false,
    mediaUrls: ["https://example.com/image.jpg"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Add demo posts to storage
demoPosts.forEach(post => storage.posts.set(post.id, post));

export const mockDB = {
  async query(query: string, params: any[]) {
    console.log('Mock DB Query:', { query, params });

    // Handle user queries
    if (query.toLowerCase().includes('users')) {
      // Handle user lookup by phone
      if (query.toLowerCase().includes('phone_number')) {
        const phoneNumber = params.find(p => typeof p === 'string' && p.startsWith('+'));
        const user = Array.from(storage.users.values())
          .find(u => u.phone_number === phoneNumber);
        
        return {
          rowLength: user ? 1 : 0,
          rows: user ? [user] : []
        };
      }

      // Handle user insert
      if (query.toLowerCase().includes('insert')) {
        const userId = params[0];
        const newUser: MockUser = {
          id: userId,
          username: params[1] || `user_${Math.random().toString(36).substr(2, 9)}`,
          phone_number: params.find(p => typeof p === 'string' && p.startsWith('+')) || '',
          is_verified: false,
          phone_verified: true,
          created_at: new Date(),
          last_active: new Date()
        };
        storage.users.set(userId, newUser);
        return { rowLength: 1 };
      }

      // Return all users for general select
      if (query.toLowerCase().includes('select')) {
        const users = Array.from(storage.users.values());
        return {
          rowLength: users.length,
          rows: users
        };
      }
    }

    // Handle OTP verification
    if (query.toLowerCase().includes('otp_verification')) {
      // Handle OTP insert
      if (query.toLowerCase().includes('insert')) {
        const [userId, otp, created_at, expires_at] = params;
        storage.otp_verification.set(userId, {
          user_id: userId,
          otp,
          created_at: new Date(created_at),
          expires_at: new Date(expires_at)
        });
        return { rowLength: 1 };
      }
      
      // Handle OTP select/verification
      if (query.toLowerCase().includes('select')) {
        const userId = params[0];
        const verification = storage.otp_verification.get(userId);
        
        // In development mode, always return the latest OTP for the user
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Latest OTP for verification:', verification?.otp);
        }
        
        return {
          rowLength: verification ? 1 : 0,
          rows: verification ? [verification] : []
        };
      }

      // Handle OTP update
      if (query.toLowerCase().includes('update')) {
        const userId = params[1];
        const user = Array.from(storage.users.values())
          .find(u => u.id === userId);
        
        if (user) {
          user.is_verified = true;
          storage.users.set(user.id, user);
          return { rowLength: 1 };
        }
      }
    }

    // Handle post queries
    if (query.toLowerCase().includes('posts')) {
      // Handle post select
      if (query.toLowerCase().includes('select')) {
        const posts = Array.from(storage.posts.values());
        return {
          rowLength: posts.length,
          rows: posts
        };
      }

      // Handle post insert
      if (query.toLowerCase().includes('insert')) {
        const [id, userId, content, category, ageRestricted, mediaUrls, createdAt, updatedAt] = params;
        const newPost = {
          id,
          userId,
          content,
          category,
          ageRestricted,
          mediaUrls: mediaUrls || [],
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt)
        };
        storage.posts.set(id, newPost);
        return { rowLength: 1 };
      }
    }

    // For development mode, log the query that wasn't handled
    if (process.env.NODE_ENV === 'development') {
      console.log('Unhandled mock DB query:', query);
    }
    
    // Default response for unhandled queries
    return {
      rowLength: 0,
      rows: []
    };
  }
};
