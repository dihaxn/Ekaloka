import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create sample users
  const passwordHash = await bcrypt.hash('password123', 10)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      uid: 'user_001',
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      role: 'user'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      uid: 'user_002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash,
      role: 'owner'
    }
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      uid: 'user_003',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      passwordHash,
      role: 'owner'
    }
  })

  // Create sample products
  try {
    const product1 = await prisma.product.create({
      data: {
        name: 'MacBook Pro',
        price: 1299.99,
        description: 'High-performance laptop for professionals'
      }
    })
    console.log('Created product:', product1.name)
  } catch (error) {
    console.log('Product MacBook Pro already exists or error occurred')
  }

  try {
    const product2 = await prisma.product.create({
      data: {
        name: 'iPhone 15',
        price: 799.99,
        description: 'Latest smartphone with advanced features'
      }
    })
    console.log('Created product:', product2.name)
  } catch (error) {
    console.log('Product iPhone 15 already exists or error occurred')
  }

  try {
    const product3 = await prisma.product.create({
      data: {
        name: 'AirPods Pro',
        price: 249.99,
        description: 'Wireless earbuds with noise cancellation'
      }
    })
    console.log('Created product:', product3.name)
  } catch (error) {
    console.log('Product AirPods Pro already exists or error occurred')
  }

  console.log('Seeding finished.')
  console.log('Created users:', { user1, user2, user3 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
