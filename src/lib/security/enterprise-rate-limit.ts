'use server';

import { ENTERPRISE_SECURITY_CONFIG } from './enterprise-security-config';

// Advanced Rate Limiting
export class EnterpriseRateLimitSecurity {
  private static attempts = new Map<
    string,
    {
      count: number;
      resetTime: number;
      burstCount: number;
      lastRequest: number;
      blockedUntil?: number;
    }
  >();

  /**
   * Advanced rate limiting with burst protection
   */
  static checkRateLimit(
    identifier: string,
    maxAttempts: number = ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS
      .GENERAL,
    burstLimit: number = 50
  ): {
    isLimited: boolean;
    remainingAttempts: number;
    resetTime: number;
    blockedUntil?: number;
  } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    // Check if currently blocked
    if (record?.blockedUntil && now < record.blockedUntil) {
      return {
        isLimited: true,
        remainingAttempts: 0,
        resetTime: record.blockedUntil,
        blockedUntil: record.blockedUntil,
      };
    }

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
        burstCount: 1,
        lastRequest: now,
      });
      return {
        isLimited: false,
        remainingAttempts: maxAttempts - 1,
        resetTime: now + ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
      };
    }

    // Burst protection
    if (ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.BURST_PROTECTION) {
      const timeSinceLastRequest = now - record.lastRequest;
      if (timeSinceLastRequest < 1000) {
        // Less than 1 second
        record.burstCount++;
        if (record.burstCount > burstLimit) {
          // Block for 5 minutes on burst violation
          record.blockedUntil = now + 5 * 60 * 1000;
          return {
            isLimited: true,
            remainingAttempts: 0,
            resetTime: record.blockedUntil,
            blockedUntil: record.blockedUntil,
          };
        }
      } else {
        record.burstCount = 1;
      }
    }

    if (record.count >= maxAttempts) {
      // Progressive blocking: longer blocks for repeated violations
      const blockDuration = Math.min(30 * 60 * 1000, record.count * 60 * 1000); // Max 30 minutes
      record.blockedUntil = now + blockDuration;
      return {
        isLimited: true,
        remainingAttempts: 0,
        resetTime: record.blockedUntil,
        blockedUntil: record.blockedUntil,
      };
    }

    record.count++;
    record.lastRequest = now;

    return {
      isLimited: false,
      remainingAttempts: maxAttempts - record.count,
      resetTime: record.resetTime,
    };
  }

  /**
   * Check IP whitelist/blacklist
   */
  static isIPAllowed(ip: string): boolean {
    // Check blacklist first
    if (ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_BLACKLIST.includes(ip)) {
      return false;
    }

    // Check whitelist
    if (ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_WHITELIST.length > 0) {
      return ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_WHITELIST.includes(ip);
    }

    return true;
  }

  /**
   * Clear rate limit for an identifier
   */
  static clearRateLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Get rate limit status for an identifier
   */
  static getRateLimitStatus(identifier: string): {
    count: number;
    remainingAttempts: number;
    resetTime: number;
    isBlocked: boolean;
    blockedUntil?: number;
  } {
    const record = this.attempts.get(identifier);
    const now = Date.now();

    if (!record) {
      return {
        count: 0,
        remainingAttempts:
          ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.GENERAL,
        resetTime: now + ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
        isBlocked: false,
      };
    }

    const isBlocked = record.blockedUntil ? now < record.blockedUntil : false;
    const remainingAttempts = isBlocked
      ? 0
      : Math.max(
          0,
          ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.GENERAL -
            record.count
        );

    return {
      count: record.count,
      remainingAttempts,
      resetTime: record.resetTime,
      isBlocked,
      blockedUntil: record.blockedUntil,
    };
  }

  /**
   * Add IP to blacklist
   */
  static addToBlacklist(ip: string): void {
    if (!ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_BLACKLIST.includes(ip)) {
      ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_BLACKLIST.push(ip);
    }
  }

  /**
   * Remove IP from blacklist
   */
  static removeFromBlacklist(ip: string): void {
    const index =
      ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_BLACKLIST.indexOf(ip);
    if (index > -1) {
      ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_BLACKLIST.splice(index, 1);
    }
  }

  /**
   * Get all rate limit records (for monitoring)
   */
  static getAllRecords(): Array<{
    identifier: string;
    count: number;
    resetTime: number;
    lastRequest: number;
    isBlocked: boolean;
    blockedUntil?: number;
  }> {
    const now = Date.now();
    return Array.from(this.attempts.entries()).map(([identifier, record]) => ({
      identifier,
      count: record.count,
      resetTime: record.resetTime,
      lastRequest: record.lastRequest,
      isBlocked: record.blockedUntil ? now < record.blockedUntil : false,
      blockedUntil: record.blockedUntil,
    }));
  }

  /**
   * Clean up expired records
   */
  static cleanup(): void {
    const now = Date.now();
    for (const [identifier, record] of this.attempts.entries()) {
      if (
        now > record.resetTime &&
        (!record.blockedUntil || now > record.blockedUntil)
      ) {
        this.attempts.delete(identifier);
      }
    }
  }
}
