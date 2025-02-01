import { Pool } from 'pg'
import config from '../lib/config'

const pool = new Pool(config.database)

async function seed() {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    console.log('Seeding test users...')
    // Create test users
    const users = [
      {
        phone_number: '+911234567890',
        name: 'Test User 1',
        verification_status: 'verified',
        is_premium: true
      },
      {
        phone_number: '+919876543210',
        name: 'Test User 2',
        verification_status: 'verified',
        is_premium: false
      },
      {
        phone_number: '+917777777777',
        name: 'Test User 3',
        verification_status: 'pending',
        is_premium: false
      }
    ]

    for (const user of users) {
      await client.query(
        `INSERT INTO users (phone_number, name, verification_status, is_premium)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (phone_number) DO NOTHING`,
        [user.phone_number, user.name, user.verification_status, user.is_premium]
      )
    }

    console.log('Seeding emergency contacts...')
    // Create emergency contacts for Test User 1
    const emergencyContacts = [
      {
        user_phone: '+911234567890',
        name: 'Emergency Contact 1',
        phone_number: '+911111111111',
        relationship: 'Family'
      },
      {
        user_phone: '+911234567890',
        name: 'Emergency Contact 2',
        phone_number: '+912222222222',
        relationship: 'Friend'
      }
    ]

    for (const contact of emergencyContacts) {
      const userResult = await client.query(
        'SELECT id FROM users WHERE phone_number = $1',
        [contact.user_phone]
      )
      
      if (userResult.rows[0]) {
        await client.query(
          `INSERT INTO emergency_contacts (user_id, name, phone_number, relationship)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id, phone_number) DO NOTHING`,
          [userResult.rows[0].id, contact.name, contact.phone_number, contact.relationship]
        )
      }
    }

    console.log('Creating test chats...')
    // Create a test group chat
    const chatResult = await client.query(
      `INSERT INTO chats (name, is_group)
       VALUES ($1, $2)
       RETURNING id`,
      ['Test Group', true]
    )
    
    const chatId = chatResult.rows[0].id

    // Add users to the group chat
    const userIds = await client.query(
      'SELECT id FROM users WHERE phone_number = ANY($1)',
      [users.map(u => u.phone_number)]
    )

    for (const user of userIds.rows) {
      await client.query(
        `INSERT INTO chat_participants (chat_id, user_id, is_admin)
         VALUES ($1, $2, $3)`,
        [chatId, user.id, user.id === userIds.rows[0].id] // First user is admin
      )
    }

    console.log('Adding test messages...')
    // Add some test messages
    const messages = [
      'Hello everyone!',
      'Hi there!',
      'How are you all doing?',
      'Great to be here!'
    ]

    for (let i = 0; i < messages.length; i++) {
      const senderId = userIds.rows[i % userIds.rows.length].id
      await client.query(
        `INSERT INTO chat_messages (chat_id, sender_id, content, status)
         VALUES ($1, $2, $3, $4)`,
        [chatId, senderId, messages[i], 'sent']
      )
    }

    console.log('Adding test notifications...')
    // Create some test notifications
    const notifications = [
      {
        user_id: userIds.rows[0].id,
        type: 'message',
        content: 'You have a new message',
        is_read: false
      },
      {
        user_id: userIds.rows[0].id,
        type: 'emergency',
        content: 'Emergency alert from contact',
        is_read: true
      }
    ]

    for (const notification of notifications) {
      await client.query(
        `INSERT INTO notifications (user_id, type, content, is_read)
         VALUES ($1, $2, $3, $4)`,
        [notification.user_id, notification.type, notification.content, notification.is_read]
      )
    }

    await client.query('COMMIT')
    console.log('Database seeding completed successfully')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error seeding database:', error)
    throw error
  } finally {
    client.release()
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding complete')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
    .finally(() => {
      pool.end()
    })
}
