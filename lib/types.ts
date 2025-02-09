// Shared types for client-side components
export const PostCategories = {
  GENERAL: 'general',
  NEWS: 'news',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
  ADULT: 'adult'
} as const

export type PostCategory = typeof PostCategories[keyof typeof PostCategories]

export interface Post {
  id: string
  userId: string
  content: string
  category: PostCategory
  ageRestricted: boolean
  mediaUrls: string[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  phoneNumber: string
  name: string
  email?: string
  verificationStatus: 'unverified' | 'pending' | 'verified'
  isPremium: boolean
  digiLockerVerified: boolean
  joinedDate: string
  lastActive: string
}

// Social features added to Post for the feed
export interface FeedPostExtension {
  username: string
  userImage: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  categories: string[] // Categories displayed in UI
  timestamp: string
  isSponsored?: boolean
  isPremium?: boolean
  isVerified?: boolean
}

export type FeedPost = Post & FeedPostExtension

// Props type for the Post component
export type PostProps = FeedPost
