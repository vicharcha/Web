const config = {
  database: {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'vicharcha_db',
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false }
      : undefined
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-development-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  sms: {
    provider: process.env.SMS_PROVIDER || 'twilio',
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  emergency: {
    maxContactsPerUser: parseInt(process.env.MAX_EMERGENCY_CONTACTS || '5'),
    locationUpdateInterval: parseInt(process.env.LOCATION_UPDATE_INTERVAL || '300000'), // 5 minutes in ms
    emergencyServiceRadius: parseInt(process.env.EMERGENCY_SERVICE_RADIUS || '5000'), // 5km in meters
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes in ms
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },
  upload: {
    maxSize: parseInt(process.env.MAX_UPLOAD_SIZE || '5242880'), // 5MB in bytes
    allowedTypes: (process.env.ALLOWED_UPLOAD_TYPES || 'image/jpeg,image/png,image/gif').split(','),
    storageType: process.env.STORAGE_TYPE || 'local', // 'local' or 's3'
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || '',
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour in seconds
  },
  websocket: {
    pingInterval: parseInt(process.env.WS_PING_INTERVAL || '30000'), // 30 seconds in ms
    pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '5000'), // 5 seconds in ms
  },
} as const;

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_HOST',
    'POSTGRES_DB',
    'JWT_SECRET',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
  ] as const;

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

export type Config = typeof config;
export default config;
