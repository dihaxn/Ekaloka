import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'

// Create Prisma client with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  console.log('Start seeding...')

  // Clean up existing data
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create users
  const owner = await prisma.user.create({
    data: {
      uid: 'owner-1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: hashedPassword,
      role: 'owner',
      phone: '+1 (555) 987-6543',
      address: '123 Fashion Street, Style City, SC 12345',
      avatar: '/images/profile-photos/profile_1756194641621.png',
      status: 'active',
    },
  })

  const user1 = await prisma.user.create({
    data: {
      uid: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: hashedPassword,
      role: 'user',
      phone: '+1 (555) 123-4567',
      address: '456 Main Street, User City, UC 67890',
      avatar: '/images/profile-photos/profile_1756194622298.jpg',
      status: 'active',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      uid: 'user-2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      passwordHash: hashedPassword,
      role: 'user',
      phone: '+1 (555) 321-9876',
      address: '789 User Avenue, Client Town, CT 54321',
      avatar: '/images/profile-photos/profile_1756195075738.jpg',
      status: 'active',
    },
  })

  // Create sample products
  const products = [
    {
      name: 'Premium Fashion Collection',
      price: 299.99,
      offerPrice: 249.99,
      description: 'High-quality fashion collection with premium materials and elegant design',
      category: 'Fashion',
      brand: 'Dai Fashion',
      sku: 'PFC-001',
      stock: 25,
      images: ['/images/fashion-collection.jpg', '/images/fashion-hero.jpg'],
      tags: ['premium', 'fashion', 'collection'],
      status: 'active',
      rating: 4.8,
      totalSales: 45,
    },
    {
      name: 'Designer Fashion Set',
      price: 459.99,
      offerPrice: 399.99,
      description: 'Elegant designer fashion set for special occasions and formal events',
      category: 'Fashion',
      brand: 'Dai Fashion',
      sku: 'DFS-002',
      stock: 12,
      images: ['/images/fashion-model.jpg', '/images/fashion-lifestyle.jpg'],
      tags: ['designer', 'elegant', 'formal'],
      status: 'active',
      rating: 4.9,
      totalSales: 32,
    },
    {
      name: 'Lifestyle Fashion Bundle',
      price: 199.99,
      offerPrice: 159.99,
      description: 'Comfortable lifestyle fashion for everyday wear and casual occasions',
      category: 'Accessories',
      brand: 'Dai Fashion',
      sku: 'LFB-003',
      stock: 8,
      images: ['/images/fashion-accessories.jpg'],
      tags: ['lifestyle', 'casual', 'comfortable'],
      status: 'active',
      rating: 4.6,
      totalSales: 28,
    },
    {
      name: 'Elegant Evening Wear',
      price: 599.99,
      offerPrice: 499.99,
      description: 'Sophisticated evening wear for formal events and special occasions',
      category: 'Fashion',
      brand: 'Dai Fashion',
      sku: 'EEW-004',
      stock: 0,
      images: ['/images/fashion-hero.jpg'],
      tags: ['evening', 'formal', 'sophisticated'],
      status: 'active',
      rating: 4.7,
      totalSales: 15,
    },
    {
      name: 'Casual Wear Collection',
      price: 149.99,
      offerPrice: 119.99,
      description: 'Relaxed casual wear for weekend activities and everyday comfort',
      category: 'Clothing',
      brand: 'Dai Fashion',
      sku: 'CWC-005',
      stock: 30,
      images: ['/images/fashion-collection.jpg'],
      tags: ['casual', 'weekend', 'comfortable'],
      status: 'active',
      rating: 4.5,
      totalSales: 24,
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    })
    createdProducts.push(product)
    console.log('Created product:', product.name)
  }

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-001',
      userId: user1.id,
      customerName: user1.name,
      customerEmail: user1.email,
      customerPhone: user1.phone || '',
      totalAmount: 249.99,
      status: 'delivered',
      shippingAddress: user1.address || '',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
    },
  })

  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: createdProducts[0].id,
      quantity: 1,
      price: 249.99,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-002',
      userId: user2.id,
      customerName: user2.name,
      customerEmail: user2.email,
      customerPhone: user2.phone || '',
      totalAmount: 957.98,
      status: 'processing',
      shippingAddress: user2.address || '',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
    },
  })

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order2.id,
        productId: createdProducts[1].id,
        quantity: 2,
        price: 399.99,
      },
      {
        orderId: order2.id,
        productId: createdProducts[2].id,
        quantity: 1,
        price: 159.99,
      },
    ],
  })

  console.log('Database has been seeded with sample data!')
  console.log('Users created:', { owner: owner.email, user1: user1.email, user2: user2.email })
  console.log('Products created:', createdProducts.length)
  console.log('Orders created: 2')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })