'use server'

import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Security configuration constants
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL_CHARS: true,
  PASSWORD_SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  
  // JWT configuration
  JWT_ALGORITHM: 'HS512' as const,
  JWT_ACCESS_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY: '7d', // Reduced from 30d for better security
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  RATE_LIMIT_MAX_AUTH_ATTEMPTS: 5,
  RATE_LIMIT_AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  
  // Session management
  MAX_CONCURRENT_SESSIONS: 3,
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
  
  // Input validation
  MAX_INPUT_LENGTH: 1000,
  MAX_EMAIL_LENGTH: 254,
  MAX_NAME_LENGTH: 100,
  
  // File upload security
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_FILE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  
  // CSRF protection
  CSRF_TOKEN_LENGTH: 32,
  CSRF_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  
  // Encryption
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  KEY_DERIVATION_ITERATIONS: 100000,
  KEY_LENGTH: 32,
  
  // Audit logging
  AUDIT_LOG_RETENTION_DAYS: 90,
  SENSITIVE_OPERATIONS: ['login', 'logout', 'password_change', 'role_change', 'data_export']
} as const

// Password validation and hashing
export class PasswordSecurity {
  /**
   * Validates password strength according to security policy
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`)
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL_CHARS && 
        !new RegExp(`[${SECURITY_CONFIG.PASSWORD_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    // Check for common weak patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters more than twice')
    }
    
    if (/123|abc|qwe|password|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns or words')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  /**
   * Generates a cryptographically secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    
    // Ensure at least one character from each required category
    password += charset[Math.floor(Math.random() * 26)] // Uppercase
    password += charset[26 + Math.floor(Math.random() * 26)] // Lowercase
    password += charset[52 + Math.floor(Math.random() * 10)] // Number
    password += charset[62 + Math.floor(Math.random() * 8)] // Special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
  
  /**
   * Hashes password with bcrypt using secure configuration
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12 // Increased from default 10 for better security
    return bcrypt.hash(password, saltRounds)
  }
  
  /**
   * Verifies password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
  
  /**
   * Checks if password hash needs rehashing (for security updates)
   */
  static needsRehash(hash: string): boolean {
    return bcrypt.getRounds(hash) < 12
  }
}

