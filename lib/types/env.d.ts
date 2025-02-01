declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    POSTGRES_USER?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_HOST?: string;
    POSTGRES_PORT?: string;
    POSTGRES_DB?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_PHONE_NUMBER?: string;
    MAX_EMERGENCY_CONTACTS?: string;
    LOCATION_UPDATE_INTERVAL?: string;
    EMERGENCY_SERVICE_RADIUS?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
    REDIS_PASSWORD?: string;
    PORT?: string;
    CORS_ORIGINS?: string;
    RATE_LIMIT_WINDOW?: string;
    RATE_LIMIT_MAX?: string;
    MAX_UPLOAD_SIZE?: string;
    ALLOWED_UPLOAD_TYPES?: string;
    STORAGE_TYPE?: 'local' | 's3';
    S3_BUCKET?: string;
    S3_REGION?: string;
    S3_ACCESS_KEY_ID?: string;
    S3_SECRET_ACCESS_KEY?: string;
    CACHE_TTL?: string;
    WS_PING_INTERVAL?: string;
    WS_PING_TIMEOUT?: string;
  }
}
