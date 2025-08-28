import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

const prisma = new PrismaClient()

// Mobitel SMS Gateway Integration
class MobitelSMSGateway {
  private apiUrl: string
  private username: string
  private password: string
  private senderId: string

  constructor() {
    this.apiUrl = process.env.MOBITEL_SMS_API_URL || ''
    this.username = process.env.MOBITEL_SMS_USERNAME || ''
    this.password = process.env.MOBITEL_SMS_PASSWORD || ''
    this.senderId = process.env.MOBITEL_SMS_SENDER_ID || 'DAI_FASHION'
  }

  // Check if Mobitel SMS is configured
  isConfigured(): boolean {
    return !!(this.apiUrl && this.username && this.password)
  }

  // Send SMS via Mobitel Gateway
  async sendSMS(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConfigured()) {
        return { success: false, error: 'Mobitel SMS Gateway not configured' }
      }

      console.log('📱 === MOBITEL SMS GATEWAY ===')
      console.log(`🌐 API URL: ${this.apiUrl}`)
      console.log(`📞 Phone: ${phone}`)
      console.log(`📝 Message: ${message}`)
      console.log(`👤 Username: ${this.username}`)
      console.log(`🆔 Sender ID: ${this.senderId}`)

      // Format phone number for Mobitel (remove +94, add 0)
      let formattedPhone = phone.replace(/\s/g, '')
      if (formattedPhone.startsWith('+94')) {
        formattedPhone = '0' + formattedPhone.slice(3)
      } else if (formattedPhone.startsWith('94')) {
        formattedPhone = '0' + formattedPhone.slice(2)
      }

      console.log(`📱 Formatted Phone: ${formattedPhone}`)

      // Prepare request payload (adjust based on actual Mobitel API)
      const payload = {
        username: this.username,
        password: this.password,
        destination: formattedPhone,
        message: message,
        source: this.senderId,
        // Add any other required fields based on Mobitel's API
        // priority: 'normal',
        // validity: '24:00'
      }

      console.log('📤 Sending request to Mobitel...')

      // Send SMS via Mobitel API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('✅ Mobitel SMS sent successfully!')
        console.log(`🆔 Message ID: ${result.messageId || 'N/A'}`)
        console.log(`📊 Response:`, result)
        console.log('📱 === END MOBITEL SMS ===')
        
