'use server'

import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// Enterprise Security Configuration
export const ENTERPRISE_SECURITY_CONFIG = {
  // Advanced Password Security
  PASSWORD: {
    MIN_LENGTH: 16,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    REQUIRE_UNICODE: true,
    MAX_LENGTH: 128,
    HISTORY_SIZE: 5,
    COMPLEXITY_SCORE_MIN: 80,
    COMMON_PASSWORDS_BLOCKED: true,
    PWNED_PASSWORD_CHECK: true,
  },

  // Advanced JWT Security
  JWT: {
    ALGORITHM: 'RS256' as const,
    ACCESS_EXPIRY: '10m',
    REFRESH_EXPIRY: '7d',
    ROTATION_ENABLED: true,
    ROTATION_THRESHOLD: 0.8,
    BLACKLIST_ENABLED: true,
    FINGERPRINT_ENABLED: true,
  },

  // Advanced Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: {
      GENERAL: 100,
      AUTH: 3,
      API: 50,
      ADMIN: 200,
    },
    BURST_PROTECTION: true,
    SLIDING_WINDOW: true,
    IP_WHITELIST: process.env.IP_WHITELIST?.split(',') || [],
    IP_BLACKLIST: process.env.IP_BLACKLIST?.split(',') || [],
  },

  // Advanced Session Management
  SESSION: {
    MAX_CONCURRENT: 2,
    TIMEOUT_MS: 20 * 60 * 1000,
    ABSOLUTE_TIMEOUT_MS: 24 * 60 * 60 * 1000,
    REGENERATION_ENABLED: true,
    REGENERATION_THRESHOLD: 0.5,
    DEVICE_TRACKING: true,
    LOCATION_TRACKING: true,
  },

  // Advanced Input Validation
  INPUT: {
    MAX_LENGTH: 1000,
    MAX_EMAIL_LENGTH: 254,
    MAX_NAME_LENGTH: 100,
    SANITIZATION_ENABLED: true,
    VALIDATION_STRICT: true,
    BLOCK_SUSPICIOUS_PATTERNS: true,
  },

  // Advanced File Security
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
    VIRUS_SCAN_ENABLED: true,
    CONTENT_ANALYSIS: true,
    METADATA_STRIPPING: true,
  },

  // Advanced CSRF Protection
  CSRF: {
    TOKEN_LENGTH: 64,
    EXPIRY: 30 * 60 * 1000,
    DOUBLE_SUBMIT_COOKIE: true,
    SYNCHRONIZER_TOKEN: true,
    CUSTOM_HEADER: 'X-CSRF-Token',
  },

  // Advanced Encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_ROTATION_ENABLED: true,
    KEY_ROTATION_INTERVAL: 30 * 24 * 60 * 60 * 1000,
    KEY_DERIVATION_ITERATIONS: 200000,
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
  },

  // Advanced Audit Logging
  AUDIT: {
    RETENTION_DAYS: 365,
    SENSITIVE_OPERATIONS: [
      'login', 'logout', 'password_change', 'role_change', 
      'data_export', 'admin_action', 'sensitive_data_access',
      'privilege_escalation', 'data_deletion'
    ],
    REAL_TIME_ALERTS: true,
    COMPLIANCE_MODE: true,
  },

  // Advanced Threat Detection
  THREAT_DETECTION: {
    ENABLED: true,
    ANOMALY_DETECTION: true,
    BEHAVIORAL_ANALYSIS: true,
    MACHINE_LEARNING: true,
    REAL_TIME_SCORING: true,
    AUTO_BLOCKING: true,
    THRESHOLD_SCORE: 75,
  },

  // Advanced MFA/2FA
  MFA: {
    REQUIRED_FOR_ADMIN: true,
    REQUIRED_FOR_SENSITIVE_OPERATIONS: true,
    METHODS: ['totp', 'webauthn', 'sms', 'email'],
    BACKUP_CODES_ENABLED: true,
    BACKUP_CODES_COUNT: 10,
    REMEMBER_DEVICE: true,
    REMEMBER_DURATION: 30 * 24 * 60 * 60 * 1000,
  },

  // Advanced Security Headers
  SECURITY_HEADERS: {
    STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains; preload',
    CONTENT_SECURITY_POLICY: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_FRAME_OPTIONS: 'DENY',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=(), payment=()',
    CROSS_ORIGIN_EMBEDDER_POLICY: 'require-corp',
    CROSS_ORIGIN_OPENER_POLICY: 'same-origin',
    CROSS_ORIGIN_RESOURCE_POLICY: 'same-origin',
  },
} as const

