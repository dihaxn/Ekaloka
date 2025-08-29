# Environment Variables Setup

This document outlines all the required environment variables for the Ekaloka e-commerce application.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Database Configuration
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/ekaloka_db"
```

### JWT Secrets (generate secure random strings, min 32 characters)
```bash
JWT_ACCESS_SECRET="your-super-secure-access-secret-key-here-min-32-chars"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key-here-min-32-chars"
```

### Environment
```bash
NODE_ENV="development"
```

### API Configuration
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### SMS Service (Mobitel)
```bash
MOBITEL_SMS_API_URL="https://api.mobitel.lk/sms/send"
MOBITEL_SMS_USERNAME="your_mobitel_username"
MOBITEL_SMS_PASSWORD="your_mobitel_password"
MOBITEL_SMS_SENDER_ID="DAI_FASHION"
```

### Email Service (Brevo)
```bash
BREVO_API_KEY="your_brevo_api_key"
BREVO_SENDER_EMAIL="noreply@daifashion.com"
BREVO_SENDER_NAME="DAI Fashion"
```

### OAuth Configuration (if using social login)
```bash
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
```

### Security
```bash
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:4000"
```

## Setup Instructions

1. Copy the `.env.example` file to `.env.local`
2. Update the values with your actual configuration
3. Restart your development server
4. Never commit `.env.local` to version control

## Security Notes

- JWT secrets should be at least 32 characters long
- Use different secrets for development, staging, and production
- Rotate secrets regularly in production
- Keep API keys and secrets secure
