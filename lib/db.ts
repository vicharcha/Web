import { client, connectToCassandra, executeQuery as cassandraExecute, Post, PostCategory } from './cassandra';
import { types } from 'cassandra-driver';

const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize database connection
(async () => {
  try {
    await connectToCassandra();
  } catch (error) {
    console.error('Failed to connect to Cassandra:', error);
  }
})();

interface StoredUser {
  id: string;
  username?: string;
  phone_number: string;
  is_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  last_active: Date;
}

// Posts related functions
export async function getPosts(): Promise<Post[]> {
  try {
    const query = 'SELECT * FROM social_network.posts';
    const result = await cassandraExecute(query);
    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      category: row.category as PostCategory,
      ageRestricted: row.age_restricted,
      mediaUrls: row.media_urls || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  try {
    const id = types.Uuid.random();
    const now = new Date();
    
    const query = `
      INSERT INTO social_network.posts 
      (id, user_id, content, category, age_restricted, media_urls, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      post.userId,
      post.content,
      post.category,
      post.ageRestricted,
      post.mediaUrls,
      now,
      now
    ];
    
    await cassandraExecute(query, params);
    
    return {
      id,
      ...post,
      createdAt: now,
      updatedAt: now
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// User related functions
export async function executeQuery(query: string, params: any[]) {
  try {
    return await cassandraExecute(query, params);
  } catch (error) {
    console.error('Database error:', error);
    if (isDevelopment) {
      return mockInMemoryDB(query, params);
    }
    throw error;
  }
}

async function mockInMemoryDB(query: string, params: any[]) {
  console.log('Mock DB Query:', { query, params });
  // Existing mock implementation...
  return { rowLength: 0, rows: [] };
}
