import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as jwt from 'jsonwebtoken'

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

// GET /api/products
export async function GET(request: NextRequest) {
  const prisma = new PrismaClient()
  
  try {
    // Debug: Log environment variables
    console.log('Environment check:', {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    })

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        offerPrice: true,
        description: true,
        category: true,
        brand: true,
        sku: true,
        stock: true,
        images: true,
        tags: true,
        status: true,
        rating: true,
        totalSales: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Transform for compatibility with frontend
    const transformedProducts = products.map(product => ({
      _id: product.id,
      name: product.name,
      price: product.price,
      offerPrice: product.offerPrice,
      description: product.description,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      stock: product.stock,
      image: product.images,
      tags: product.tags,
      status: product.status,
      rating: product.rating,
      totalSales: product.totalSales,
      inStock: product.stock > 0,
      numReviews: Math.floor(Math.random() * 200) + 50, // Mock reviews for now
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))
    
    const response = NextResponse.json({ 
      ok: true, 
      data: { 
        products: transformedProducts
      } 
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  const prisma = new PrismaClient()
  
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_ACCESS_SECRET
    
    if (!jwtSecret) {
      console.error('JWT_ACCESS_SECRET environment variable is not set')
      return NextResponse.json(
        { success: false, message: 'Authentication service unavailable' },
        { status: 500, headers: corsHeaders }
      )
    }
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as any
      if (decoded.role !== 'owner') {
        return NextResponse.json(
          { success: false, message: 'Owner access required' },
          { status: 403, headers: corsHeaders }
        )
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      )
    }

    const body = await request.json()
    const {
      name,
      price,
      offerPrice,
      description,
      category,
      brand,
      sku,
      stock,
      images,
      tags,
      status = 'active'
    } = body

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        description,
        category,
        brand,
        sku,
        stock: parseInt(stock) || 0,
        images: Array.isArray(images) ? images : [],
        tags: Array.isArray(tags) ? tags : [],
        status,
        rating: 0,
        totalSales: 0,
      }
    })
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      data: product
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error creating product:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create product',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
      },
      { status: 500, headers: corsHeaders }
    )
  } finally {
    await prisma.$disconnect()
  }
}
