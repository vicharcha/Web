export enum PostCategories {
  GENERAL = "general",
  NEWS = "news",
  ENTERTAINMENT = "entertainment",
  SPORTS = "sports",
  TECHNOLOGY = "technology",
  POLITICS = "politics",
  ADULT = "adult" // Only shown in settings
}

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

export type Post = {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  content: string;
  category: string;
  mediaUrls: string[];
  tokens: number;
  mentions: string[];
  hashtags: string[];
  emojis: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  timestamp?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isVerified?: boolean;
  isPremium?: boolean;
  ageRestricted?: boolean;
};

export interface ClientStory {
  id: number;
  username: string;
  userImage: string;
  storyImage: string;
  isViewed: boolean;
  isPremium: boolean;
  duration: number;
  type: 'image' | 'video';
}

export interface Story {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  type: 'image' | 'video';
  mediaUrl: string;
  duration?: number;
  username?: string;
  userImage?: string;
  isViewed?: boolean;
  isPremium?: boolean;
  items?: StoryItem[];
  category?: string;
  downloadable?: boolean;
  isAdult?: boolean;
}

export interface StoryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  duration?: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  username?: string;
  name?: string;
  email?: string;
  image?: string; // Add image property
  verificationStatus: "unverified" | "verified";
  isPremium: boolean;
  digiLockerVerified: boolean;
  joinedDate: string;
  lastActive: string;
  documents?: DigiLockerDocument[];
}

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

export interface UserSettings {
  isAdultContentEnabled: boolean;
  dateOfBirth?: string;
  theme?: string;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
