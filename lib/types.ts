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
  categories: string[]
  timestamp: string
  isSponsored?: boolean
  isPremium?: boolean
  isVerified?: boolean
}

export type FeedPost = Post & FeedPostExtension

// Props type for the Post component
export type PostProps = FeedPost

// Chat and Message types
export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  mediaUrls?: string[]
  createdAt: Date
  status: 'sent' | 'delivered' | 'read'
}

export type ChatStatus = 'online' | 'offline' | 'away'

export type UserStatus = 'active' | 'busy' | 'away' | 'offline'

export interface ParticipantDetails {
  id: string
  name: string
  avatar: string
  isPremium: boolean
  lastSeen: string
  status: ChatStatus
  role?: 'user' | 'developer' | 'admin'
  department?: string
}

// Base chat interface with common properties
export interface BaseChat {
  id: string
  participants: string[]
  createdAt: Date
  updatedAt: Date
  lastMessage?: Message
  unreadCount: number
  isTyping: boolean
  name: string
  avatar: string
  status: ChatStatus
}

// Individual chat interface
export interface IndividualChat extends BaseChat {
  isGroup: false
  participantDetails: ParticipantDetails[] // Array with the other participant's details
}

// Group chat interface
export interface GroupChat extends BaseChat {
  isGroup: true
  description: string
  owner: ParticipantDetails
  admins: string[]
  participantDetails: ParticipantDetails[] // Array of all group participants
}

// Union type for chat with details
export type ChatWithDetails = IndividualChat | GroupChat

// Type guard to check if chat is a group chat
export function isGroupChat(chat: ChatWithDetails): chat is GroupChat {
  return chat.isGroup === true
}

// Type guard to check if chat is an individual chat
export function isIndividualChat(chat: ChatWithDetails): chat is IndividualChat {
  return chat.isGroup === false
}

// Chat list item type (simplified version for list display)
export interface ChatListItem {
  id: string
  name: string
  avatar: string
  lastMessage?: Message
  unreadCount: number
  isTyping: boolean
  status: ChatStatus
  isGroup: boolean
  participantDetails: ParticipantDetails[]
}