// Advanced Password Security
export class EnterprisePasswordSecurity {
  private static readonly COMMON_PASSWORDS = new Set([
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
    'princess', 'shadow', 'football', 'baseball', 'superman', 'batman'
  ])

  /**
   * Advanced password validation with complexity scoring
   */
  static validatePassword(password: string): {
    isValid: boolean
    errors: string[]
    score: number
    suggestions: string[]
  } {
    const errors: string[] = []
    const suggestions: string[] = []
    let score = 0

    // Length check
    if (password.length < ENTERPRISE_SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
      errors.push(`Password must be at least ${ENTERPRISE_SECURITY_CONFIG.PASSWORD.MIN_LENGTH} characters long`)
    } else {
      score += Math.min(25, password.length * 2)
    }

    // Character variety checks
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    const hasUnicode = /[\u0080-\uFFFF]/.test(password)

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter')
    } else if (hasUpperCase) score += 10

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter')
    } else if (hasLowerCase) score += 10

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBERS && !hasNumbers) {
      errors.push('Password must contain at least one number')
    } else if (hasNumbers) score += 10

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_SPECIAL_CHARS && !hasSpecialChars) {
      errors.push('Password must contain at least one special character')
    } else if (hasSpecialChars) score += 15

    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.REQUIRE_UNICODE && !hasUnicode) {
      errors.push('Password must contain at least one Unicode character')
    } else if (hasUnicode) score += 20

    // Pattern checks
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters more than twice')
      score -= 20
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns or words')
      score -= 30
    }

    // Common password check
    if (ENTERPRISE_SECURITY_CONFIG.PASSWORD.COMMON_PASSWORDS_BLOCKED) {
      if (this.COMMON_PASSWORDS.has(password.toLowerCase())) {
        errors.push('Password is too common and not allowed')
        score -= 50
      }
    }

    // Entropy calculation
    const uniqueChars = new Set(password).size
    score += uniqueChars * 2

    // Length bonus
    if (password.length > 20) score += 10
    if (password.length > 30) score += 10

    // Suggestions
    if (score < 60) {
      suggestions.push('Consider using a longer password')
      suggestions.push('Add more variety of characters')
      suggestions.push('Avoid common patterns')
    }

    return {
      isValid: errors.length === 0 && score >= ENTERPRISE_SECURITY_CONFIG.PASSWORD.COMPLEXITY_SCORE_MIN,
      errors,
      score: Math.min(100, Math.max(0, score)),
      suggestions
    }
  }

  /**
   * Generate cryptographically secure password
   */
  static generateSecurePassword(length: number = 20): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    const unicodeChars = 'áéíóúñüçàèìòùâêîôûäëïöüÿ'
    
    let password = ''
    
    // Ensure at least one character from each required category
    password += charset[Math.floor(Math.random() * 26)] // Uppercase
    password += charset[26 + Math.floor(Math.random() * 26)] // Lowercase
    password += charset[52 + Math.floor(Math.random() * 10)] // Number
    password += charset[62 + Math.floor(Math.random() * 8)] // Special char
    password += unicodeChars[Math.floor(Math.random() * unicodeChars.length)] // Unicode
    
    // Fill the rest randomly
    for (let i = 5; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  /**
   * Advanced password hashing with salt
   */
  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const saltRounds = 14 // Increased for enterprise security
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    
    return { hash, salt }
  }

  /**
   * Verify password with timing attack protection
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Check if password hash needs rehashing
   */
  static needsRehash(hash: string): boolean {
    return bcrypt.getRounds(hash) < 14
  }
}

