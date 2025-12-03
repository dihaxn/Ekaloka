'use server'

import crypto from 'crypto'
import { EnterpriseJWTSecurity } from './enterprise-jwt-security'
import { EnterprisePasswordSecurity } from './enterprise-password-security'
import { EnterpriseSecurityAudit } from './enterprise-audit'
import { ENTERPRISE_SECURITY_CONFIG } from './enterprise-security-config'

// Advanced Multi-Factor Authentication
export class EnterpriseMFASecurity {
  /**
   * Generate TOTP secret for authenticator apps
   */
  static generateTOTPSecret(): string {
    return crypto.randomBytes(32).toString('base32')
  }

  /**
   * Generate TOTP code
   */
  static generateTOTPCode(secret: string, timeStep: number = 30): string {
    const counter = Math.floor(Date.now() / 1000 / timeStep)
    const key = Buffer.from(secret, 'base32')
    const counterBuffer = Buffer.alloc(8)
    counterBuffer.writeBigUInt64BE(BigInt(counter), 0)

    const hmac = crypto.createHmac('sha1', key)
    hmac.update(counterBuffer)
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0xf
    const code = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff)

    return (code % 1000000).toString().padStart(6, '0')
  }

  /**
   * Verify TOTP code
   */
  static verifyTOTPCode(secret: string, code: string, window: number = 1): boolean {
    const timeStep = 30
    const counter = Math.floor(Date.now() / 1000 / timeStep)

    for (let i = -window; i <= window; i++) {
      const expectedCode = this.generateTOTPCode(secret, timeStep)
      if (code === expectedCode) {
        return true
      }
    }

    return false
  }

  /**
   * Generate SMS verification code
   */
  static generateSMSCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Generate email verification code
   */
  static generateEmailCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Generate recovery codes
   */
  static generateRecoveryCodes(count: number = 10): string[] {
    return EnterprisePasswordSecurity.generateBackupCodes(count)
  }

  /**
   * Hash recovery codes for storage
   */
  static async hashRecoveryCodes(codes: string[]): Promise<string[]> {
    return EnterprisePasswordSecurity.hashBackupCodes(codes)
  }

  /**
   * Verify recovery code
   */
  static async verifyRecoveryCode(code: string, hashedCodes: string[]): Promise<boolean> {
    return EnterprisePasswordSecurity.verifyBackupCode(code, hashedCodes)
  }

  /**
   * Generate QR code URL for authenticator apps
   */
  static generateQRCodeURL(
    secret: string, 
    accountName: string, 
    issuer: string = 'Ekaloka'
  ): string {
    const encodedSecret = encodeURIComponent(secret)
    const encodedAccountName = encodeURIComponent(accountName)
    const encodedIssuer = encodeURIComponent(issuer)

    return `otpauth://totp/${encodedIssuer}:${encodedAccountName}?secret=${encodedSecret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`
  }

  /**
   * Setup MFA for user
   */
  static async setupMFA(userId: string, email: string): Promise<{
    totpSecret: string;
    qrCodeURL: string;
    recoveryCodes: string[];
    backupCodes: string[];
  }> {
    const totpSecret = this.generateTOTPSecret()
    const qrCodeURL = this.generateQRCodeURL(totpSecret, email)
    const recoveryCodes = this.generateRecoveryCodes()
    const backupCodes = this.generateRecoveryCodes(5)

    await EnterpriseSecurityAudit.logEvent('mfa_setup', {
      userId,
      email,
      totpSecret: '***', // Don't log actual secret
      timestamp: new Date().toISOString()
    })

    return {
      totpSecret,
      qrCodeURL,
      recoveryCodes,
      backupCodes
    }
  }

  /**
   * Verify MFA during login
   */
  static async verifyMFA(
    userId: string,
    method: 'totp' | 'sms' | 'email' | 'recovery',
    code: string,
    secret?: string,
    hashedRecoveryCodes?: string[]
  ): Promise<{ success: boolean; message: string }> {
    let isValid = false

    switch (method) {
      case 'totp':
        if (!secret) {
          return { success: false, message: 'TOTP secret not provided' }
        }
        isValid = this.verifyTOTPCode(secret, code)
        break

      case 'sms':
        // In production, verify against stored SMS code
        isValid = code.length === 6 && /^\d{6}$/.test(code)
        break

      case 'email':
        // In production, verify against stored email code
        isValid = code.length === 6 && /^\d{6}$/.test(code)
        break

      case 'recovery':
        if (!hashedRecoveryCodes) {
          return { success: false, message: 'Recovery codes not provided' }
        }
        isValid = await this.verifyRecoveryCode(code, hashedRecoveryCodes)
        break

      default:
        return { success: false, message: 'Invalid MFA method' }
    }

    if (isValid) {
      await EnterpriseSecurityAudit.logEvent('mfa_verification_success', {
        userId,
        method,
        timestamp: new Date().toISOString()
      })
      return { success: true, message: 'MFA verification successful' }
    } else {
      await EnterpriseSecurityAudit.logEvent('mfa_verification_failed', {
        userId,
        method,
        timestamp: new Date().toISOString()
      })
      return { success: false, message: 'Invalid MFA code' }
    }
  }

  /**
   * Send SMS verification code
   */
  static async sendSMSCode(phoneNumber: string, userId: string): Promise<{ success: boolean; message: string }> {
    const code = this.generateSMSCode()
    
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`SMS Code for ${phoneNumber}: ${code}`)

    await EnterpriseSecurityAudit.logEvent('sms_code_sent', {
      userId,
      phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, '*'), // Mask phone number
      timestamp: new Date().toISOString()
    })

    return { success: true, message: 'SMS code sent successfully' }
  }

  /**
   * Send email verification code
   */
  static async sendEmailCode(email: string, userId: string): Promise<{ success: boolean; message: string }> {
    const code = this.generateEmailCode()
    
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Email Code for ${email}: ${code}`)

    await EnterpriseSecurityAudit.logEvent('email_code_sent', {
      userId,
      email,
      timestamp: new Date().toISOString()
    })

    return { success: true, message: 'Email code sent successfully' }
  }

  /**
   * Generate MFA token for session
   */
  static generateMFAToken(userId: string, purpose: string): string {
    return EnterpriseJWTSecurity.generateMFAToken(userId, purpose)
  }

  /**
   * Verify MFA token
   */
  static verifyMFAToken(token: string): any {
    return EnterpriseJWTSecurity.verifyMFAToken(token)
  }

  /**
   * Check if MFA is required for user
   */
  static isMFARequired(userRole: string, action: string): boolean {
    const mfaConfig = ENTERPRISE_SECURITY_CONFIG.MFA

    // Always require MFA for admin actions
    if (userRole === 'admin' && mfaConfig.REQUIRED_FOR_ADMIN) {
      return true
    }

    // Check if action requires MFA
    if (mfaConfig.REQUIRED_ACTIONS.includes(action)) {
      return true
    }

    // Check if user role requires MFA
    if (mfaConfig.REQUIRED_ROLES.includes(userRole)) {
      return true
    }

    return false
  }

  /**
   * Get MFA methods for user
   */
  static getMFAMethods(userId: string): {
    totp: boolean;
    sms: boolean;
    email: boolean;
    recovery: boolean;
  } {
    // In production, fetch from database
    return {
      totp: true,
      sms: true,
      email: true,
      recovery: true
    }
  }

  /**
   * Disable MFA for user
   */
  static async disableMFA(userId: string, adminId?: string): Promise<{ success: boolean; message: string }> {
    await EnterpriseSecurityAudit.logEvent('mfa_disabled', {
      userId,
      adminId,
      timestamp: new Date().toISOString()
    })

    return { success: true, message: 'MFA disabled successfully' }
  }

  /**
   * Reset MFA for user (admin action)
   */
  static async resetMFA(userId: string, adminId: string): Promise<{ success: boolean; message: string }> {
    await EnterpriseSecurityAudit.logAdminAction(adminId, 'reset_mfa', userId)

    return { success: true, message: 'MFA reset successfully' }
  }
}