        return { 
          success: true, 
          messageId: result.messageId || result.id || 'mobitel_' + Date.now()
        }
      } else {
        console.error('❌ Mobitel SMS Error:', result)
        console.log('📱 === END MOBITEL SMS ===')
        
        return { 
          success: false, 
          error: result.message || result.error || 'Failed to send SMS via Mobitel'
        }
      }

    } catch (error) {
      console.error('❌ Mobitel SMS Exception:', error)
      console.log('📱 === END MOBITEL SMS ===')
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

// Local OTP System - No external SMS provider needed
class LocalOTPSystem {
  private otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>()
  
  constructor() {
    // Clean up expired OTPs every minute
    setInterval(() => {
      this.cleanupExpiredOTPs()
    }, 60000)
  }

  // Generate a random 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Store OTP with rate limiting and expiration
  storeOTP(phone: string, otp: string): boolean {
    const now = Date.now()
    const existingData = this.otpStore.get(phone)
    
    // Rate limiting: max 3 OTP requests per 10 minutes
    if (existingData && existingData.attempts >= 3) {
      const timeSinceFirstAttempt = now - (existingData.expiresAt - 10 * 60 * 1000)
      if (timeSinceFirstAttempt < 10 * 60 * 1000) {
        console.log(`🚫 Rate limit exceeded for ${phone}`)
        return false
      }
      // Reset attempts after 10 minutes
      this.otpStore.delete(phone)
    }
    
    const expiresAt = now + 10 * 60 * 1000 // 10 minutes expiry
    const attempts = existingData ? existingData.attempts + 1 : 1
    
    this.otpStore.set(phone, { otp, expiresAt, attempts })
    console.log(`💾 Stored OTP for ${phone}, attempt ${attempts}`)
    
    return true
  }

  // Verify OTP
  verifyOTP(phone: string, otp: string): boolean {
    const data = this.otpStore.get(phone)
    if (!data) {
      console.log(`❌ No OTP found for ${phone}`)
      return false
    }
    
    if (Date.now() > data.expiresAt) {
      console.log(`⏰ OTP expired for ${phone}`)
      this.otpStore.delete(phone)
      return false
    }
    
    if (data.otp !== otp) {
      console.log(`❌ Invalid OTP for ${phone}`)
      return false
    }
    
    // OTP verified successfully, remove it
    this.otpStore.delete(phone)
    console.log(`✅ OTP verified successfully for ${phone}`)
    return true
  }

  // Clean up expired OTPs
  private cleanupExpiredOTPs() {
    const now = Date.now()
    for (const [phone, data] of this.otpStore.entries()) {
      if (now > data.expiresAt) {
        this.otpStore.delete(phone)
        console.log(`🧹 Cleaned up expired OTP for ${phone}`)
      }
    }
  }

  // Send OTP locally (console logging + optional email)
  async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      console.log('📱 === LOCAL OTP SYSTEM ===')
      console.log(`📞 Phone: ${phone}`)
      console.log(`🔐 OTP Code: ${otp}`)
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`)
      console.log(`💡 For testing: Use this OTP code: ${otp}`)
      console.log(`📱 === END LOCAL OTP ===`)
      
      // TODO: Optional email integration can be added here
      // await this.sendEmailOTP(phone, otp)
      
      return true
    } catch (error) {
      console.error('❌ Error in local OTP system:', error)
      return false
    }
  }
}

// Initialize systems
const localOTPSystem = new LocalOTPSystem()
const mobitelSMSGateway = new MobitelSMSGateway()

// Phone number validation for Sri Lanka
function validateSriLankanPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s-]/g, '')
  const sriLankanPhoneRegex = /^(\+94\d{9}|0\d{9})$/
  return sriLankanPhoneRegex.test(cleanPhone)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { step, phone, name, email, password, otp } = body

    console.log('🚀 === SEND OTP REQUEST ===')
    console.log('📋 Request body:', body)

    if (step === 'send-otp') {
      // Validate phone number
      if (!phone || !validateSriLankanPhone(phone)) {
        return NextResponse.json(
          { success: false, message: 'Invalid Sri Lankan phone number format' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Generate and store OTP
      const generatedOTP = localOTPSystem.generateOTP()
      const otpStored = localOTPSystem.storeOTP(phone, generatedOTP)
      
      if (!otpStored) {
        return NextResponse.json(
          { success: false, message: 'Rate limit exceeded. Please wait before requesting another OTP.' },
          { status: 429, headers: corsHeaders }
        )
      }

      console.log('✅ Phone validation passed')
      console.log(`🔐 Generated OTP: ${generatedOTP}`)
      console.log(`⏰ Expires at: ${new Date(Date.now() + 10 * 60 * 1000).toISOString()}`)

      // Try to send via Mobitel SMS Gateway first
      if (mobitelSMSGateway.isConfigured()) {
        console.log('📱 Attempting to send via Mobitel SMS Gateway...')
        
        const smsMessage = `Your Dai Fashion verification code is: ${generatedOTP}. Valid for 10 minutes.`
        const smsResult = await mobitelSMSGateway.sendSMS(phone, smsMessage)
        
        if (smsResult.success) {
          console.log('✅ OTP sent successfully via Mobitel SMS!')
          console.log('🚀 === END SEND OTP REQUEST ===')
          return NextResponse.json({ 
            success: true, 
            message: 'OTP sent successfully via SMS to your phone number!' 
          }, { headers: corsHeaders })
        } else {
          console.log(`⚠️ Mobitel SMS failed: ${smsResult.error}`)
          console.log('🔄 Falling back to console logging...')
        }
      } else {
        console.log('⚠️ Mobitel SMS Gateway not configured, using console logging')
      }

      // Fallback to local OTP system
      const otpSent = await localOTPSystem.sendOTP(phone, generatedOTP)
      
      if (otpSent) {
        console.log('✅ OTP sent successfully via console logging')
        console.log('🚀 === END SEND OTP REQUEST ===')
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent successfully! Check the console for the code.' 
        }, { headers: corsHeaders })
      } else {
        return NextResponse.json(
          { success: false, message: 'Failed to send OTP' },
          { status: 500, headers: corsHeaders }
        )
      }
    }

    if (step === 'verify-otp') {
      // Validate required fields
      if (!phone || !name || !email || !password || !otp) {
        return NextResponse.json(
          { success: false, message: 'All fields are required' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Verify OTP
      const otpValid = localOTPSystem.verifyOTP(phone, otp)
      if (!otpValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired OTP' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { phone: phone.replace(/\s/g, '') }
          ]
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'User with this email or phone already exists' },
          { status: 409, headers: corsHeaders }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          uid: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          email: email.toLowerCase(),
          phone: phone.replace(/\s/g, ''),
          passwordHash: hashedPassword,
          role: 'customer'
        }
      })

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )

      console.log('✅ User registered successfully:', user.email)
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully! Redirecting to login...',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }, { headers: corsHeaders })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid step' },
      { status: 400, headers: corsHeaders }
    )

  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
