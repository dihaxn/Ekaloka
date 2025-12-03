# Login Component Setup Guide

## 🚀 Quick Setup

The Login component is now working without the CSRF provider, but for full functionality, follow this setup guide.

## 📋 Prerequisites

Make sure you have the following environment variables set in your `.env.local` file:

```bash
# Required
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Optional Features
NEXT_PUBLIC_ENABLE_MFA=true
NEXT_PUBLIC_ENABLE_TELEMETRY=true
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🔧 Setting Up CSRF Provider (Optional)

To enable CSRF protection, wrap your app with the `CsrfProvider`:

### 1. Update your `src/app/layout.jsx` or main layout file:

```jsx
'use client';
import { CsrfProvider } from '../contexts/CsrfContext';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <CsrfProvider>{children}</CsrfProvider>
      </body>
    </html>
  );
}
```

### 2. Or create a client-side wrapper component:

```jsx
// src/components/Providers.jsx
'use client';
import { CsrfProvider } from '../contexts/CsrfContext';

export function Providers({ children }) {
  return <CsrfProvider>{children}</CsrfProvider>;
}
```

Then use it in your layout:

```jsx
import { Providers } from '../components/Providers';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 🌍 Setting Up Internationalization (Optional)

The component currently defaults to English. To change the language:

### 1. Create a language context:

```jsx
// src/contexts/LanguageContext.jsx
'use client';
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### 2. Update the Login component to use the language context:

```jsx
// In src/app/login/page.jsx, update the useTranslation call:
const { locale } = useLanguage();
const { t } = useTranslation(locale);
```

## 📊 Setting Up Telemetry (Optional)

To enable telemetry logging, create the telemetry API endpoint:

### 1. Create `src/app/api/telemetry/route.js`:

```javascript
export async function POST(request) {
  try {
    const event = await request.json();

    // Log to your preferred service (e.g., console, database, external service)
    console.log('Telemetry Event:', event);

    // Example: Send to external service
    // await fetch('https://your-analytics-service.com/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Telemetry error:', error);
    return Response.json({ success: false }, { status: 500 });
  }
}
```

## 🔐 Backend Requirements

Your backend should implement these endpoints:

### 1. CSRF Token Endpoint

```
GET /api/auth/csrf-token
Response: { "token": "csrf-token-value" }
```

### 2. Login Endpoint

```
POST /api/auth/login
Headers: { "X-CSRF-Token": "token-value" }
Body: { "email": "...", "password": "...", "rememberMe": true }
Response: { "success": true } or { "mfaRequired": true, "mfaData": {...} }
```

### 3. MFA Verification Endpoint

```
POST /api/auth/mfa/verify
Body: { "type": "otp", "code": "123456" }
Response: { "success": true }
```

### 4. Telemetry Endpoint

```
POST /api/telemetry
Body: { "event": "...", "timestamp": "...", ... }
Response: { "success": true }
```

## 🧪 Testing the Setup

### 1. Test Basic Login

- Navigate to `/login`
- Try logging in with valid credentials
- Check browser console for any errors

### 2. Test CSRF Protection (if enabled)

- Check if CSRF token is fetched on page load
- Verify token is included in login requests

### 3. Test MFA (if enabled)

- Configure MFA on your backend
- Test OTP and WebAuthn flows

### 4. Test Telemetry (if enabled)

- Check browser network tab for telemetry requests
- Verify events are logged correctly

## 🐛 Troubleshooting

### Common Issues:

1. **CSRF Context Error**
   - Solution: The component now works without the provider
   - For full functionality, add the `CsrfProvider` as shown above

2. **API URL Not Configured**
   - Solution: Set `NEXT_PUBLIC_API_URL` in your `.env.local`

3. **Translation Not Working**
   - Solution: The component defaults to English
   - Add language context for multi-language support

4. **Telemetry Not Logging**
   - Solution: Create the telemetry API endpoint
   - Or disable telemetry by setting `NEXT_PUBLIC_ENABLE_TELEMETRY=false`

### Debug Mode:

Add this to your `.env.local` for enhanced logging:

```bash
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📁 File Structure

After setup, your project should look like this:

```
src/
├── app/
│   ├── api/
│   │   └── telemetry/
│   │       └── route.js
│   ├── login/
│   │   └── page.jsx
│   └── layout.jsx
├── components/
│   ├── Providers.jsx (optional)
│   ├── SocialLoginButtons.jsx
│   └── MessageAlert.jsx
├── contexts/
│   ├── CsrfContext.jsx
│   └── LanguageContext.jsx (optional)
└── hooks/
    ├── useConfig.js
    ├── useTelemetry.js
    └── useTranslation.js
```

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] CSRF provider added (optional)
- [ ] Language context added (optional)
- [ ] Telemetry endpoint created (optional)
- [ ] Backend endpoints implemented
- [ ] Login form loads without errors
- [ ] CSRF protection working (if enabled)
- [ ] MFA flows working (if enabled)
- [ ] Telemetry logging (if enabled)
- [ ] Translations working (if enabled)

## 🚀 Production Deployment

For production deployment:

1. **Set production environment variables**
2. **Enable HTTPS** (required for WebAuthn)
3. **Configure proper CORS** on your backend
4. **Set up monitoring** for telemetry events
5. **Test all authentication flows**
6. **Verify security headers** are properly set

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure backend endpoints are working
4. Test with a minimal setup first
5. Check the troubleshooting section above

The Login component is designed to work with minimal setup while providing enterprise-grade features when fully configured.