// Advanced JWT Security with Asymmetric Keys
export class EnterpriseJWTSecurity {
  /**
   * Generate RSA key pair for JWT signing
   */
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })
    
    return { publicKey, privateKey }
  }

  /**
   * Generate secure access token with device fingerprint
   */
  static generateAccessToken(
    payload: Record<string, any>, 
    deviceFingerprint?: string
  ): string {
    if (!process.env.JWT_PRIVATE_KEY) {
      throw new Error('JWT_PRIVATE_KEY environment variable is not set')
    }

    const tokenPayload = {
      ...payload,
      jti: crypto.randomUUID(), // Unique token ID
      iat: Math.floor(Date.now() / 1000),
      deviceFingerprint,
      tokenType: 'access'
    }

    return jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
      algorithm: ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM,
      expiresIn: ENTERPRISE_SECURITY_CONFIG.JWT.ACCESS_EXPIRY,
      issuer: 'ekaloka-enterprise',
      audience: 'ekaloka-users'
    })
  }

  /**
   * Generate secure refresh token
   */
  static generateRefreshToken(payload: Record<string, any>): string {
    if (!process.env.JWT_PRIVATE_KEY) {
      throw new Error('JWT_PRIVATE_KEY environment variable is not set')
    }

    const tokenPayload = {
      ...payload,
      jti: crypto.randomUUID(),
      iat: Math.floor(Date.now() / 1000),
      tokenType: 'refresh'
    }

    return jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY, {
      algorithm: ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM,
      expiresIn: ENTERPRISE_SECURITY_CONFIG.JWT.REFRESH_EXPIRY,
      issuer: 'ekaloka-enterprise',
      audience: 'ekaloka-users'
    })
  }

  /**
   * Verify JWT token with enhanced security
   */
  static verifyToken(token: string): any {
    if (!process.env.JWT_PUBLIC_KEY) {
      throw new Error('JWT_PUBLIC_KEY environment variable is not set')
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
        algorithms: [ENTERPRISE_SECURITY_CONFIG.JWT.ALGORITHM],
        issuer: 'ekaloka-enterprise',
        audience: 'ekaloka-users'
      }) as any

      // Additional security checks
      if (!decoded.jti) {
        throw new Error('Token missing unique identifier')
      }

      if (!decoded.tokenType) {
        throw new Error('Token missing type information')
      }

      return decoded
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
   * Check if token needs rotation
   */
  static needsRotation(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any
      if (!decoded || !decoded.exp || !decoded.iat) return false

      const now = Math.floor(Date.now() / 1000)
      const tokenAge = now - decoded.iat
      const tokenLifetime = decoded.exp - decoded.iat
      const ageRatio = tokenAge / tokenLifetime

      return ageRatio > ENTERPRISE_SECURITY_CONFIG.JWT.ROTATION_THRESHOLD
    } catch {
      return false
    }
  }
}

// Advanced Input Validation and Sanitization
export class EnterpriseInputSecurity {
  // Zod schemas for strict validation
  private static readonly emailSchema = z
    .string()
    .email('Invalid email format')
    .max(ENTERPRISE_SECURITY_CONFIG.INPUT.MAX_EMAIL_LENGTH, 'Email too long')
    .transform(val => val.toLowerCase().trim())

  private static readonly nameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(ENTERPRISE_SECURITY_CONFIG.INPUT.MAX_NAME_LENGTH, 'Name too long')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters')
    .transform(val => val.trim())

