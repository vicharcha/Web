// Mock in-memory storage
const storage = {
  users: new Map<string, any>(),
  pending_users: new Map<string, any>(),
  otp_verification: new Map<string, any>()
}

export const mockDB = {
  async query(query: string, params: any[]) {
    console.log('Mock DB Query:', query, params)

    // Demo user handling
    if (params.includes('+911234567890')) {
      if (query.includes('INSERT INTO')) {
        const userId = params[0]
        storage.users.set(userId, {
          id: userId,
          username: params[1] || 'demo_user',
          phone_number: '+911234567890',
          is_verified: false,
          phone_verified: true,
          created_at: new Date(),
          last_active: new Date()
        })
        return { rowLength: 1 }
      }

      // Return demo user for queries
      const demoUser = Array.from(storage.users.values())
        .find(user => user.phone_number === '+911234567890')
      
      return {
        rowLength: demoUser ? 1 : 0,
        rows: demoUser ? [demoUser] : []
      }
    }

    // Generic response for other queries
    return {
      rowLength: 0,
      rows: []
    }
  }
}
