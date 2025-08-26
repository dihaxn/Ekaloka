import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../server/db/prisma'
import { 
  AuthenticationError, 
  NotFoundError, 
  DatabaseError,
  ValidationError 
} from '../types/errors'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: {
    id: string
    uid: string
    name: string
    email: string
    role: string
  }
  accessToken?: string
  error?: string
}

export interface RefreshResult {
  success: boolean
  accessToken?: string
  error?: string
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        throw new ValidationError('Email and password are required')
      }

      // Check if required environment variables are set
      if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET environment variable is not set')
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      })

      if (!user) {
        throw new AuthenticationError('Invalid credentials')
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash)
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials')
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      )

      return {
        success: true,
        user: {
          id: user.id,
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken
      }
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof AuthenticationError || error instanceof ValidationError) {
        throw error
      }

      // Handle database errors
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
        throw new DatabaseError('Database operation failed during login')
      }

      // Handle bcrypt errors
      if (error instanceof Error && error.name === 'Error' && error.message.includes('bcrypt')) {
        throw new AuthenticationError('Password verification failed')
      }

      // Re-throw other errors
      throw error
    }
  }

  static async refresh(refreshToken: string): Promise<RefreshResult> {
    try {
      // Check if required environment variables are set
      if (!process.env.JWT_REFRESH_SECRET || !process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT environment variables are not set')
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as any
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      })

      if (!user) {
        throw new NotFoundError('User not found')
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      )

      return {
        success: true,
        accessToken: newAccessToken
      }
    } catch (error) {
      // Handle JWT errors
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid refresh token')
      }
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Refresh token expired')
      }

      // Re-throw AppError instances
      if (error instanceof NotFoundError || error instanceof AuthenticationError) {
        throw error
      }

      // Handle database errors
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
        throw new DatabaseError('Database operation failed during token refresh')
      }

      // Re-throw other errors
      throw error
    }
  }

  static async getUserById(userId: string) {
    try {
      if (!userId) {
        throw new ValidationError('User ID is required')
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          uid: true,
          name: true,
          email: true,
          role: true
        }
      })

      if (!user) {
        throw new NotFoundError('User not found')
      }

      return user
    } catch (error) {
      // Re-throw AppError instances
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error
      }

      // Handle database errors
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
        throw new DatabaseError('Database operation failed while fetching user')
      }

      // Re-throw other errors
      throw error
    }
  }
}
