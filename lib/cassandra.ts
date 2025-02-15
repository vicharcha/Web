import { Client, types } from 'cassandra-driver';
import { DatabaseResult } from './types';

const isDevelopment = process.env.NODE_ENV === 'development';
const useMockDB = isDevelopment || process.env.USE_MOCK_DB === 'true';

function getClientConfig() {
  if (process.env.VERCEL_ENV === 'production' && process.env.USE_MOCK_DB !== 'true') {
    if (!process.env.ASTRA_DB_ID || !process.env.ASTRA_DB_REGION || !process.env.ASTRA_DB_TOKEN || !process.env.ASTRA_DB_KEYSPACE || !process.env.ASTRA_SECURE_BUNDLE_URL) {
      throw new Error('Missing required Astra DB configuration in production. Set USE_MOCK_DB=true to use mock database instead.');
    }

    const config: any = {
      cloud: { secureConnectBundle: process.env.ASTRA_SECURE_BUNDLE_URL },
      credentials: { 
        username: 'token',
        password: process.env.ASTRA_DB_TOKEN
      },
      keyspace: process.env.ASTRA_DB_KEYSPACE,
      localDataCenter: process.env.ASTRA_DB_REGION
    };

    return config;
  }

  return {
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    credentials: {
      username: 'cassandra',
      password: 'cassandra'
    }
  };
}

// Initialize client without keyspace for initial connection
export const client = new Client(getClientConfig());

// Maximum number of connection retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to standardize database results
function createDatabaseResult(result: any): DatabaseResult {
  if (!result) {
    return { rowLength: 0, rows: [] };
  }
  
  return {
    rowLength: result.rowLength || result.rows?.length || 0,
    rows: result.rows || []
  };
}

// Connect to Cassandra with retries
export async function connectToCassandra() {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      await client.connect();
      console.log('Connected to Cassandra');
      await initializeCassandra();
      return;
    } catch (error) {
      retries++;
      const isLastAttempt = retries === MAX_RETRIES;
      
      console.error(`Cassandra connection attempt ${retries} failed:`, error);

      if (isLastAttempt) {
        console.error('Max connection retries reached');
        throw error;
      }

      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

// Query helper functions with retry logic
export async function executeQuery(query: string, params: any[] = []): Promise<DatabaseResult> {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const result = await client.execute(query, params, { prepare: true });
      return createDatabaseResult(result);
    } catch (error) {
      retries++;
      const isLastAttempt = retries === MAX_RETRIES;
      
      if (error instanceof Error) {
        const isTableNotExist = error.message.includes('table') && error.message.includes('does not exist');
        
        if (isTableNotExist && !isLastAttempt) {
          console.log('Table not found, attempting to reinitialize schema...');
          await initializeCassandra();
          continue;
        }
        
        console.error(`Query attempt ${retries} failed:`, error.message);
      }

      if (isLastAttempt) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }

  // Default response if all retries fail
  return { rowLength: 0, rows: [] };
}

// Batch query helper
export async function executeBatch(queries: { query: string; params: any[] }[]): Promise<DatabaseResult> {
  try {
    await client.batch(
      queries.map(q => ({ query: q.query, params: q.params })),
      { prepare: true }
    );
    return { rowLength: queries.length, rows: [] };
  } catch (error) {
    console.error('Error executing batch:', error);
    throw error;
  }
}

// Initialize schema
async function initializeCassandra() {
  // First create keyspace if it doesn't exist
  const createKeyspace = `
    CREATE KEYSPACE IF NOT EXISTS social_network 
    WITH replication = {
      'class': 'NetworkTopologyStrategy',
      '${process.env.ASTRA_DB_REGION || 'datacenter1'}': 1
    }`;

  try {
    await client.execute(createKeyspace);
  } catch (error) {
    console.log('Keyspace already exists or cannot be created, continuing...');
  }

  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS social_network.users (
      id uuid PRIMARY KEY,
      username text,
      phone_number text,
      email text,
      password_hash text,
      is_verified boolean,
      phone_verified boolean,
      digilocker_verified boolean,
      country_code text,
      created_at timestamp,
      last_active timestamp,
      settings map<text, text>
    )`,

    // Pending users table
    `CREATE TABLE IF NOT EXISTS social_network.pending_users (
      id uuid PRIMARY KEY,
      phone_number text,
      created_at timestamp
    )`,

    // OTP verification table
    `CREATE TABLE IF NOT EXISTS social_network.otp_verification (
      user_id uuid PRIMARY KEY,
      otp text,
      created_at timestamp,
      expires_at timestamp
    )`,

    // DigiLocker verification table
    `CREATE TABLE IF NOT EXISTS social_network.digilocker_auth (
      user_id uuid,
      document_id text,
      document_type text,
      issuer text,
      verification_status text,
      verified_at timestamp,
      PRIMARY KEY (user_id, document_id)
    )`,

    // Create indexes for efficient querying
    `CREATE INDEX IF NOT EXISTS users_phone_idx ON social_network.users (phone_number)`,
    `CREATE INDEX IF NOT EXISTS users_username_idx ON social_network.users (username)`,
    `CREATE INDEX IF NOT EXISTS pending_users_phone_idx ON social_network.pending_users (phone_number)`
  ];

  for (const query of queries) {
    try {
      await client.execute(query);
    } catch (error) {
      console.error('Error executing schema query:', query);
      console.error('Error details:', error);
      throw error;
    }
  }

  console.log('Cassandra schema initialized successfully');
}

export enum PostCategories {
  GENERAL = 'general',
  NEWS = 'news',
  ENTERTAINMENT = 'entertainment',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
  LIFESTYLE = 'lifestyle',
  EDUCATION = 'education',
  HEALTH = 'health',
  BUSINESS = 'business',
  OTHER = 'other'
}

export type PostCategory = keyof typeof PostCategories;

export { types };
