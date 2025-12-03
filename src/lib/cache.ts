import { Redis } from 'ioredis';
import { LRUCache } from 'lru-cache';

// Cache configuration
export interface CacheConfig {
  redis?: {
    host: string;
    port: number;
    password?: string;
    db?: number;
    url?: string;
  };
  memory?: {
    max: number;
    ttl: number;
  };
  defaultTTL: number;
}

// Cache types
export type CacheKey = string;
export type CacheValue = any;
export type CacheTTL = number;

// Cache interface
export interface ICache {
  get<T>(key: CacheKey): Promise<T | null>;
  set(key: CacheKey, value: CacheValue, ttl?: CacheTTL): Promise<void>;
  delete(key: CacheKey): Promise<void>;
  exists(key: CacheKey): Promise<boolean>;
  clear(): Promise<void>;
  getKeys(pattern: string): Promise<string[]>;
  increment(key: CacheKey, value?: number): Promise<number>;
  expire(key: CacheKey, ttl: number): Promise<void>;
}

// Memory cache implementation
class MemoryCache implements ICache {
  private cache: LRUCache<string, any>;

  constructor(config: CacheConfig['memory'] = { max: 1000, ttl: 60000 }) {
    this.cache = new LRUCache({
      max: config.max,
      ttl: config.ttl,
      updateAgeOnGet: true,
      allowStale: false,
    });
  }

  async get<T>(key: CacheKey): Promise<T | null> {
    return this.cache.get(key) || null;
  }

  async set(key: CacheKey, value: CacheValue, ttl?: CacheTTL): Promise<void> {
    this.cache.set(key, value, { ttl: ttl || 60000 });
  }

  async delete(key: CacheKey): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: CacheKey): Promise<boolean> {
    return this.cache.has(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async getKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    for (const key of this.cache.keys()) {
      if (this.matchesPattern(key, pattern)) {
        keys.push(key);
      }
    }
    return keys;
  }

  async increment(key: CacheKey, value: number = 1): Promise<number> {
    const current = await this.get<number>(key) || 0;
    const newValue = current + value;
    await this.set(key, newValue);
    return newValue;
  }

  async expire(key: CacheKey, ttl: number): Promise<void> {
    const value = await this.get(key);
    if (value !== null) {
      await this.set(key, value, ttl);
    }
  }

  private matchesPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }
}

// Redis cache implementation
class RedisCache implements ICache {
  private redis: Redis;

  constructor(config: CacheConfig['redis']) {
    if (config?.url) {
      this.redis = new Redis(config.url, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    } else {
      this.redis = new Redis({
        host: config?.host || 'localhost',
        port: config?.port || 6379,
        password: config?.password,
        db: config?.db || 0,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    }

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  async get<T>(key: CacheKey): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: CacheKey, value: CacheValue, ttl?: CacheTTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: CacheKey): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async exists(key: CacheKey): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  async getKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error('Redis getKeys error:', error);
      return [];
    }
  }

  async increment(key: CacheKey, value: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, value);
    } catch (error) {
      console.error('Redis increment error:', error);
      return 0;
    }
  }

  async expire(key: CacheKey, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      console.error('Redis expire error:', error);
    }
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}

// Cache factory
export class CacheFactory {
  private static instance: ICache;
  private static config: CacheConfig;

  static initialize(config: CacheConfig): void {
    this.config = config;
  }

  static getInstance(): ICache {
    if (!this.instance) {
      if (this.config?.redis) {
        this.instance = new RedisCache(this.config.redis);
      } else {
        this.instance = new MemoryCache(this.config?.memory);
      }
    }
    return this.instance;
  }

  static async reset(): Promise<void> {
    if (this.instance) {
      await this.instance.clear();
    }
  }
}

// Cache utilities
export class CacheUtils {
  private static cache = CacheFactory.getInstance();

  // User session cache
  static getUserSessionKey(userId: string): string {
    return `user:session:${userId}`;
  }

  static async getUserSession<T>(userId: string): Promise<T | null> {
    return this.cache.get<T>(this.getUserSessionKey(userId));
  }

  static async setUserSession(userId: string, session: any, ttl?: number): Promise<void> {
    await this.cache.set(this.getUserSessionKey(userId), session, ttl);
  }

  static async deleteUserSession(userId: string): Promise<void> {
    await this.cache.delete(this.getUserSessionKey(userId));
  }

  // API response cache
  static getApiResponseKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `api:response:${endpoint}:${paramString}`;
  }

  static async getApiResponse<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
    return this.cache.get<T>(this.getApiResponseKey(endpoint, params));
  }

  static async setApiResponse(endpoint: string, response: any, ttl?: number, params?: Record<string, any>): Promise<void> {
    await this.cache.set(this.getApiResponseKey(endpoint, params), response, ttl);
  }

  // Rate limiting cache
  static getRateLimitKey(identifier: string, action: string): string {
    return `rate:limit:${identifier}:${action}`;
  }

  static async getRateLimitCount(identifier: string, action: string): Promise<number> {
    const count = await this.cache.get<number>(this.getRateLimitKey(identifier, action));
    return count || 0;
  }

  static async incrementRateLimit(identifier: string, action: string, ttl?: number): Promise<number> {
    const key = this.getRateLimitKey(identifier, action);
    const newCount = await this.cache.increment(key, 1);
    if (ttl) {
      await this.cache.expire(key, ttl);
    }
    return newCount;
  }

  // CSRF token cache
  static getCsrfTokenKey(sessionId: string): string {
    return `csrf:token:${sessionId}`;
  }

  static async getCsrfToken(sessionId: string): Promise<string | null> {
    return this.cache.get<string>(this.getCsrfTokenKey(sessionId));
  }

  static async setCsrfToken(sessionId: string, token: string, ttl?: number): Promise<void> {
    await this.cache.set(this.getCsrfTokenKey(sessionId), token, ttl);
  }

  // Cache invalidation patterns
  static async invalidateUserData(userId: string): Promise<void> {
    const pattern = `user:*:${userId}`;
    const keys = await this.cache.getKeys(pattern);
    for (const key of keys) {
      await this.cache.delete(key);
    }
  }

  static async invalidateApiResponses(endpoint?: string): Promise<void> {
    const pattern = endpoint ? `api:response:${endpoint}:*` : 'api:response:*';
    const keys = await this.cache.getKeys(pattern);
    for (const key of keys) {
      await this.cache.delete(key);
    }
  }

  // Cache statistics
  static async getStats(): Promise<{
    totalKeys: number;
    memoryUsage?: number;
    hitRate?: number;
  }> {
    const keys = await this.cache.getKeys('*');
    return {
      totalKeys: keys.length,
    };
  }
}

// Cache decorator for API routes
export function withCache(ttl: number = 300000) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      await cache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

// Export default cache instance
export const cache = CacheFactory.getInstance();

// Initialize cache with default config
CacheFactory.initialize({
  defaultTTL: 300000, // 5 minutes
  memory: {
    max: 1000,
    ttl: 60000, // 1 minute
  },
});