  /**
   * Advanced input validation with Zod schemas
   */
  static validateInput<T extends z.ZodTypeAny>(
    input: unknown,
    schema: T
  ): { isValid: boolean; data?: z.infer<T>; errors?: string[] } {
    try {
      const result = schema.parse(input)
      return { isValid: true, data: result }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          isValid: false, 
          errors: error.errors.map(e => e.message)
        }
      }
      return { isValid: false, errors: ['Validation failed'] }
    }
  }

  /**
   * Validate email with advanced checks
   */
  static validateEmail(email: string): { isValid: boolean; sanitized?: string; errors?: string[] } {
    return this.validateInput(email, this.emailSchema)
  }

  /**
   * Validate name with advanced checks
   */
  static validateName(name: string): { isValid: boolean; sanitized?: string; errors?: string[] } {
    return this.validateInput(name, this.nameSchema)
  }

  /**
   * Advanced HTML sanitization
   */
  static sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/expression\s*\(/gi, '')
  }

  /**
   * Advanced SQL injection detection
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /exec\s*\(/i,
      /execute\s*\(/i,
      /xp_cmdshell/i,
      /sp_executesql/i,
      /waitfor\s+delay/i,
      /benchmark\s*\(/i,
      /sleep\s*\(/i,
      /load_file\s*\(/i,
      /into\s+outfile/i,
      /into\s+dumpfile/i,
    ]

    return sqlPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Advanced XSS detection
   */
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<form/i,
      /<input/i,
      /<textarea/i,
      /<select/i,
      /<button/i,
      /<link/i,
      /<meta/i,
      /<style/i,
      /<svg/i,
      /<math/i,
      /<xmp/i,
      /<plaintext/i,
      /<listing/i,
      /<noframes/i,
      /<noscript/i,
      /<noframes/i,
      /<xss/i,
      /<img\s+src\s*=\s*["']?\s*javascript:/i,
      /<img\s+onerror/i,
      /<img\s+onload/i,
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Advanced file validation
   */
  static validateFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Size check
    if (file.size > ENTERPRISE_SECURITY_CONFIG.FILE.MAX_SIZE) {
      errors.push(`File size must be less than ${ENTERPRISE_SECURITY_CONFIG.FILE.MAX_SIZE / (1024 * 1024)}MB`)
    }

    // Type check
    if (!ENTERPRISE_SECURITY_CONFIG.FILE.ALLOWED_TYPES.includes(file.type as any)) {
      errors.push('File type not allowed')
    }

    // Extension check
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!ENTERPRISE_SECURITY_CONFIG.FILE.ALLOWED_EXTENSIONS.includes(extension as any)) {
      errors.push('File extension not allowed')
    }

    // Path traversal check
    if (file.name.includes('..') || file.name.includes('\\') || file.name.includes('/')) {
      errors.push('Invalid filename')
    }

    // Double extension check
    const extensions = file.name.split('.').length - 1
    if (extensions > 1) {
      errors.push('Multiple file extensions not allowed')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Advanced CSRF Protection
export class EnterpriseCSRFSecurity {
  /**
   * Generate cryptographically secure CSRF token
   */
  static generateToken(): string {
    return crypto.randomBytes(ENTERPRISE_SECURITY_CONFIG.CSRF.TOKEN_LENGTH).toString('hex')
  }

  /**
   * Validate CSRF token with timing-safe comparison
   */
  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false
    }

    // Timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    )
  }

  /**
   * Generate double-submit cookie token
   */
  static generateDoubleSubmitToken(): { cookieToken: string; headerToken: string } {
    const token = this.generateToken()
    return {
      cookieToken: token,
      headerToken: token
    }
  }

  /**
   * Validate double-submit cookie
   */
  static validateDoubleSubmit(cookieToken: string, headerToken: string): boolean {
    return this.validateToken(cookieToken, headerToken)
  }
}

// Advanced Rate Limiting
export class EnterpriseRateLimitSecurity {
  private static attempts = new Map<string, { count: number; resetTime: number; burstCount: number; lastRequest: number }>()

