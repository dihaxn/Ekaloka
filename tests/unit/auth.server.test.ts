import { AuthService } from '../../src/services/auth.server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Mock Prisma client
jest.mock('../../src/server/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}))

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}))

import { prisma } from '../../src/server/db/prisma'

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_ACCESS_SECRET = 'test-access-secret'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
  })

  describe('login', () => {
    it('should return success with user data and access token for valid credentials', async () => {
      const mockUser = {
        id: 'user-1',
        uid: 'uid-1',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        role: 'user'
      }

      const mockAccessToken = 'mock-access-token'

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(jwt.sign as jest.Mock).mockReturnValue(mockAccessToken)

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result.success).toBe(true)
      expect(result.user).toEqual({
        id: mockUser.id,
        uid: mockUser.uid,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      })
      expect(result.accessToken).toBe(mockAccessToken)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password')
    })

    it('should throw AuthenticationError for non-existent user', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(AuthService.login({
        email: 'nonexistent@example.com',
        password: 'password123'
      })).rejects.toThrow('Invalid credentials')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' }
      })
    })

    it('should throw AuthenticationError for invalid password', async () => {
      const mockUser = {
        id: 'user-1',
        uid: 'uid-1',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        role: 'user'
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(AuthService.login({
        email: 'test@example.com',
        password: 'wrong-password'
      })).rejects.toThrow('Invalid credentials')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
    })

    it('should throw DatabaseError for database errors', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'))

      await expect(AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      })).rejects.toThrow('Database error')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      })
    })
  })

  describe('getUserById', () => {
    it('should return user data for valid user ID', async () => {
      const mockUser = {
        id: 'user-1',
        uid: 'uid-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const result = await AuthService.getUserById('user-1')

      expect(result).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          uid: true,
          name: true,
          email: true,
          role: true
        }
      })
    })

    it('should throw NotFoundError for non-existent user ID', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(AuthService.getUserById('nonexistent-id')).rejects.toThrow('User not found')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
        select: {
          id: true,
          uid: true,
          name: true,
          email: true,
          role: true
        }
      })
    })
  })
})