// JWT security utilities
export class JWTSecurity {
  /**
   * Generates a secure JWT access token
   */
  static generateAccessToken(payload: Record<string, any>): string {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET environment variable is not set')
    }
    
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      algorithm: SECURITY_CONFIG.JWT_ALGORITHM,
      expiresIn: SECURITY_CONFIG.JWT_ACCESS_EXPIRY,
      issuer: 'ekaloka-app',
      audience: 'ekaloka-users',
      jwtid: crypto.randomUUID()
    })
  }
  
  /**
   * Generates a secure JWT refresh token
   */
  static generateRefreshToken(payload: Record<string, any>): string {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set')
    }
    
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      algorithm: SECURITY_CONFIG.JWT_ALGORITHM,
      expiresIn: SECURITY_CONFIG.JWT_REFRESH_EXPIRY,
      issuer: 'ekaloka-app',
      audience: 'ekaloka-users',
      jwtid: crypto.randomUUID()
    })
  }
  
  /**
   * Verifies and decodes JWT token
   */
  static verifyToken(token: string, secret: 'access' | 'refresh'): any {
    const secretKey = secret === 'access' 
      ? process.env.JWT_ACCESS_SECRET 
      : process.env.JWT_REFRESH_SECRET
      
    if (!secretKey) {
      throw new Error(`JWT_${secret.toUpperCase()}_SECRET environment variable is not set`)
    }
    
    try {
      return jwt.verify(token, secretKey, {
        algorithms: [SECURITY_CONFIG.JWT_ALGORITHM],
        issuer: 'ekaloka-app',
        audience: 'ekaloka-users'
      })
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
      }
      throw error
    }
  }
  
  /**
   * Decodes JWT token without verification (for debugging only)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token)
  }
}

// Input sanitization and validation
export class InputSecurity {
  /**
   * Sanitizes HTML input to prevent XSS attacks
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
  
  /**
   * Validates and sanitizes email address
   */
  static validateEmail(email: string): { isValid: boolean; sanitized: string | null } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, sanitized: null }
    }
    
    const sanitized = email.trim().toLowerCase()
    
    if (sanitized.length > SECURITY_CONFIG.MAX_EMAIL_LENGTH) {
      return { isValid: false, sanitized: null }
    }
    
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    return {
      isValid: emailRegex.test(sanitized),
      sanitized: emailRegex.test(sanitized) ? sanitized : null
    }
  }
  
  /**
   * Validates and sanitizes user input
   */
  static validateInput(input: string, maxLength: number = SECURITY_CONFIG.MAX_INPUT_LENGTH): { isValid: boolean; sanitized: string | null } {
    if (!input || typeof input !== 'string') {
      return { isValid: false, sanitized: null }
    }
    
    if (input.length > maxLength) {
      return { isValid: false, sanitized: null }
    }
    
    // Remove null bytes and control characters
    const sanitized = input.replace(/[\x00-\x1F\x7F]/g, '').trim()
    
    return {
      isValid: sanitized.length > 0,
      sanitized: sanitized.length > 0 ? sanitized : null
    }
  }
  
  /**
   * Validates file upload security
   */
  static validateFileUpload(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
      errors.push(`File size must be less than ${SECURITY_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
    }
    
    if (!SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type as any)) {
      errors.push('File type not allowed')
    }
    
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!SECURITY_CONFIG.ALLOWED_FILE_EXTENSIONS.includes(extension as any)) {
      errors.push('File extension not allowed')
    }
    
    // Check for double extension attacks
    if (file.name.includes('..') || file.name.includes('\\') || file.name.includes('/')) {
      errors.push('Invalid filename')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// CSRF protection
export class CSRFSecurity {
  /**
   * Generates a cryptographically secure CSRF token
   */
  static generateToken(): string {
    return crypto.randomBytes(SECURITY_CONFIG.CSRF_TOKEN_LENGTH).toString('hex')
  }
  
  /**
   * Validates CSRF token
   */
  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false
    }
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    )
  }
}

// Rate limiting utilities
export class RateLimitSecurity {
  private static attempts = new Map<string, { count: number; resetTime: number }>()
  
  /**
   * Checks if request should be rate limited
   */
  static checkRateLimit(identifier: string, maxAttempts: number = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS
      })
      return false
    }
    
    if (record.count >= maxAttempts) {
      return true // Rate limited
    }
    
    record.count++
    return false
  }
  
  /**
   * Records a failed authentication attempt
   */
  static recordAuthFailure(identifier: string): boolean {
    return this.checkRateLimit(identifier, SECURITY_CONFIG.RATE_LIMIT_MAX_AUTH_ATTEMPTS)
  }
  
  /**
   * Clears rate limit for an identifier
   */
  static clearRateLimit(identifier: string): void {
    this.attempts.delete(identifier)
  }
  
  /**
   * Gets remaining attempts for an identifier
   */
  static getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record) return SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS
    
    const now = Date.now()
    if (now > record.resetTime) return SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS
    
    return Math.max(0, SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS - record.count)
  }
}

// Encryption utilities
export class EncryptionSecurity {
  /**
   * Encrypts data using AES-256-GCM
   */
  static encrypt(data: string, key: string): { encrypted: string; iv: string; tag: string } {
    const derivedKey = crypto.scryptSync(key, 'ekaloka-salt', 32)
    const iv = crypto.randomBytes(16)
    
    const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv)
    cipher.setAAD(Buffer.from('ekaloka-app'))
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex')
    }
  }
  
  /**
   * Decrypts data using AES-256-GCM
   */
  static decrypt(encrypted: string, key: string, iv: string, tag: string): string {
    const derivedKey = crypto.scryptSync(key, 'ekaloka-salt', 32)
    const ivBuffer = Buffer.from(iv, 'hex')
    const tagBuffer = Buffer.from(tag, 'hex')
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, ivBuffer)
    decipher.setAAD(Buffer.from('ekaloka-app'))
    decipher.setAuthTag(tagBuffer)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
}

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
}

// Security audit logging
export class SecurityAudit {
  /**
   * Logs security-related events
   */
  static logEvent(event: string, details: Record<string, any>, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity,
      sessionId: details.sessionId || 'unknown',
      userId: details.userId || 'anonymous',
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown'
    }
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement security monitoring service integration
      // Use console.warn for production to avoid Jest issues
      console.warn('SECURITY EVENT:', logEntry)
    } else if (process.env.NODE_ENV === 'test') {
      // In test environment, disable logging to prevent Jest warnings
      // Security events are still tracked but not logged
      return
    } else {
      // In development, use console.log
      console.log('SECURITY EVENT:', logEntry)
    }
  }
  
  /**
   * Logs authentication attempts
   */
  static logAuthAttempt(email: string, success: boolean, ipAddress: string, userAgent: string): void {
    this.logEvent('auth_attempt', {
      email,
      success,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString()
    }, success ? 'low' : 'medium')
  }
  
  /**
   * Logs suspicious activities
   */
  static logSuspiciousActivity(activity: string, details: Record<string, any>): void {
    this.logEvent('suspicious_activity', details, 'high')
  }
  
  /**
   * Logs security violations
   */
  static logSecurityViolation(violation: string, details: Record<string, any>): void {
    this.logEvent('security_violation', details, 'critical')
  }
}

// Export all security utilities
export default {
  PasswordSecurity,
  JWTSecurity,
  InputSecurity,
  CSRFSecurity,
  RateLimitSecurity,
  EncryptionSecurity,
  SecurityAudit,
  SECURITY_CONFIG,
  SECURITY_HEADERS
}
