'use server';

import { z } from 'zod';

import { ENTERPRISE_SECURITY_CONFIG } from './enterprise-security-config';

// Advanced Input Validation and Sanitization
export class EnterpriseInputSecurity {
  // Zod schemas for strict validation
  private static readonly emailSchema = z
    .string()
    .email('Invalid email format')
    .max(ENTERPRISE_SECURITY_CONFIG.INPUT.MAX_EMAIL_LENGTH, 'Email too long')
    .transform(val => val.toLowerCase().trim());

  private static readonly nameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(ENTERPRISE_SECURITY_CONFIG.INPUT.MAX_NAME_LENGTH, 'Name too long')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters')
    .transform(val => val.trim());

  private static readonly passwordSchema = z
    .string()
    .min(ENTERPRISE_SECURITY_CONFIG.PASSWORD.MIN_LENGTH, 'Password too short')
    .max(ENTERPRISE_SECURITY_CONFIG.PASSWORD.MAX_LENGTH, 'Password too long');

  /**
   * Advanced input validation with Zod schemas
   */
  static validateInput<T extends z.ZodTypeAny>(
    input: unknown,
    schema: T
  ): { isValid: boolean; data?: z.infer<T>; errors?: string[] } {
    try {
      const result = schema.parse(input);
      return { isValid: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(e => e.message),
        };
      }
      return { isValid: false, errors: ['Validation failed'] };
    }
  }

  /**
   * Validate email with advanced checks
   */
  static validateEmail(email: string): {
    isValid: boolean;
    sanitized?: string;
    errors?: string[];
  } {
    return this.validateInput(email, this.emailSchema);
  }

  /**
   * Validate name with advanced checks
   */
  static validateName(name: string): {
    isValid: boolean;
    sanitized?: string;
    errors?: string[];
  } {
    return this.validateInput(name, this.nameSchema);
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
      .replace(/expression\s*\(/gi, '');
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
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
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
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Advanced file validation
   */
  static validateFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Size check
    if (file.size > ENTERPRISE_SECURITY_CONFIG.FILE.MAX_SIZE) {
      errors.push(
        `File size must be less than ${ENTERPRISE_SECURITY_CONFIG.FILE.MAX_SIZE / (1024 * 1024)}MB`
      );
    }

    // Type check
    if (
      !ENTERPRISE_SECURITY_CONFIG.FILE.ALLOWED_TYPES.includes(file.type as any)
    ) {
      errors.push('File type not allowed');
    }

    // Extension check
    const extension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase();
    if (
      !ENTERPRISE_SECURITY_CONFIG.FILE.ALLOWED_EXTENSIONS.includes(
        extension as any
      )
    ) {
      errors.push('File extension not allowed');
    }

    // Path traversal check
    if (
      file.name.includes('..') ||
      file.name.includes('\\') ||
      file.name.includes('/')
    ) {
      errors.push('Invalid filename');
    }

    // Double extension check
    const extensions = file.name.split('.').length - 1;
    if (extensions > 1) {
      errors.push('Multiple file extensions not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
