export const appConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    endpoints: {
      auth: {
        login: '/api/auth/login',
        refresh: '/api/auth/refresh',
        logout: '/api/auth/logout',
      },
      products: {
        list: '/api/products',
        detail: (id: string) => `/api/products/${id}`,
        create: '/api/products',
        update: (id: string) => `/api/products/${id}`,
        delete: (id: string) => `/api/products/${id}`,
      },
    },
  },
  auth: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/api/auth/refresh',
    },
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
} as const;
