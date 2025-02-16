# Vicharcha Social Network

A modern social network platform with features like international phone number support and DigiLocker verification.

## Features

- 📱 International phone number support
- 🔒 DigiLocker integration for age verification
- 🌐 Multi-language support
- 📸 Stories and posts
- 💬 Real-time chat
- 🔐 Privacy settings
- 🎯 Age-restricted content control

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vicharcha.git
cd vicharcha
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
   - Database settings
   - SMS service credentials
   - DigiLocker integration details

5. Start the development server:
```bash
npm run dev
```

## Development Setup

### Database Setup

The project uses Apache Cassandra as the database. For development, you can:

1. Use the mock database (default in development):
```env
USE_MOCK_DB=true
```

2. Run Cassandra locally:
```bash
docker run -p 9042:9042 cassandra:latest
```

### DigiLocker Integration

1. Get DigiLocker API credentials from [https://digilocker.gov.in/](https://digilocker.gov.in/)
2. Configure in `.env`:
```env
DIGILOCKER_CLIENT_ID=your_client_id
DIGILOCKER_CLIENT_SECRET=your_client_secret
DIGILOCKER_REDIRECT_URI=http://localhost:3000/api/auth/digilocker/callback
```

### SMS Service

The project uses MSG91 for SMS OTP. Configure your credentials:
```env
SMS_API_KEY=your_msg91_api_key
SMS_SENDER_ID=VCHCHA
SMS_TEMPLATE_ID=your_template_id
```

## Development Mode Features

In development mode (`NODE_ENV=development`):

- Mock database is used by default
- OTP verification is simplified (shown in console)
- DigiLocker verification uses mock data
- Debug phone number: +911234567890
- Debug OTP: 123456

## Using the Mock Database

The mock database is used by default in development mode. To enable or disable the mock database, set the `USE_MOCK_DB` environment variable in your `.env` file:

```env
USE_MOCK_DB=true
```

When `USE_MOCK_DB` is set to `true`, the application will use the mock database for all operations. This is useful for development and testing purposes.

## Testing

Run the test suite:
```bash
npm test
```

## Production Deployment

1. Set up Cassandra database
2. Configure production environment variables
3. Deploy using Vercel:
```bash
vercel --prod
```

## Environment Variables

Key environment variables:

```env
# Environment
NODE_ENV=development|production
VERCEL_ENV=development|preview|production

# Database
USE_MOCK_DB=true|false
CASSANDRA_USERNAME=username
CASSANDRA_PASSWORD=password
CASSANDRA_KEYSPACE=social_network
CASSANDRA_CONTACT_POINTS=["host1", "host2"]

# Features
ENABLE_SMS_NOTIFICATIONS=true|false
ENABLE_DIGILOCKER=true|false
ENABLE_AGE_VERIFICATION=true|false
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
