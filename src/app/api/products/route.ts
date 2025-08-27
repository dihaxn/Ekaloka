import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/server/db/prisma'
import { handleApiError } from '@/lib/errorHandler'

// Mock product data for development
const mockProducts = [
  {
    _id: "1",
    name: "Premium Fashion Collection",
    description: "Exclusive designer pieces for the modern fashionista",
    price: 199.99,
    category: "Fashion",
    image: ['/images/fashion-accessories.jpg'],
    inStock: true,
    rating: 4.8,
    numReviews: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "2",
    name: "Lifestyle Fashion Bundle",
    description: "Complete your look with our premium lifestyle collection",
    price: 299.99,
    category: "Lifestyle",
    image: ['/images/fashion-lifestyle.jpg'],
    inStock: true,
    rating: 4.9,
    numReviews: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "3",
    name: "Designer Fashion Set",
    description: "Timeless elegance with our exclusive designer pieces",
    price: 399.99,
    category: "Designer",
    image: ['/images/fashion-model.jpg'],
    inStock: true,
    rating: 4.7,
    numReviews: 234,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

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
  try {
    // Add CORS headers
    const response = NextResponse.json({ 
      ok: true, 
      data: { 
        products: mockProducts
      } 
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    const errorResponse = handleApiError(error as Error)
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode })
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Add CORS headers
    const response = NextResponse.json({ 
      ok: true, 
      message: 'Product created successfully',
      data: body
    })
    
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } catch (error) {
    console.error('Error creating product:', error)
    const errorResponse = handleApiError(error as Error)
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode })
  }
}
