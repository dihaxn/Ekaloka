'use server';

import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import { ENTERPRISE_SECURITY_CONFIG } from './enterprise-security-config';

// Advanced JWT Security with Asymmetric Keys
export class EnterpriseJWTSecurity {
  /**
   * Generate RSA key pair for JWT signing
   */
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    return { publicKey, privateKey };
  }

  /**
   * Generate secure access token with device fingerprint
   */
  static generateAccessToken(
    payload: Record<string, any>,
    deviceFingerprint?: string
  ): string {
    if (!process.env.JWT_PRIVATE_KEY) {
      throw new Error('JWT_PRIVATE_KEY environment variable is not set');
    }

    const tokenPayload = {
      ...payload,
      jti: crypto.randomUUID(), // Unique token ID
      iat: Math.floor(Date.now() / 1000),
      deviceFingerprint,
      tokenType: 'access',
    };

    return jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
      algorithm: ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM,
      expiresIn: ENTERPRISE_SECURITY_CONFIG.JWT.ACCESS_EXPIRY,
      issuer: 'ekaloka-enterprise',
      audience: 'ekaloka-users',
    });
  }

  /**
   * Generate secure refresh token
   */
  static generateRefreshToken(payload: Record<string, any>): string {
    if (!process.env.JWT_PRIVATE_KEY) {
      throw new Error('JWT_PRIVATE_KEY environment variable is not set');
    }

    const tokenPayload = {
      ...payload,
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      tokenType: 'refresh',
    };

    return jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
      algorithm: ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM,
      expiresIn: ENTERPRISE_SECURITY_CONFIG.JWT.REFRESH_EXPIRY,
      issuer: 'ekaloka-enterprise',
      audience: 'ekaloka-users',
    });
  }

  /**
   * Verify JWT token with enhanced security
   */
  static verifyToken(token: string): any {
    if (!process.env.JWT_PUBLIC_KEY) {
      throw new Error('JWT_PUBLIC_KEY environment variable is not set');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
        algorithms: [ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM],
        issuer: 'ekaloka-enterprise',
        audience: 'ekaloka-users',
      }) as any;

      // Additional security checks
      if (!decoded.jti) {
        throw new Error('Token missing unique identifier');
      }

      if (!decoded.tokenType) {
        throw new Error('Token missing type information');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Check if token needs rotation
   */
  static needsRotation(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp || !decoded.iat) return false;

      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - decoded.iat;
      const tokenLifetime = decoded.exp - decoded.iat;
      const ageRatio = tokenAge / tokenLifetime;

      return ageRatio > ENTERPRISE_SECURITY_CONFIG.JWT.ROTATION_THRESHOLD;
    } catch {
      return false;
    }
  }

  /**
   * Generate device fingerprint
   */
  static generateDeviceFingerprint(
    userAgent: string,
    ipAddress: string
  ): string {
    const fingerprint = `${userAgent}|${ipAddress}|${Date.now()}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex');
  }

  /**
   * Validate device fingerprint
   */
  static validateDeviceFingerprint(
    storedFingerprint: string,
    currentFingerprint: string
  ): boolean {
    return storedFingerprint === currentFingerprint;
  }

  /**
   * Blacklist token (for logout/revocation)
   */
  static async blacklistToken(token: string, expiry: number): Promise<void> {
    // In production, store in Redis or database
    const blacklistKey = `blacklist:${token}`;
    // await redis.setex(blacklistKey, expiry, '1')
  }

  /**
   * Check if token is blacklisted
   */
  static async isTokenBlacklisted(token: string): Promise<boolean> {
    // In production, check Redis or database
    const blacklistKey = `blacklist:${token}`;
    // return await redis.exists(blacklistKey) === 1
    return false;
  }

  /**
   * Generate MFA token
   */
  static generateMFAToken(userId: string, purpose: string): string {
    const payload = {
      userId,
      purpose,
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      tokenType: 'mfa',
    };

    return jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, {
      algorithm: ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM,
      expiresIn: '5m', // Short-lived MFA tokens
      issuer: 'ekaloka-enterprise',
      audience: 'ekaloka-users',
    });
  }

  /**
   * Verify MFA token
   */
  static verifyMFAToken(token: string): any {
    try {
      const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
        algorithms: [ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM],
        issuer: 'ekaloka-enterprise',
        audience: 'ekaloka-users',
      }) as any;

      if (decoded.tokenType !== 'mfa') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('MFA token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid MFA token');
      }
      throw error;
    }
  }
}
