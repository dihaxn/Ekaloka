// User types
export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  name: string;
  price: number;
  description?: string;
}

export interface ProductUpdate {
  name?: string;
  price?: number;
  description?: string;
}

// API response types
export interface ApiResponse<T = any> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  user: User;
  accessToken: string;
}

// Filter types
export interface ProductFilters extends PaginationParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea';
  required?: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// UI types
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputSize = 'sm' | 'md' | 'lg';

// Theme types
export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Success types
export interface SuccessMessage {
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
}