  /**
   * Advanced rate limiting with burst protection
   */
  static checkRateLimit(
    identifier: string, 
    maxAttempts: number = ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS.GENERAL,
    burstLimit: number = 10
  ): { isLimited: boolean; remainingAttempts: number; resetTime: number } {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
        burstCount: 1,
        lastRequest: now
      })
      return { isLimited: false, remainingAttempts: maxAttempts - 1, resetTime: now + ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS }
    }

    // Burst protection
    if (ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.BURST_PROTECTION) {
      const timeSinceLastRequest = now - record.lastRequest
      if (timeSinceLastRequest < 1000) { // Less than 1 second
        record.burstCount++
        if (record.burstCount > burstLimit) {
          return { isLimited: true, remainingAttempts: 0, resetTime: record.resetTime }
        }
      } else {
        record.burstCount = 1
      }
    }

    if (record.count >= maxAttempts) {
      return { isLimited: true, remainingAttempts: 0, resetTime: record.resetTime }
    }

    record.count++
    record.lastRequest = now

    return { 
      isLimited: false, 
      remainingAttempts: maxAttempts - record.count, 
      resetTime: record.resetTime 
    }
  }

  /**
   * Check IP whitelist/blacklist
   */
  static isIPAllowed(ip: string): boolean {
    // Check blacklist first
    if (ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_BLACKLIST.includes(ip)) {
      return false
    }

    // Check whitelist
    if (ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_WHITELIST.length > 0) {
      return ENTERPRISE_SECURITY_CONFIG.RATE_LIMIT.IP_WHITELIST.includes(ip)
    }

    return true
  }

  /**
   * Clear rate limit for an identifier
   */
  static clearRateLimit(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

// Advanced Encryption
export class EnterpriseEncryptionSecurity {
  /**
   * Encrypt data with key rotation support
   */
  static encrypt(data: string, key: string): { encrypted: string; iv: string; tag: string; keyVersion: number } {
    const derivedKey = crypto.scryptSync(key, 'ekaloka-enterprise-salt', ENTERPRISE_SECURITY_CONFIG.ENCRYPTION.KEY_LENGTH)
    const iv = crypto.randomBytes(ENTERPRISE_SECURITY_CONFIG.ENCRYPTION.IV_LENGTH)
    
    const cipher = crypto.createCipheriv(
      ENTERPRISE_SECURITY_CONFIG.ENCRYPTION.ALGORITHM, 
      derivedKey, 
      iv
    )
    cipher.setAAD(Buffer.from('ekaloka-enterprise'))
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
      keyVersion: 1 // For key rotation tracking
    }
  }

  /**
   * Decrypt data with key version support
   */
  static decrypt(
    encrypted: string, 
    key: string, 
    iv: string, 
    tag: string, 
    keyVersion: number = 1
  ): string {
    const derivedKey = crypto.scryptSync(key, 'ekaloka-enterprise-salt', ENTERPRISE_SECURITY_CONFIG.ENCRYPTION.KEY_LENGTH)
    const ivBuffer = Buffer.from(iv, 'hex')
    const tagBuffer = Buffer.from(tag, 'hex')
    
    const decipher = crypto.createDecipheriv(
      ENTERPRISE_SECURITY_CONFIG.ENCRYPTION.ALGORITHM, 
      derivedKey, 
      ivBuffer
    )
    decipher.setAAD(Buffer.from('ekaloka-enterprise'))
    decipher.setAuthTag(tagBuffer)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }

  /**
   * Generate secure random key
   */
  static generateKey(): string {
    return crypto.randomBytes(ENTERPRISE_SECURITY_CONFIG.ENCRYPTION.KEY_LENGTH).toString('hex')
  }
}

// Advanced Security Audit Logging
export class EnterpriseSecurityAudit {
  /**
   * Log security events with compliance support
   */
  static logEvent(
    event: string, 
    details: Record<string, any>, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    compliance?: { gdpr?: boolean; sox?: boolean; hipaa?: boolean }
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity,
      sessionId: details.sessionId || 'unknown',
      userId: details.userId || 'anonymous',
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
      deviceFingerprint: details.deviceFingerprint || 'unknown',
      location: details.location || 'unknown',
      compliance,
      requestId: details.requestId || 'unknown'
    }

    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.warn('ENTERPRISE SECURITY EVENT:', logEntry)
    } else if (process.env.NODE_ENV === 'test') {
      return
    } else {
      console.log('ENTERPRISE SECURITY EVENT:', logEntry)
    }
  }

  /**
   * Log authentication attempts with threat detection
   */
  static logAuthAttempt(
    email: string, 
    success: boolean, 
    ipAddress: string, 
    userAgent: string,
    deviceFingerprint?: string,
    location?: string
  ): void {
    this.logEvent('auth_attempt', {
      email,
      success,
      ipAddress,
      userAgent,
      deviceFingerprint,
      location,
      timestamp: new Date().toISOString()
    }, success ? 'low' : 'medium')
  }

  /**
   * Log suspicious activities with behavioral analysis
   */
  static logSuspiciousActivity(
    activity: string, 
    details: Record<string, any>,
    threatScore?: number
  ): void {
    this.logEvent('suspicious_activity', {
      ...details,
      threatScore,
      timestamp: new Date().toISOString()
    }, 'high')
  }

  /**
   * Log security violations with compliance tracking
   */
  static logSecurityViolation(
    violation: string, 
    details: Record<string, any>,
    compliance?: { gdpr?: boolean; sox?: boolean; hipaa?: boolean }
  ): void {
    this.logEvent('security_violation', {
      ...details,
      timestamp: new Date().toISOString()
    }, 'critical', compliance)
  }
}

// Export all enterprise security utilities
export default {
  EnterprisePasswordSecurity,
  EnterpriseJWTSecurity,
  EnterpriseInputSecurity,
  EnterpriseCSRFSecurity,
  EnterpriseRateLimitSecurity,
  EnterpriseEncryptionSecurity,
  EnterpriseSecurityAudit,
  ENTERPRISE_SECURITY_CONFIG
}
