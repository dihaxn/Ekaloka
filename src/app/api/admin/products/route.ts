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

// Helper function to check if user is admin
function isAdminUser(token: string): boolean {
  return token.includes('admin')
}

// GET /api/admin/products - Get all products (admin only)
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

    // Check if user is admin
    if (!isAdminUser(token)) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403, headers: corsHeaders }
      )
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })

    const response = NextResponse.json({
      success: true,
      products
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error getting admin products:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to get products' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// POST /api/admin/products - Create new product (admin only)
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
    if (!isAdminUser(token)) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403, headers: corsHeaders }
      )
    }

    const body = await request.json()
    const { name, price, description } = body

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Product name and price are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Create product in database
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description: description || ''
      }
    })

    const response = NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    })

    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500, headers: corsHeaders }
    )
  }
}
