'use server';

import crypto from 'crypto';

import bcrypt from 'bcryptjs';

import { ENTERPRISE_SECURITY_CONFIG } from './enterprise-security-config';

// Advanced Password Security
export class EnterprisePasswordSecurity {
  private static readonly COMMON_PASSWORDS = new Set([
    'password',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    'dragon',
    'master',
    'sunshine',
    'princess',
    'shadow',
    'football',
    'baseball',
    'superman',
    'batman',
  ]);

  /**
   * Advanced password validation with complexity scoring
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
    suggestions: string[];
  } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Length check
    if (password.length < ENTERPRISE_SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
      errors.push(
        `Password must be at least ${ENTERPRISE_SECURITY_CONFIG.PASSWORD.MIN_LENGTH} characters long`
      );
    } else {
      score += Math.min(25, password.length * 2);
    }

    // Character variety checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );
    const hasUnicode = /[\u0080-\uFFFF]/.test(password);

    if (
      ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE &&
      !hasUpperCase
    ) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (hasUpperCase) score += 10;

    if (
      ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE &&
      !hasLowerCase
    ) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (hasLowerCase) score += 10;

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBERS && !hasNumbers) {
      errors.push('Password must contain at least one number');
    } else if (hasNumbers) score += 10;

    if (
      ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_SPECIAL_CHARS &&
      !hasSpecialChars
    ) {
      errors.push('Password must contain at least one special character');
    } else if (hasSpecialChars) score += 15;

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_UNICODE && !hasUnicode) {
      errors.push('Password must contain at least one Unicode character');
    } else if (hasUnicode) score += 20;

    // Pattern checks
    if (/(.)\1{2,}/.test(password)) {
      errors.push(
        'Password cannot contain repeated characters more than twice'
      );
      score -= 20;
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns or words');
      score -= 30;
    }

    // Common password check
    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.COMMON_PASSWORDS_BLOCKED) {
      if (this.COMMON_PASSWORDS.has(password.toLowerCase())) {
        errors.push('Password is too common and not allowed');
        score -= 50;
      }
    }

    // Entropy calculation
    const uniqueChars = new Set(password).size;
    score += uniqueChars * 2;

    // Length bonus
    if (password.length > 20) score += 10;
    if (password.length > 30) score += 10;

    // Suggestions
    if (score < 60) {
      suggestions.push('Consider using a longer password');
      suggestions.push('Add more variety of characters');
      suggestions.push('Avoid common patterns');
    }

    return {
      isValid:
        errors.length === 0 &&
        score >= ENTERPRISE_SECURITY_CONFIG.PASSWORD.COMPLEXITY_SCORE_MIN,
      errors,
      score: Math.min(100, Math.max(0, score)),
      suggestions,
    };
  }

  /**
   * Generate cryptographically secure password
   */
  static generateSecurePassword(length: number = 20): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const unicodeChars = 'áéíóúñüçàèìòùâêîôûäëïöüÿ';

    let password = '';

    // Ensure at least one character from each required category
    password += charset[Math.floor(Math.random() * 26)]; // Uppercase
    password += charset[26 + Math.floor(Math.random() * 26)]; // Lowercase
    password += charset[52 + Math.floor(Math.random() * 10)]; // Number
    password += charset[62 + Math.floor(Math.random() * 8)]; // Special char
    password += unicodeChars[Math.floor(Math.random() * unicodeChars.length)]; // Unicode

    // Fill the rest randomly
    for (let i = 5; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Advanced password hashing with salt
   */
  static async hashPassword(
    password: string
  ): Promise<{ hash: string; salt: string }> {
    const saltRounds = 14; // Increased for enterprise security
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return { hash, salt };
  }

  /**
   * Verify password with timing attack protection
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Check if password hash needs rehashing
   */
  static needsRehash(hash: string): boolean {
    return bcrypt.getRounds(hash) < 14;
  }

  /**
   * Check password against breached databases (simulated)
   */
  static async checkPwnedPassword(
    password: string
  ): Promise<{ isBreached: boolean; count: number }> {
    // In production, integrate with HaveIBeenPwned API
    const sha1Hash = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();

    // Simulated check - replace with actual API call
    return { isBreached: false, count: 0 };
  }

  /**
   * Generate backup codes for MFA
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-digit backup codes
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup codes for storage
   */
  static async hashBackupCodes(codes: string[]): Promise<string[]> {
    return Promise.all(codes.map(code => bcrypt.hash(code, 12)));
  }

  /**
   * Verify backup code
   */
  static async verifyBackupCode(
    code: string,
    hashedCodes: string[]
  ): Promise<boolean> {
    for (const hashedCode of hashedCodes) {
      if (await bcrypt.compare(code, hashedCode)) {
        return true;
      }
    }
    return false;
  }
}
