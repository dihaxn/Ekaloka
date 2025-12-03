import { useMemo } from 'react';

export const useConfig = () => {
  const config = useMemo(() => {
    return {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      environment: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      isDevelopment: process.env.NODE_ENV === 'development',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      features: {
        mfa: process.env.NEXT_PUBLIC_ENABLE_MFA === 'true',
        telemetry: process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === 'true',
        socialLogin: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
      },
    };
  }, []);

  return config;
};
