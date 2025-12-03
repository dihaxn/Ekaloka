import { z } from 'zod';

// Base validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email too long')
  .transform(val => val.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username too long')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  )
  .transform(val => val.toLowerCase().trim());

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

export const urlSchema = z.string().url('Invalid URL format').optional();

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
  csrfToken: z.string().optional(),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    username: usernameSchema,
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name too long'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name too long'),
    phone: phoneSchema,
    acceptTerms: z
      .boolean()
      .refine(val => val === true, 'You must accept the terms and conditions'),
    csrfToken: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  csrfToken: z.string().optional(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    csrfToken: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const mfaSchema = z.object({
  code: z
    .string()
    .length(6, 'MFA code must be 6 digits')
    .regex(/^\d{6}$/, 'MFA code must contain only numbers'),
  type: z.enum(['otp', 'totp', 'sms']),
  csrfToken: z.string().optional(),
});

// User profile schemas
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long'),
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio too long').optional(),
  website: urlSchema,
  location: z.string().max(100, 'Location too long').optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  csrfToken: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
    csrfToken: z.string().optional(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  });

// Product schemas
export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(200, 'Product name too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  price: z
    .number()
    .positive('Price must be positive')
    .max(999999.99, 'Price too high'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required').max(100, 'Brand too long'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Too many images'),
  tags: z.array(z.string()).max(20, 'Too many tags'),
  isActive: z.boolean().default(true),
  weight: z.number().positive('Weight must be positive').optional(),
  dimensions: z
    .object({
      length: z.number().positive('Length must be positive'),
      width: z.number().positive('Width must be positive'),
      height: z.number().positive('Height must be positive'),
    })
    .optional(),
});

export const productUpdateSchema = productSchema.partial();

// Order schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
});

export const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: phoneSchema,
  }),
  billingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  paymentMethod: z.enum(['credit_card', 'paypal', 'stripe']),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Review schemas
export const reviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  title: z
    .string()
    .min(1, 'Review title is required')
    .max(100, 'Title too long'),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review too long'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .max(5, 'Too many images')
    .optional(),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query too long'),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().positive('Minimum price must be positive').optional(),
  maxPrice: z.number().positive('Maximum price must be positive').optional(),
  rating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['price', 'name', 'rating', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit too high')
    .optional()
    .default(20),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit too high')
    .optional()
    .default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z
    .number()
    .optional()
    .default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z
    .array(z.string())
    .optional()
    .default(['image/jpeg', 'image/png', 'image/webp']),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    })
    .optional(),
});

// Validation helper functions
export class ValidationUtils {
  // Validate and sanitize input
  static async validateAndSanitize<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): Promise<
    { success: true; data: T } | { success: false; errors: string[] }
  > {
    try {
      const validatedData = await schema.parseAsync(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }

  // Validate partial data (for updates)
  static async validatePartial<T extends z.AnyZodObject>(
    schema: T,
    data: unknown
  ): Promise<
    { success: true; data: z.infer<T> } | { success: false; errors: string[] }
  > {
    try {
      const validatedData = await schema.partial().parseAsync(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }

  // Sanitize HTML content
  static sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // Validate file upload
  static validateFile(
    file: File,
    maxSize: number = 5 * 1024 * 1024,
    allowedTypes: string[] = ['image/jpeg', 'image/png']
  ): string | null {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    return null;
  }

  // Generate validation error response
  static createValidationErrorResponse(errors: string[]): {
    success: false;
    message: string;
    errors: string[];
  } {
    return {
      success: false,
      message: 'Validation failed',
      errors,
    };
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain at least one lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain at least one uppercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password must contain at least one number');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Password must contain at least one special character');

    return {
      isValid: score >= 4,
      score,
      feedback,
    };
  }

  // Validate phone number
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Validate URL
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }

  // Validate and sanitize search query
  static sanitizeSearchQuery(query: string): string {
    return query
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .substring(0, 100); // Limit length
  }
}
