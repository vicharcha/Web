import { query } from '../db'
import { EmergencyContact } from '../types/db'

export async function addEmergencyContact(
  userId: number,
  name: string,
  phoneNumber: string,
  relationship?: string
): Promise<EmergencyContact> {
  const result = await query(
    `INSERT INTO emergency_contacts 
     (user_id, name, phone_number, relationship) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [userId, name, phoneNumber, relationship]
  )
  return result.rows[0]
}

export async function getUserEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
  const result = await query(
    'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return result.rows
}

export async function updateEmergencyContact(
  contactId: number,
  updates: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  }
): Promise<EmergencyContact> {
  const setClause = Object.entries(updates)
    .map(([key, _], index) => {
      const columnName = key === 'phoneNumber' ? 'phone_number' : key
      return `${columnName} = $${index + 2}`
    })
    .join(', ')

  const values = Object.values(updates)
  
  const result = await query(
    `UPDATE emergency_contacts 
     SET ${setClause} 
     WHERE id = $1 
     RETURNING *`,
    [contactId, ...values]
  )
  return result.rows[0]
}

export async function deleteEmergencyContact(contactId: number): Promise<void> {
  await query(
    'DELETE FROM emergency_contacts WHERE id = $1',
    [contactId]
  )
}

export async function getEmergencyContactById(contactId: number): Promise<EmergencyContact | null> {
  const result = await query(
    'SELECT * FROM emergency_contacts WHERE id = $1',
    [contactId]
  )
  return result.rows[0] || null
}

export async function validateEmergencyContact(phoneNumber: string): Promise<boolean> {
  // Add your phone number validation logic here
  const phoneRegex = /^\+?[1-9]\d{1,14}$/ // Basic international phone number format
  return phoneRegex.test(phoneNumber)
}

export async function getEmergencyContactsByLocation(
  latitude: number,
  longitude: number,
  radius: number = 5 // radius in kilometers
): Promise<any[]> {
  // Note: This is a placeholder for future implementation
  // You would typically integrate with a geocoding service and emergency services API
  // This would require additional database tables for emergency service locations
  throw new Error('Emergency services by location feature not implemented yet')
}

export async function searchEmergencyContacts(
  userId: number,
  searchTerm: string
): Promise<EmergencyContact[]> {
  const result = await query(
    `SELECT * FROM emergency_contacts 
     WHERE user_id = $1 
     AND (name ILIKE $2 OR phone_number LIKE $2 OR relationship ILIKE $2)`,
    [userId, `%${searchTerm}%`]
  )
  return result.rows
}

export async function countEmergencyContacts(userId: number): Promise<number> {
  const result = await query(
    'SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = $1',
    [userId]
  )
  return parseInt(result.rows[0].count)
}

// This function would be used to verify if a contact has approved being an emergency contact
export async function verifyEmergencyContactConsent(
  contactId: number,
  verificationCode: string
): Promise<boolean> {
  // Note: This is a placeholder for future implementation
  // You would typically:
  // 1. Send a verification code to the emergency contact
  // 2. Store the verification attempt in a separate table
  // 3. Verify the code matches what was sent
  // 4. Update the emergency contact's verification status
  throw new Error('Emergency contact verification feature not implemented yet')
}
