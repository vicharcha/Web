import { createUser, createPost, createReel, sendMessage, createCall, createConnection } from './db'

// Test sequence to verify core functionality
async function testCoreFunctionality() {
  console.log('Starting core functionality test...')

  try {
    // 1. Test user login/creation
    console.log('\nTesting user functionality...')
    const testUser = {
      phoneNumber: "1234567890",
      name: "Test User",
      verificationStatus: "verified",
      isPremium: false,
      digiLockerVerified: false,
      joinedDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    }
    await createUser(testUser)
    console.log('✅ User created successfully')

    // 2. Test post creation
    console.log('\nTesting post functionality...')
    const post = await createPost({
      userId: testUser.phoneNumber,
      content: "Test post content",
      category: "general",
      ageRestricted: false,
      mediaUrls: ["/test-image.jpg"],
    })
    console.log('✅ Post created successfully:', post.id)

    // 3. Test reel creation
    console.log('\nTesting reel functionality...')
    const reelId = await createReel(
      testUser.phoneNumber,
      "/test-video.mp4",
      "/test-thumbnail.jpg",
      "Test reel caption"
    )
    console.log('✅ Reel created successfully:', reelId)

    // 4. Test messaging
    console.log('\nTesting messaging functionality...')
    const chatId = "test-chat-1"
    const messageId = await sendMessage(
      chatId,
      testUser.phoneNumber,
      "9876543210",
      "Hello, this is a test message!"
    )
    console.log('✅ Message sent successfully:', messageId)

    // 5. Test call creation
    console.log('\nTesting call functionality...')
    const callId = await createCall(
      testUser.phoneNumber,
      "9876543210",
      "video"
    )
    console.log('✅ Call created successfully:', callId)

    // 6. Test social connection
    console.log('\nTesting social connection functionality...')
    await createConnection(
      testUser.phoneNumber,
      "9876543210",
      "following"
    )
    console.log('✅ Connection created successfully')

    console.log('\nAll core functionality tests passed!')
    return true
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

// Export for use in development
export const runTests = testCoreFunctionality

// Auto-run in development if module is executed directly
if (process.env.NODE_ENV === 'development') {
  testCoreFunctionality().then(success => {
    if (success) {
      console.log('\n🎉 All demo functionality is working correctly!')
    } else {
      console.log('\n❌ Some tests failed. Check the error messages above.')
    }
  })
}

// Sample test sequence for each feature
export const testSequences = {
  userFlow: [
    '1. Open app',
    '2. Enter phone number (1234567890)',
    '3. Verify OTP (mock: 123456)',
    '4. Check profile page loads',
    '5. Update profile settings'
  ],
  postingFlow: [
    '1. Click create post',
    '2. Add text content',
    '3. Upload media',
    '4. Set category',
    '5. Publish post',
    '6. Verify in feed'
  ],
  reelsFlow: [
    '1. Navigate to reels',
    '2. Create new reel',
    '3. Upload video',
    '4. Add caption',
    '5. Publish reel',
    '6. Verify playback'
  ],
  messagingFlow: [
    '1. Open messages',
    '2. Start new chat',
    '3. Send text message',
    '4. Send media',
    '5. Check delivery status'
  ],
  callsFlow: [
    '1. Open calls tab',
    '2. Start video call',
    '3. Test audio',
    '4. Test video',
    '5. End call',
    '6. Check call history'
  ],
  socialFlow: [
    '1. Visit profile',
    '2. Follow user',
    '3. Like content',
    '4. Comment on post',
    '5. Share content',
    '6. Check notifications'
  ]
}
