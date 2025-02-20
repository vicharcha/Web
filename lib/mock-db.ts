import { types } from 'cassandra-driver';
import { DBUser, DatabaseResult, DigiLockerAuth, Story } from './types';

export interface MockOTPVerification {
  user_id: string;
  otp: string;
  created_at: Date;
  expires_at: Date;
}

export interface MockPost {
  id: string;
  userId: string;
  content: string;
  category: string;
  ageRestricted: boolean;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: number;
  shares: number;
  likedBy: Set<string>;
  bookmarkedBy: Set<string>;
}

export interface MockPendingUser {
  id: string;
  phone_number: string;
  created_at: Date;
}

// Mock in-memory storage
const storage = {
  users: new Map<string, DBUser>(),
  pending_users: new Map<string, MockPendingUser>(),
  otp_verification: new Map<string, MockOTPVerification>(),
  posts: new Map<string, MockPost>(),
  digilocker_auth: new Map<string, DigiLockerAuth>(),
  stories: new Map<string, Story>()
};

// Initialize demo users
// Create consistent user IDs for demo data
const demoUserIds = {
  user1: 'demo_user_1',
  user2: 'demo_user_2',
  testUser: 'test_user'
};

const demoUsers: DBUser[] = [
  {
    id: demoUserIds.user1,
    username: 'demo_user1',
    phone_number: '+911234567890',
    email: 'demo1@example.com',
    password_hash: 'demo123',
    is_verified: true,
    phone_verified: true,
    digilocker_verified: false,
    country_code: '+91',
    created_at: new Date(),
    last_active: new Date()
  },
  {
    id: demoUserIds.user2,
    username: 'demo_user2',
    phone_number: '+911234567891',
    email: 'demo2@example.com',
    password_hash: 'demo123',
    is_verified: true,
    phone_verified: true,
    digilocker_verified: false,
    country_code: '+91',
    created_at: new Date(),
    last_active: new Date()
  },
  {
    id: demoUserIds.testUser,
    username: 'test_user',
    phone_number: '+911234567892',
    email: 'test@example.com',
    password_hash: 'test123',
    is_verified: true,
    phone_verified: true,
    digilocker_verified: false,
    country_code: '+91',
    created_at: new Date(),
    last_active: new Date()
  }
];

