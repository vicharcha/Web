// Export database functions from the in-memory store for development
export * from './db/index';

// When ready to switch to Cassandra, change to:
// export * from './db/client';

// Database agnostic types
export type ConnectionType = 'following' | 'blocked' | 'close_friend';
export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
export type CallStatus = 'initiated' | 'ringing' | 'connected' | 'completed' | 'missed' | 'declined';
export type CallType = 'audio' | 'video';
export type ActivityType = 'post' | 'reel' | 'comment' | 'like' | 'share';
export type MessageStatus = 'sent' | 'delivered' | 'read';

// Sample test data with proper types
export const demoData = {
  users: [
    {
      phoneNumber: "1234567890",
      name: "Demo User",
      verificationStatus: "verified" as const,
      isPremium: true,
      digiLockerVerified: true,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    },
    {
      phoneNumber: "9876543210",
      name: "Test User",
      verificationStatus: "unverified" as const,
      isPremium: false,
      digiLockerVerified: false,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }
  ],
  posts: [
    {
      id: "demo-post-1",
      userId: "1234567890",
      content: "This is a sample post! 📝",
      category: "general",
      ageRestricted: false,
      mediaUrls: ["/sample-image.jpg"],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    }
  ],
  reels: [
    {
      reelId: "demo-reel-1",
      userId: "1234567890",
      videoUrl: "/sample-reel.mp4",
      thumbnailUrl: "/sample-thumbnail.jpg",
      caption: "My first reel! 🎥",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 42,
      views: 156
    }
  ],
  messages: [
    {
      messageId: "demo-message-1",
      chatId: "demo-chat-1",
      senderId: "1234567890",
      receiverId: "9876543210",
      content: "Hey there! 👋",
      mediaUrls: [],
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: "delivered" as MessageStatus
    }
  ],
  calls: [
    {
      callId: "demo-call-1",
      callerId: "1234567890",
      receiverId: "9876543210",
      status: "completed" as CallStatus,
      startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      endTime: new Date(Date.now() - 59 * 60 * 1000),
      duration: 60, // 1 minute call
      type: "video" as CallType
    }
  ],
  interactions: [
    {
      contentId: "demo-post-1",
      userId: "9876543210",
      type: "like" as ReactionType,
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
    }
  ],
  connections: [
    {
      userId: "1234567890",
      connectedUserId: "9876543210",
      connectionType: "following" as ConnectionType,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
  ]
};

// Export sample data for testing
export const getSampleData = () => demoData;
