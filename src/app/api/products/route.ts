import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/server/db/prisma'
import { handleApiError } from '@/lib/errorHandler'

// Mock product data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    offerPrice: 249.99,
    image: ['/images/bose_headphone_image.svg'],
    category: 'Electronics',
    brand: 'Bose',
    rating: 4.8,
    reviews: 156,
    inStock: true
  },
  {
    _id: '2',
    name: 'Gaming Controller',
    description: 'Professional gaming controller with customizable buttons',
    price: 89.99,
    offerPrice: 69.99,
    image: ['/images/md_controller_image.svg'],
    category: 'Gaming',
    brand: 'GamePro',
    rating: 4.6,
    reviews: 89,
    inStock: true
  },
  {
    _id: '3',
    name: 'Laptop Computer',
    description: 'High-performance laptop for work and gaming',
    price: 1299.99,
    offerPrice: 1099.99,
    image: ['/images/asus_laptop_image.svg'],
    category: 'Computers',
    brand: 'ASUS',
    rating: 4.7,
    reviews: 234,
    inStock: true
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
    return handleApiError(error)
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
    return handleApiError(error)
  }
}
