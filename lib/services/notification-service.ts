import { query } from '../db'
import { Notification } from '../types/db'

export type NotificationType = 
  | 'message'
  | 'emergency'
  | 'chat_invite'
  | 'system'
  | 'verification'

export async function createNotification(
  userId: number,
  type: NotificationType,
  content: string
): Promise<Notification> {
  const result = await query(
    `INSERT INTO notifications 
     (user_id, type, content) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [userId, type, content]
  )
  return result.rows[0]
}

export async function getUserNotifications(
  userId: number,
  limit: number = 50,
  offset: number = 0
): Promise<Notification[]> {
  const result = await query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  )
  return result.rows
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const result = await query(
    `SELECT COUNT(*) as count 
     FROM notifications 
     WHERE user_id = $1 
     AND is_read = false`,
    [userId]
  )
  return parseInt(result.rows[0].count)
}

export async function markNotificationAsRead(notificationId: number): Promise<Notification> {
  const result = await query(
    `UPDATE notifications 
     SET is_read = true 
     WHERE id = $1 
     RETURNING *`,
    [notificationId]
  )
  return result.rows[0]
}

export async function markAllNotificationsAsRead(userId: number): Promise<void> {
  await query(
    `UPDATE notifications 
     SET is_read = true 
     WHERE user_id = $1 
     AND is_read = false`,
    [userId]
  )
}

export async function deleteNotification(notificationId: number): Promise<void> {
  await query(
    'DELETE FROM notifications WHERE id = $1',
    [notificationId]
  )
}

export async function deleteAllUserNotifications(userId: number): Promise<void> {
  await query(
    'DELETE FROM notifications WHERE user_id = $1',
    [userId]
  )
}

export async function getNotificationsByType(
  userId: number,
  type: NotificationType
): Promise<Notification[]> {
  const result = await query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     AND type = $2 
     ORDER BY created_at DESC`,
    [userId, type]
  )
  return result.rows
}

export async function createEmergencyNotification(
  userId: number,
  emergencyType: string,
  location?: { latitude: number; longitude: number }
): Promise<Notification> {
  const content = JSON.stringify({
    type: emergencyType,
    location,
    timestamp: new Date().toISOString()
  })
  
  return await createNotification(userId, 'emergency', content)
}

export async function createChatInviteNotification(
  userId: number,
  chatId: number,
  inviterId: number
): Promise<Notification> {
  const content = JSON.stringify({
    chatId,
    inviterId,
    timestamp: new Date().toISOString()
  })
  
  return await createNotification(userId, 'chat_invite', content)
}

export async function createMessageNotification(
  userId: number,
  chatId: number,
  senderId: number,
  messagePreview: string
): Promise<Notification> {
  const content = JSON.stringify({
    chatId,
    senderId,
    messagePreview,
    timestamp: new Date().toISOString()
  })
  
  return await createNotification(userId, 'message', content)
}

export async function createVerificationNotification(
  userId: number,
  verificationType: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<Notification> {
  const content = JSON.stringify({
    verificationType,
    status,
    timestamp: new Date().toISOString()
  })
  
  return await createNotification(userId, 'verification', content)
}
