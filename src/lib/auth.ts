import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { cache } from './cache';
import { CacheUtils } from './cache';

// JWT configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const JWT_ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Session configuration
const SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

// User session interface
export interface UserSession {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  mfaEnabled: boolean;
  lastLogin: Date;
  ipAddress: string;
  userAgent: string;
}

// Authentication response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserSession;
  accessToken?: string;
  refreshToken?: string;
  requiresMfa?: boolean;
  mfaData?: {
    type: string;
    methods: string[];
    challenge?: any;
  };
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  mfaVerified: boolean;
  sessionId: string;
  type?: string; // For refresh tokens
  iat: number;
  exp: number;
}

// Authentication utilities class
export class AuthUtils {
  // Generate JWT token
  static async generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .sign(JWT_SECRET);
  }

  // Generate refresh token
  static async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    return await new SignJWT({ userId, sessionId, type: 'refresh' })
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .sign(JWT_SECRET);
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  // Create user session
  static async createSession(userData: {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
    mfaEnabled: boolean;
    ipAddress: string;
    userAgent: string;
  }): Promise<{ session: UserSession; accessToken: string; refreshToken: string }> {
    const sessionId = this.generateSessionId();
    const session: UserSession = {
      ...userData,
      lastLogin: new Date(),
    };

    // Store session in cache
    await CacheUtils.setUserSession(userData.userId, session, SESSION_EXPIRY);

    // Generate tokens
    const accessToken = await this.generateToken({
      userId: userData.userId,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions,
      mfaVerified: !userData.mfaEnabled,
      sessionId,
    });

    const refreshToken = await this.generateRefreshToken(userData.userId, sessionId);

    return { session, accessToken, refreshToken };
  }

  // Get user session from request
  static async getSessionFromRequest(request: NextRequest): Promise<UserSession | null> {
    try {
      const token = this.extractTokenFromRequest(request);
      if (!token) return null;

      const payload = await this.verifyToken(token);
      if (!payload) return null;

      // Check if session exists in cache
      const session = await CacheUtils.getUserSession<UserSession>(payload.userId);
      if (!session) return null;

      // Verify session ID matches
      if (session.lastLogin.getTime() !== payload.iat * 1000) {
        return null; // Session was renewed
      }

      return session;
    } catch (error) {
      console.error('Error getting session from request:', error);
      return null;
    }
  }

  // Extract token from request
  static extractTokenFromRequest(request: NextRequest): string | null {
    // Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check cookies
    const tokenCookie = request.cookies.get('access_token');
    if (tokenCookie) {
      return tokenCookie.value;
    }

    return null;
  }

  // Set authentication cookies
  static setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false
  ): NextResponse {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    // Access token cookie (short-lived)
    response.cookies.set('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    // Refresh token cookie (long-lived)
    response.cookies.set('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days or 7 days
    });

    return response;
  }

  // Clear authentication cookies
  static clearAuthCookies(response: NextResponse): NextResponse {
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  // Refresh access token
  static async refreshAccessToken(refreshToken: string): Promise<{
    success: boolean;
    accessToken?: string;
    error?: string;
  }> {
    try {
      const payload = await this.verifyToken(refreshToken);
      if (!payload || payload.type !== 'refresh') {
        return { success: false, error: 'Invalid refresh token' };
      }

      // Get user session
      const session = await CacheUtils.getUserSession<UserSession>(payload.userId);
      if (!session) {
        return { success: false, error: 'Session expired' };
      }

      // Generate new access token
      const newAccessToken = await this.generateToken({
        userId: session.userId,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
        mfaVerified: !session.mfaEnabled,
        sessionId: payload.sessionId,
      });

      return { success: true, accessToken: newAccessToken };
    } catch (error) {
      console.error('Token refresh failed:', error);
      return { success: false, error: 'Token refresh failed' };
    }
  }

  // Invalidate user session
  static async invalidateSession(userId: string): Promise<void> {
    await CacheUtils.deleteUserSession(userId);
  }

  // Check if user has permission
  static hasPermission(user: UserSession, permission: string): boolean {
    return user.permissions.includes(permission) || user.role === 'admin';
  }

  // Check if user has role
  static hasRole(user: UserSession, role: string): boolean {
    return user.role === role || user.role === 'admin';
  }

  // Generate session ID
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Rate limiting for authentication attempts
  static async checkAuthRateLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const maxAttempts = 5;
    const windowMs = 15 * 60 * 1000; // 15 minutes

    const currentCount = await CacheUtils.getRateLimitCount(identifier, 'auth');
    const resetTime = Date.now() + windowMs;

    if (currentCount >= maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    await CacheUtils.incrementRateLimit(identifier, 'auth', 15 * 60); // 15 minutes TTL

    return {
      allowed: true,
      remaining: maxAttempts - currentCount - 1,
      resetTime,
    };
  }

  // Log authentication event
  static async logAuthEvent(event: {
    type: 'login' | 'logout' | 'login_failed' | 'mfa_required' | 'mfa_verified';
    userId?: string;
    email?: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    details?: any;
  }): Promise<void> {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: event.userId ? this.generateSessionId() : undefined,
    };

    // Store in cache for audit purposes
    const logKey = `auth:log:${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    await cache.set(logKey, logEntry, 24 * 60 * 60); // 24 hours

    // You can also send to external logging service here
    console.log('Auth event:', logEntry);
  }
}

// Authentication middleware helper
export class AuthMiddleware {
  // Require authentication
  static requireAuth(handler: (request: NextRequest, user: UserSession) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
      const user = await AuthUtils.getSessionFromRequest(request);
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      return handler(request, user);
    };
  }

  // Require specific permission
  static requirePermission(permission: string) {
    return (handler: (request: NextRequest, user: UserSession) => Promise<NextResponse>) => {
      return async (request: NextRequest): Promise<NextResponse> => {
        const user = await AuthUtils.getSessionFromRequest(request);
        
        if (!user) {
          return NextResponse.json(
            { success: false, message: 'Authentication required' },
            { status: 401 }
          );
        }

        if (!AuthUtils.hasPermission(user, permission)) {
          return NextResponse.json(
            { success: false, message: 'Insufficient permissions' },
            { status: 403 }
          );
        }

        return handler(request, user);
      };
    };
  }

  // Require specific role
  static requireRole(role: string) {
    return (handler: (request: NextRequest, user: UserSession) => Promise<NextResponse>) => {
      return async (request: NextRequest): Promise<NextResponse> => {
        const user = await AuthUtils.getSessionFromRequest(request);
        
        if (!user) {
          return NextResponse.json(
            { success: false, message: 'Authentication required' },
            { status: 401 }
          );
        }

        if (!AuthUtils.hasRole(user, role)) {
          return NextResponse.json(
            { success: false, message: 'Insufficient role' },
            { status: 403 }
          );
        }

        return handler(request, user);
      };
    };
  }
}
