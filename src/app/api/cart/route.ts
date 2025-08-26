import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/server/db/prisma'

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

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.substring(7)

    // Check if user is admin (admin users can't access cart)
    if (token.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Cart access not available for admin users' },
        { status: 403, headers: corsHeaders }
      )
    }

    // In a real app, you'd fetch cart from database
    // For now, return empty cart
    const response = NextResponse.json({
      success: true,
      cart: {
        items: [],
        total: 0,
        itemCount: 0
      }
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error getting cart:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get cart' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.substring(7)

    // Check if user is admin
    if (token.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Cart access not available for admin users' },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // In a real app, you'd add item to cart in database
    const response = NextResponse.json({
      success: true,
      message: 'Item added to cart successfully'
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add item to cart' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.substring(7)

    // Check if user is admin
    if (token.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Cart access not available for admin users' },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: 'Product ID and quantity are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // In a real app, you'd update cart item in database
    const response = NextResponse.json({
      success: true,
      message: 'Cart updated successfully'
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update cart' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.substring(7)

    // Check if user is admin
    if (token.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Cart access not available for admin users' },
        { status: 403, headers: corsHeaders }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // In a real app, you'd remove item from cart in database
    const response = NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to remove item from cart' },
      { status: 500, headers: corsHeaders }
    )
  }
}
