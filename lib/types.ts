export const PostCategories = {
  GENERAL: "general",
  NEWS: "news",
  ENTERTAINMENT: "entertainment",
  SPORTS: "sports",
  TECHNOLOGY: "technology",
  ADULT: "adult",
} as const;

export interface DBUser {
  id: string;
  username: string;
  phone_number: string;
  email?: string;
  password_hash?: string;
  is_verified: boolean;
  phone_verified: boolean;
  digilocker_verified: boolean;
  country_code: string;
  created_at: Date;
  last_active: Date;
  settings?: Record<string, string>;
}

export interface DigiLockerAuth {
  user_id: string;
  document_id: string;
  document_type: string;
  issuer: string;
  verification_status: 'verified' | 'pending' | 'failed';
  verified_at: Date;
}

export type FeedPost = {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  content: string;
  category: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isVerified: boolean;
  isPremium: boolean;
  categories: string[];
};

export type Post = {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  content: string;
  category: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  timestamp?: string;
};

export interface Story {
  id: string
  username: string
  userImage: string
  media: string
  type: "image" | "video"
  timestamp: Date
  views: number
  isLive?: boolean
}

export type StoryItem = {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number;
};

export type User = {
  id: string;
  phoneNumber: string;
  username?: string;
  name?: string;
  email?: string;
  verificationStatus: "unverified" | "verified";
  isPremium: boolean;
  digiLockerVerified: boolean;
  joinedDate: string;
  lastActive: string;
  documents?: DigiLockerDocument[];
};

export interface DigiLockerDocument {
  id: string;
  type: string;
  issuer: string;
  name: string;
  date: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
}

export type ParticipantDetail = {
  id: string;
  name: string;
  role?: string;
  department?: string;
};

export type UserStatus = 'online' | 'offline' | 'away';

export type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
};

export type ChatWithDetails = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  participantDetails: ParticipantDetail[];
  isGroup?: boolean;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export interface DatabaseResult {
  rowLength: number;
  rows: any[];
}

export function isGroupChat(chat: ChatWithDetails): boolean {
  return Boolean(chat.isGroup);
}
