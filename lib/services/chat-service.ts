import { query, getClient } from '../db'
import { Chat, ChatMessage, ChatParticipant } from '../types/db'

export async function createChat(name: string | null, isGroup: boolean): Promise<Chat> {
  const result = await query(
    'INSERT INTO chats (name, is_group) VALUES ($1, $2) RETURNING *',
    [name, isGroup]
  )
  return result.rows[0]
}

export async function addParticipantToChat(
  chatId: number,
  userId: number,
  isAdmin: boolean = false
): Promise<ChatParticipant> {
  const result = await query(
    'INSERT INTO chat_participants (chat_id, user_id, is_admin) VALUES ($1, $2, $3) RETURNING *',
    [chatId, userId, isAdmin]
  )
  return result.rows[0]
}

export async function sendMessage(
  chatId: number,
  senderId: number,
  content: string,
  mediaUrl?: string,
  mediaType?: string
): Promise<ChatMessage> {
  const result = await query(
    `INSERT INTO chat_messages 
     (chat_id, sender_id, content, media_url, media_type) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [chatId, senderId, content, mediaUrl, mediaType]
  )
  return result.rows[0]
}

export async function getChatMessages(
  chatId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> {
  const result = await query(
    `SELECT * FROM chat_messages 
     WHERE chat_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [chatId, limit, offset]
  )
  return result.rows
}

export async function getUserChats(userId: number): Promise<Chat[]> {
  const result = await query(
    `SELECT c.* 
     FROM chats c
     JOIN chat_participants cp ON c.id = cp.chat_id
     WHERE cp.user_id = $1
     ORDER BY c.updated_at DESC`,
    [userId]
  )
  return result.rows
}

export async function getChatParticipants(chatId: number): Promise<ChatParticipant[]> {
  const result = await query(
    'SELECT * FROM chat_participants WHERE chat_id = $1',
    [chatId]
  )
  return result.rows
}

export async function updateMessageStatus(
  messageId: number,
  status: 'sent' | 'delivered' | 'read' | 'failed'
): Promise<ChatMessage> {
  const result = await query(
    'UPDATE chat_messages SET status = $1 WHERE id = $2 RETURNING *',
    [status, messageId]
  )
  return result.rows[0]
}

export async function removeParticipantFromChat(
  chatId: number,
  userId: number
): Promise<void> {
  await query(
    'DELETE FROM chat_participants WHERE chat_id = $1 AND user_id = $2',
    [chatId, userId]
  )
}

export async function updateChatName(chatId: number, name: string): Promise<Chat> {
  const result = await query(
    'UPDATE chats SET name = $1 WHERE id = $2 RETURNING *',
    [name, chatId]
  )
  return result.rows[0]
}

export async function deleteChat(chatId: number): Promise<void> {
  const client = await getClient()
  
  try {
    await client.query('BEGIN')
    
    // Delete all messages in the chat
    await client.query('DELETE FROM chat_messages WHERE chat_id = $1', [chatId])
    
    // Delete all participants
    await client.query('DELETE FROM chat_participants WHERE chat_id = $1', [chatId])
    
    // Delete the chat itself
    await client.query('DELETE FROM chats WHERE id = $1', [chatId])
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function markMessagesAsRead(
  chatId: number,
  userId: number
): Promise<void> {
  await query(
    `UPDATE chat_messages 
     SET status = 'read' 
     WHERE chat_id = $1 
     AND sender_id != $2 
     AND status = 'delivered'`,
    [chatId, userId]
  )
}

export async function getUnreadMessageCount(chatId: number, userId: number): Promise<number> {
  const result = await query(
    `SELECT COUNT(*) as count 
     FROM chat_messages 
     WHERE chat_id = $1 
     AND sender_id != $2 
     AND status != 'read'`,
    [chatId, userId]
  )
  return parseInt(result.rows[0].count)
}
