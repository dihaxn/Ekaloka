// Enterprise Security Module Index
// This file exports all enterprise security modules for easy importing

// Configuration
export { ENTERPRISE_SECURITY_CONFIG } from './enterprise-security-config'
export type {
  SecurityConfig,
  PasswordConfig,
  JWTConfig,
  RateLimitConfig,
  InputConfig,
  FileConfig,
  MFAConfig,
  SessionConfig,
  CSRFConfig,
  AuditConfig,
  ThreatDetectionConfig,
  EncryptionConfig,
  BackupConfig,
  MonitoringConfig,
  ComplianceConfig,
  APIConfig,
  DatabaseConfig,
  NetworkConfig,
  DevelopmentConfig,
} from './enterprise-security-config'

// Core Security Modules
export { EnterprisePasswordSecurity } from './enterprise-password-security'
export { EnterpriseJWTSecurity } from './enterprise-jwt-security'
export { EnterpriseInputSecurity } from './enterprise-input-security'
export { EnterpriseRateLimitSecurity } from './enterprise-rate-limit'
export { EnterpriseSecurityAudit } from './enterprise-audit'
export { EnterpriseMFASecurity } from './enterprise-mfa'

// Middleware
export { EnterpriseSecurityMiddleware } from '../middleware/enterprise-security'

// Utility Functions
export const EnterpriseSecurityUtils = {
  /**
   * Generate cryptographically secure random string
   */
  generateSecureRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const randomArray = new Uint8Array(length)
    crypto.getRandomValues(randomArray)
    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomArray[i] % chars.length)
    }
    return result
  },

  /**
   * Generate secure UUID v4
   */
  generateSecureUUID(): string {
    return crypto.randomUUID()
  },

  /**
   * Hash data with SHA-256
   */
  async hashSHA256(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  },

  /**
   * Encrypt data with AES-GCM
   */
  async encryptAESGCM(data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    )
    const encryptedArray = new Uint8Array(encryptedBuffer)
    return {
      encrypted: Array.from(encryptedArray).map(b => b.toString(16).padStart(2, '0')).join(''),
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')
    }
  },

  /**
   * Decrypt data with AES-GCM
   */
  async decryptAESGCM(encrypted: string, iv: string, key: CryptoKey): Promise<string> {
    const encryptedArray = new Uint8Array(encrypted.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
    const ivArray = new Uint8Array(iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      key,
      encryptedArray
    )
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  },

  /**
   * Generate CryptoKey from password
   */
  async generateKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  },

  /**
   * Sanitize HTML content
   */
  sanitizeHTML(html: string): string {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },

  /**
   * Check if string contains suspicious patterns
   */
  containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /document\.cookie/i,
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
      /<xss/i,
    ]
    return suspiciousPatterns.some(pattern => pattern.test(input))
  },

  /**
   * Generate secure password with specified requirements
   */
  generateSecurePassword(options: {
    length?: number
    includeUppercase?: boolean
    includeLowercase?: boolean
    includeNumbers?: boolean
    includeSymbols?: boolean
    excludeSimilar?: boolean
  } = {}): string {
    const {
      length = 16,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = true
    } = options

    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }

    let password = ''
    const randomArray = new Uint8Array(length)
    crypto.getRandomValues(randomArray)
    for (let i = 0; i < length; i++) {
      password += charset.charAt(randomArray[i] % charset.length)
    }

    return password
  },

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password: string): {
    score: number
    feedback: string[]
    suggestions: string[]
  } {
    let score = 0
    const feedback: string[] = []
    const suggestions: string[] = []

    // Length
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1

    // Character variety
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    // Complexity
    const uniqueChars = new Set(password).size
    if (uniqueChars >= password.length * 0.7) score += 1

    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 1
      feedback.push('Avoid repeated characters')
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      score -= 2
      feedback.push('Avoid common patterns')
    }

    // Suggestions
    if (score < 3) {
      suggestions.push('Use at least 8 characters')
      suggestions.push('Include uppercase and lowercase letters')
      suggestions.push('Include numbers and symbols')
    }
    if (score < 5) {
      suggestions.push('Avoid common words and patterns')
      suggestions.push('Use unique characters')
    }

    return {
      score: Math.max(0, Math.min(10, score)),
      feedback,
      suggestions
    }
  }
}

// Export default security manager
export const EnterpriseSecurity = {
  config: ENTERPRISE_SECURITY_CONFIG,
  password: EnterprisePasswordSecurity,
  jwt: EnterpriseJWTSecurity,
  input: EnterpriseInputSecurity,
  rateLimit: EnterpriseRateLimitSecurity,
  audit: EnterpriseSecurityAudit,
  mfa: EnterpriseMFASecurity,
  middleware: EnterpriseSecurityMiddleware,
  utils: EnterpriseSecurityUtils,
}

export default EnterpriseSecurity