const demoStories: Story[] = [
  {
    id: '1',
    userId: demoUserIds.user1,
    username: 'demo_user1',
    userImage: '/placeholder-user.jpg',
    type: 'video',
    mediaUrl: '/videos/DO IT yourself.mp4',
    duration: 15,
    isViewed: false,
    isPremium: false,
    category: 'general',
    downloadable: true,
    isAdult: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: demoUserIds.user2,
    username: 'demo_user2',
    userImage: '/placeholder-user.jpg',
    type: 'image',
    mediaUrl: '/placeholder.jpg',
    isViewed: false,
    isPremium: false,
    category: 'general',
    downloadable: true,
    isAdult: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

// Add test user story with demo video
const testUserStory: Story = {
  id: '3',
  userId: demoUserIds.testUser,
  username: 'test_user',
  userImage: '/placeholder-user.jpg',
  type: 'video',
  mediaUrl: '/videos/DO IT yourself.mp4',
  duration: 15,
  isViewed: false,
  isPremium: false,
  category: 'general',
  downloadable: true,
  isAdult: false,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
};

// Add demo users to storage
demoUsers.forEach(user => storage.users.set(user.id, user));

// Filter out duplicate stories by checking mediaUrl
const isDuplicateStory = (stories: Story[], story: Story) => 
  stories.some(existingStory => existingStory.mediaUrl === story.mediaUrl);

const uniqueStories = demoStories.filter((story, index) => 
  !isDuplicateStory(demoStories.slice(0, index), story)
);

if (!isDuplicateStory(uniqueStories, testUserStory)) {
  uniqueStories.push(testUserStory);
}

uniqueStories.forEach(story => storage.stories.set(story.id, story));

// Helper function to create a standardized database response
function createDbResult<T>(data: T[]): DatabaseResult {
  return {
    rowLength: data.length,
    rows: data
  };
}

// Helper function to create a single-row database response
function createSingleRowResult<T>(data: T | null): DatabaseResult {
  return {
    rowLength: data ? 1 : 0,
    rows: data ? [data] : []
  };
}

export const mockDB = {
  async query(query: string, params: any[]): Promise<DatabaseResult> {
    console.log('Mock DB Query:', { query, params });

    // Handle pending users queries
    if (query.toLowerCase().includes('pending_users')) {
      // Handle pending user insert
      if (query.toLowerCase().includes('insert')) {
        const [id, phone_number, created_at] = params;
        const pendingUser: MockPendingUser = {
          id,
          phone_number,
          created_at: new Date(created_at)
        };
        storage.pending_users.set(id, pendingUser);
        return createSingleRowResult(pendingUser);
      }

      // Handle pending user lookup by phone
      if (query.toLowerCase().includes('phone_number')) {
        const phoneNumber = params.find(p => typeof p === 'string' && p.startsWith('+'));
        const pendingUser = Array.from(storage.pending_users.values())
          .find(u => u.phone_number === phoneNumber);
        return createSingleRowResult(pendingUser);
      }

      // Handle pending user delete
      if (query.toLowerCase().includes('delete')) {
        const userId = params[0];
        const pendingUser = storage.pending_users.get(userId);
        storage.pending_users.delete(userId);
        return createSingleRowResult(pendingUser);
      }

      // Return all pending users for general select
      return createDbResult(Array.from(storage.pending_users.values()));
    }

    // Handle user queries
    if (query.toLowerCase().includes('users') && !query.toLowerCase().includes('pending_users')) {
      // Handle user lookup by phone
      if (query.toLowerCase().includes('phone_number')) {
        const phoneNumber = params.find(p => typeof p === 'string' && p.startsWith('+'));
        const user = Array.from(storage.users.values())
          .find(u => u.phone_number === phoneNumber);
        return createSingleRowResult(user);
      }

      // Handle user lookup by username
      if (query.toLowerCase().includes('username =')) {
        const username = params[0];
        const user = Array.from(storage.users.values())
          .find(u => u.username === username);
        return createSingleRowResult(user);
      }

      // Handle user insert
      if (query.toLowerCase().includes('insert')) {
        const [id, username, phone_number, email, is_verified, phone_verified, digilocker_verified, country_code, created_at, last_active] = params;
        
        const newUser: DBUser = {
          id,
          username,
          phone_number,
          email,
          is_verified,
          phone_verified,
          digilocker_verified,
          country_code: country_code || '+91',
          created_at: new Date(created_at),
          last_active: new Date(last_active)
        };
        
        storage.users.set(id, newUser);
        return createSingleRowResult(newUser);
      }

      // Handle user updates
      if (query.includes('UPDATE')) {
        const [isVerified, userId] = params;
        const user = storage.users.get(userId);
        if (user) {
          user.is_verified = isVerified;
          storage.users.set(userId, user);
          return createSingleRowResult(user);
        }
        return createDbResult([]);
      }

      // Return all users for general select
      return createDbResult(Array.from(storage.users.values()));
    }

    // Handle OTP verification
    if (query.toLowerCase().includes('otp_verification')) {
      if (query.toLowerCase().includes('insert')) {
        const [userId, otp, created_at, expires_at] = params;
        const verification: MockOTPVerification = {
          user_id: userId,
          otp,
          created_at: new Date(created_at),
          expires_at: new Date(expires_at)
        };
        storage.otp_verification.set(userId, verification);
        return createSingleRowResult(verification);
      }
      
      if (query.toLowerCase().includes('select')) {
        const userId = params[0];
        const verification = storage.otp_verification.get(userId);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Latest OTP for verification:', verification?.otp);
        }
        
        return createSingleRowResult(verification);
      }
    }

    // Handle DigiLocker queries
    if (query.toLowerCase().includes('digilocker_auth')) {
      if (query.toLowerCase().includes('insert')) {
        const [user_id, document_id, document_type, issuer, verification_status, verified_at] = params;
        const auth: DigiLockerAuth = {
          user_id,
          document_id,
          document_type,
          issuer,
          verification_status,
          verified_at: new Date(verified_at)
        };
        
        storage.digilocker_auth.set(`${user_id}:${document_id}`, auth);
        
        // Update user's digilocker status
        const user = storage.users.get(user_id);
        if (user) {
          user.digilocker_verified = true;
          storage.users.set(user_id, user);
        }
        
        return createSingleRowResult(auth);
      }

      if (query.toLowerCase().includes('select')) {
        const userId = params[0];
        const documents = Array.from(storage.digilocker_auth.values())
          .filter(doc => doc.user_id === userId);
        return createDbResult(documents);
      }
    }

    // Handle posts queries
    if (query.toLowerCase().includes('posts')) {
      if (query.toLowerCase().includes('category')) {
        const category = params[0];
        const posts = Array.from(storage.posts.values())
          .filter(post => post.category === category);
        return createDbResult(posts);
      }
      
      // Return all posts for general select
      return createDbResult(Array.from(storage.posts.values()));
    }

    // Handle stories queries
    if (query.toLowerCase().includes('stories')) {
      const currentTime = new Date();
      
      // Filter stories that haven't expired
      const activeStories = Array.from(storage.stories.values()).filter(story => 
        new Date(story.expiresAt) > currentTime
      );
      
      return createDbResult(activeStories);
    }

    // Default response for unhandled queries
    return createDbResult([]);
  }
};
