import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { handleApiError } from '@/lib/errorHandler'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: corsHeaders
  })
}

// Helper function to verify and get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization required')
  }

  const token = authHeader.substring(7)
  const jwtSecret = process.env.JWT_ACCESS_SECRET || 'your-secret-key'
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as any
    return decoded
  } catch (err) {
    throw new Error('Invalid token')
  }
}

// GET /api/cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            offerPrice: true,
            images: true,
            category: true,
            stock: true,
            status: true,
          }
        }
      }
    })

    const response = NextResponse.json({ 
      success: true, 
      data: { cartItems } 
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error fetching cart:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch cart'
    return NextResponse.json(
      { success: false, message },
      { status: message.includes('Authorization') ? 401 : 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/cart (Add item to cart)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, status: true }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    if (product.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Product is not available' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: 'Insufficient stock' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId: productId
        }
      }
    })

    let cartItem
    if (existingCartItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              offerPrice: true,
              images: true,
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.userId,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              offerPrice: true,
              images: true,
            }
          }
        }
      })
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Item added to cart',
      data: { cartItem }
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error adding to cart:', error)
    const message = error instanceof Error ? error.message : 'Failed to add to cart'
    return NextResponse.json(
      { success: false, message },
      { status: message.includes('Authorization') ? 401 : 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/cart (Update cart item quantity)
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    const body = await request.json()
    const { cartItemId, quantity } = body

    if (!cartItemId || quantity < 0) {
      return NextResponse.json(
        { success: false, message: 'Cart item ID and valid quantity are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (quantity === 0) {
      // Remove item from cart
      await prisma.cartItem.delete({
        where: { 
          id: cartItemId,
          userId: user.userId // Ensure user owns this cart item
        }
      })

      const response = NextResponse.json({ 
        success: true, 
        message: 'Item removed from cart'
      })
      
      // Set CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    } else {
      // Update quantity
      const cartItem = await prisma.cartItem.update({
        where: { 
          id: cartItemId,
          userId: user.userId // Ensure user owns this cart item
        },
        data: { quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              offerPrice: true,
              images: true,
            }
          }
        }
      })

      const response = NextResponse.json({ 
        success: true, 
        message: 'Cart updated',
        data: { cartItem }
      })
      
      // Set CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    }
  } catch (error) {
    console.error('Error updating cart:', error)
    const message = error instanceof Error ? error.message : 'Failed to update cart'
    return NextResponse.json(
      { success: false, message },
      { status: message.includes('Authorization') ? 401 : 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/cart (Clear cart or remove specific item)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')

    if (cartItemId) {
      // Remove specific item
      await prisma.cartItem.delete({
        where: { 
          id: cartItemId,
          userId: user.userId // Ensure user owns this cart item
        }
      })
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId: user.userId }
      })
    }

    const response = NextResponse.json({ 
      success: true, 
      message: cartItemId ? 'Item removed from cart' : 'Cart cleared'
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error deleting from cart:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete from cart'
    return NextResponse.json(
      { success: false, message },
      { status: message.includes('Authorization') ? 401 : 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}