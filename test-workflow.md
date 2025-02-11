# Test Workflow for Core Features

## 1. Authentication
```
1. Open `/login`
2. Enter phone number: 1234567890
3. Click "Send OTP"
4. Enter OTP: 123456 (mock)
5. Verify redirect to home page
6. Check user state is set
```

## 2. Feed & Posts
```
1. Navigate to home feed
2. Create a new post:
   - Click "Create Post"
   - Add text content
   - Upload test image
   - Select category
   - Publish
3. Verify post appears in feed
4. Test interactions:
   - Like post
   - Comment
   - Share
```

## 3. Reels
```
1. Navigate to `/reels`
2. Create new reel:
   - Upload test video
   - Add caption
   - Set thumbnail
   - Publish
3. Verify reel playback
4. Test interactions:
   - Like
   - Comment
   - Share
```

## 4. Messaging
```
1. Navigate to `/messages`
2. Start new chat:
   - Select contact (Test User)
   - Send text message
   - Send image
   - Send emoji
3. Verify:
   - Message delivery
   - Media preview
   - Chat list update
```

## 5. Calls
```
1. Navigate to `/calls`
2. Start video call:
   - Select contact
   - Test video
   - Test audio
   - End call
3. Verify:
   - Call connection
   - Media streams
   - Call history
```

## 6. Social Features
```
1. Navigate to profiles
2. Test connections:
   - Follow user
   - Block user
   - Unfollow user
3. Test reactions:
   - Like content
   - Comment
   - Share
```

## Run Test Suite
```typescript
// Run automated tests
import { runTests } from '@/lib/mock-test'

// Execute test sequence
await runTests()

// Verify results in console
```

## Manual Testing Checklist
- [ ] User can log in
- [ ] User can create and view posts
- [ ] User can create and watch reels
- [ ] User can send and receive messages
- [ ] User can make and receive calls
- [ ] User can interact with other users

## Test Data Available
```typescript
// Demo Users
- Phone: 1234567890 (Demo User)
- Phone: 9876543210 (Test User)
- Phone: 5555555555 (Premium Creator)

// Demo Content
- Posts
- Reels
- Messages
- Calls
- Social Connections
```

## Example Test Flow
```typescript
// 1. Login as demo user
await mockAuthState({
  phoneNumber: "1234567890",
  name: "Demo User",
  verificationStatus: "verified"
})

// 2. Create test post
await createPost({
  userId: "1234567890",
  content: "Test post",
  category: "general"
})

// 3. Create test reel
await createReel(
  "1234567890",
  "/test-video.mp4",
  "/test-thumb.jpg",
  "Test reel"
)

// 4. Send test message
await sendMessage(
  "test-chat",
  "1234567890",
  "9876543210",
  "Test message"
)
