import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = global.__prisma ?? new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') global.__prisma = prisma
