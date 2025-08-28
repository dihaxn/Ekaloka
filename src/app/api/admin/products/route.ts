import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import jwt from 'jsonwebtoken'

// Create Prisma client with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate())

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

// Helper function to check if user is owner
function isOwnerUser(token: string): boolean {
  try {
    const jwtSecret = process.env.JWT_ACCESS_SECRET
    if (!jwtSecret) {
      console.error('JWT_ACCESS_SECRET environment variable is not set')
      return false
    }
    const decoded = jwt.verify(token, jwtSecret) as any
    return decoded.role === 'owner'
  } catch (error) {
    return false
  }
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
    if (!isOwnerUser(token)) {
      return NextResponse.json(
        { success: false, message: 'Owner access required' },
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
  } finally {
    await prisma.$disconnect()
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
    if (!isOwnerUser(token)) {
      return NextResponse.json(
        { success: false, message: 'Owner access required' },
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

    // Create product in database with all required fields
    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description: description || '',
        category: body.category || 'Fashion',
        brand: body.brand || 'Dai Fashion',
        sku: body.sku || `SKU-${Date.now()}`,
        stock: parseInt(body.stock) || 0,
        images: Array.isArray(body.images) ? body.images : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        status: 'active',
        rating: 0,
        totalSales: 0,
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
  } finally {
    await prisma.$disconnect()
  }
}
