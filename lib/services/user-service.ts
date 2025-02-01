import { query } from '../db'
import { User } from '../types/db'

export async function getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE phone_number = $1',
    [phoneNumber]
  )
  return result.rows[0] || null
}

export async function createUser(phoneNumber: string, name?: string): Promise<User> {
  const result = await query(
    'INSERT INTO users (phone_number, name) VALUES ($1, $2) RETURNING *',
    [phoneNumber, name]
  )
  return result.rows[0]
}

export async function updateUserVerificationStatus(
  userId: number,
  status: 'unverified' | 'pending' | 'verified'
): Promise<User> {
  const result = await query(
    'UPDATE users SET verification_status = $1 WHERE id = $2 RETURNING *',
    [status, userId]
  )
  return result.rows[0]
}

export async function updateUserName(userId: number, name: string): Promise<User> {
  const result = await query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
    [name, userId]
  )
  return result.rows[0]
}

export async function updatePremiumStatus(userId: number, isPremium: boolean): Promise<User> {
  const result = await query(
    'UPDATE users SET is_premium = $1 WHERE id = $2 RETURNING *',
    [isPremium, userId]
  )
  return result.rows[0]
}

export async function deleteUser(userId: number): Promise<void> {
  await query('DELETE FROM users WHERE id = $1', [userId])
}

export async function getUserById(userId: number): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )
  return result.rows[0] || null
}

export async function searchUsers(searchTerm: string): Promise<User[]> {
  const result = await query(
    `SELECT * FROM users 
     WHERE name ILIKE $1 
     OR phone_number LIKE $1`,
    [`%${searchTerm}%`]
  )
  return result.rows
}
