import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Time before inactive queries are garbage collected
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
      
      // Retry delay
      retryDelay: 1000,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth queries
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
    permissions: ['auth', 'permissions'] as const,
  },
  
  // User queries
  user: {
    profile: ['user', 'profile'] as const,
    preferences: ['user', 'preferences'] as const,
    orders: ['user', 'orders'] as const,
    addresses: ['user', 'addresses'] as const,
  },
  
  // Product queries
  products: {
    all: ['products'] as const,
    list: (filters: any) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    search: (query: string) => ['products', 'search', query] as const,
    categories: ['products', 'categories'] as const,
    brands: ['products', 'brands'] as const,
  },
  
  // Cart queries
  cart: {
    items: ['cart', 'items'] as const,
    summary: ['cart', 'summary'] as const,
  },
  
  // Order queries
  orders: {
    all: ['orders'] as const,
    list: (filters: any) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    tracking: (id: string) => ['orders', 'tracking', id] as const,
  },
  
  // Admin queries
  admin: {
    users: ['admin', 'users'] as const,
    products: ['admin', 'products'] as const,
    orders: ['admin', 'orders'] as const,
    analytics: ['admin', 'analytics'] as const,
  },
} as const;

// Prefetch functions for common queries
export const prefetchQueries = {
  // Prefetch user profile
  userProfile: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.user.profile,
      queryFn: async () => {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch user profile');
        return response.json();
      },
    });
  },
  
  // Prefetch products list
  productsList: async (filters: any = {}) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(filters),
      queryFn: async () => {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
      },
    });
  },
  
  // Prefetch categories
  categories: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.products.categories,
      queryFn: async () => {
        const response = await fetch('/api/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
      },
    });
  },
};

// Invalidation functions for cache management
export const invalidateQueries = {
  // Invalidate all user-related queries
  user: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    queryClient.invalidateQueries({ queryKey: queryKeys.user.preferences });
    queryClient.invalidateQueries({ queryKey: queryKeys.user.orders });
  },
  
  // Invalidate all product-related queries
  products: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
  },
  
  // Invalidate specific product
  product: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
  },
  
  // Invalidate all order-related queries
  orders: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    queryClient.invalidateQueries({ queryKey: ['orders', 'list'] });
  },
  
  // Invalidate cart
  cart: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.items });
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.summary });
  },
};

// Optimistic update helpers
export const optimisticUpdates = {
  // Optimistic cart item update
  cartItem: {
    add: (newItem: any) => {
      queryClient.setQueryData(queryKeys.cart.items, (old: any) => {
        if (!old) return [newItem];
        return [...old, newItem];
      });
    },
    
    update: (productId: string, updates: any) => {
      queryClient.setQueryData(queryKeys.cart.items, (old: any) => {
        if (!old) return old;
        return old.map((item: any) =>
          item.productId === productId ? { ...item, ...updates } : item
        );
      });
    },
    
    remove: (productId: string) => {
      queryClient.setQueryData(queryKeys.cart.items, (old: any) => {
        if (!old) return old;
        return old.filter((item: any) => item.productId !== productId);
      });
    },
  },
  
  // Optimistic user profile update
  userProfile: (updates: any) => {
    queryClient.setQueryData(queryKeys.user.profile, (old: any) => {
      if (!old) return old;
      return { ...old, ...updates };
    });
  },
};

// Error handling
export const handleQueryError = (error: any) => {
  console.error('Query error:', error);
  
  // Handle specific error types
  if (error?.status === 401) {
    // Unauthorized - redirect to login
    window.location.href = '/login';
  } else if (error?.status === 403) {
    // Forbidden - show access denied message
    console.error('Access denied');
  } else if (error?.status >= 500) {
    // Server error - show generic error message
    console.error('Server error occurred');
  }
};

// Success handling
export const handleQuerySuccess = (data: any, queryKey: readonly unknown[]) => {
  // Log successful queries in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Query success:', queryKey, data);
  }
};
