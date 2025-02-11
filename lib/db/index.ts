// In-memory store for demo purposes
const store = {
  users: new Map(),
  posts: new Map(),
  messages: new Map(),
  reels: new Map(),
  calls: new Map(),
  socialInteractions: new Map(),
  connections: new Map(),
};

// More comprehensive demo users for testing
const demoUsers = [
  {
    phoneNumber: "1234567890",
    name: "Demo User",
    verificationStatus: "verified",
    isPremium: true,
    digiLockerVerified: true,
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
  {
    phoneNumber: "9876543210",
    name: "Test User",
    verificationStatus: "unverified",
    isPremium: false,
    digiLockerVerified: false,
    joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    phoneNumber: "5555555555",
    name: "Premium Creator",
    verificationStatus: "verified",
    isPremium: true,
    digiLockerVerified: true,
    joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  }
];

// Mock user functions
export async function createUser(user: any) {
  store.users.set(user.phoneNumber, user);
  return user;
}

export async function getUser(phoneNumber: string) {
  return store.users.get(phoneNumber) || null;
}

// Mock post functions
export async function createPost(post: any) {
  const id = Math.random().toString(36).substring(7);
  const newPost = {
    ...post,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.posts.set(id, newPost);
  return newPost;
}

export async function getPosts() {
  return Array.from(store.posts.values());
}

// Mock message functions
export async function sendMessage(chatId: string, senderId: string, receiverId: string, content: string, mediaUrls: string[] = []) {
  const messageId = Math.random().toString(36).substring(7);
  const message = {
    messageId,
    chatId,
    senderId,
    receiverId,
    content,
    mediaUrls,
    createdAt: new Date(),
    status: "sent",
  };
  
  if (!store.messages.has(chatId)) {
    store.messages.set(chatId, []);
  }
  store.messages.get(chatId).push(message);
  return messageId;
}

export async function getMessages(chatId: string) {
  return store.messages.get(chatId) || [];
}

// Mock reel functions
export async function createReel(userId: string, videoUrl: string, thumbnailUrl: string, caption: string) {
  const reelId = Math.random().toString(36).substring(7);
  const reel = {
    reelId,
    userId,
    videoUrl,
    thumbnailUrl,
    caption,
    createdAt: new Date(),
    likes: 0,
    views: 0,
  };
  store.reels.set(reelId, reel);
  return reelId;
}

export async function getReels(userId?: string) {
  const reels = Array.from(store.reels.values());
  return userId ? reels.filter(reel => reel.userId === userId) : reels;
}

// Mock call functions
export async function createCall(callerId: string, receiverId: string, type: string) {
  const callId = Math.random().toString(36).substring(7);
  const call = {
    callId,
    callerId,
    receiverId,
    status: "initiated",
    startTime: new Date(),
    type,
  };
  store.calls.set(callId, call);
  return callId;
}

export async function updateCallStatus(callId: string, status: string, endTime?: Date) {
  const call = store.calls.get(callId);
  if (call) {
    call.status = status;
    if (endTime) {
      call.endTime = endTime;
      call.duration = Math.floor((endTime.getTime() - call.startTime.getTime()) / 1000);
    }
    store.calls.set(callId, call);
  }
}

export async function getCalls(userId: string) {
  return Array.from(store.calls.values()).filter(
    call => call.callerId === userId || call.receiverId === userId
  );
}

// Mock social interaction functions
export async function createInteraction(contentId: string, userId: string, type: string) {
  const key = `${contentId}-${userId}-${type}`;
  const interaction = {
    contentId,
    userId,
    type,
    createdAt: new Date(),
  };
  store.socialInteractions.set(key, interaction);
}

export async function getInteractions(contentId: string) {
  return Array.from(store.socialInteractions.values()).filter(
    interaction => interaction.contentId === contentId
  );
}

// Mock user settings functions
export async function updateUserSettings(userId: string, settings: Record<string, string>) {
  const user = store.users.get(userId);
  if (user) {
    user.settings = { ...(user.settings || {}), ...settings };
    store.users.set(userId, user);
  }
}

export async function getUserSettings(userId: string) {
  return store.users.get(userId)?.settings || {};
}

// Mock connections functions
export async function createConnection(userId: string, connectedUserId: string, connectionType: string) {
  const key = `${userId}-${connectedUserId}`;
  const connection = {
    userId,
    connectedUserId,
    connectionType,
    createdAt: new Date(),
  };
  store.connections.set(key, connection);
}

export async function getConnections(userId: string) {
  return Array.from(store.connections.values()).filter(
    connection => connection.userId === userId
  );
}

// Initialize demo data
const demoSetup = async () => {
  // Add demo users
  for (const user of demoUsers) {
    await createUser(user);
  }

  // Create demo posts
  const demoPosts = [
    {
      userId: "1234567890",
      content: "Just joined this amazing platform! 👋",
      category: "general",
      ageRestricted: false,
      mediaUrls: ["/demo/welcome-post.jpg"],
    },
    {
      userId: "5555555555",
      content: "Check out my latest creation! 🎨",
      category: "entertainment",
      ageRestricted: false,
      mediaUrls: ["/demo/artwork.jpg", "/demo/artwork-2.jpg"],
    }
  ];

  for (const post of demoPosts) {
    await createPost(post);
  }

  // Create demo reels
  const demoReels = [
    {
      userId: "5555555555",
      videoUrl: "/demo/dance-reel.mp4",
      thumbnailUrl: "/demo/dance-thumb.jpg",
      caption: "New dance routine! 💃",
    },
    {
      userId: "1234567890",
      videoUrl: "/demo/travel-reel.mp4",
      thumbnailUrl: "/demo/travel-thumb.jpg",
      caption: "Beautiful sunset at the beach 🌅",
    }
  ];

  for (const reel of demoReels) {
    await createReel(
      reel.userId,
      reel.videoUrl,
      reel.thumbnailUrl,
      reel.caption
    );
  }

  // Create demo messages
  const chatId = "demo-chat-1";
  const messages = [
    {
      senderId: "1234567890",
      receiverId: "9876543210",
      content: "Hey! How are you?",
      mediaUrls: [],
    },
    {
      senderId: "9876543210",
      receiverId: "1234567890",
      content: "I'm good! Thanks for asking 😊",
      mediaUrls: [],
    }
  ];

  for (const msg of messages) {
    await sendMessage(chatId, msg.senderId, msg.receiverId, msg.content);
  }

  // Create demo calls
  const demoCalls = [
    {
      callerId: "1234567890",
      receiverId: "9876543210",
      type: "video",
    },
    {
      callerId: "5555555555",
      receiverId: "1234567890",
      type: "audio",
    }
  ];

  for (const call of demoCalls) {
    const callId = await createCall(call.callerId, call.receiverId, call.type);
    await updateCallStatus(callId, "completed", new Date(Date.now() - 10 * 60 * 1000));
  }

  // Create demo connections
  const demoConnections = [
    {
      userId: "1234567890",
      connectedUserId: "5555555555",
      connectionType: "following",
    },
    {
      userId: "9876543210",
      connectedUserId: "1234567890",
      connectionType: "following",
    }
  ];

  for (const conn of demoConnections) {
    await createConnection(conn.userId, conn.connectedUserId, conn.connectionType);
  }
};

// Run demo setup
demoSetup();
