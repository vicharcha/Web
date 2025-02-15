import { types } from 'cassandra-driver';
import { DBUser, DatabaseResult, DigiLockerAuth } from './types';

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

// Mock in-memory storage
const storage = {
  users: new Map<string, DBUser>(),
  otp_verification: new Map<string, MockOTPVerification>(),
  posts: new Map<string, MockPost>(),
  digilocker_auth: new Map<string, DigiLockerAuth>()
};

// Initialize demo users
const demoUsers: DBUser[] = [
  {
    id: types.Uuid.random().toString(),
    username: 'demo_user1',
    phone_number: '+911234567890',
    email: 'demo1@example.com',
    password_hash: 'demo123', // In a real app, this would be properly hashed
    is_verified: true,
    phone_verified: true,
    digilocker_verified: false,
    country_code: '+91',
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
    digilocker_verified: false,
    country_code: '+91',
    created_at: new Date(),
    last_active: new Date()
  }
];

// Add demo users to storage
demoUsers.forEach(user => storage.users.set(user.id, user));

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

    // Handle user queries
    if (query.toLowerCase().includes('users')) {
      // Handle user lookup by phone
      if (query.toLowerCase().includes('phone_number')) {
        const phoneNumber = params.find(p => typeof p === 'string' && p.startsWith('+'));
        const user = Array.from(storage.users.values())
          .find(u => u.phone_number === phoneNumber);
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

    // Log unhandled queries in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unhandled mock DB query:', query);
    }
    
    // Default response for unhandled queries
    return createDbResult([]);
  }
};
