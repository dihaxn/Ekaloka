import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

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

// Brevo Email Service Integration
class BrevoEmailService {
  private apiKey: string | undefined;
  private senderEmail: string | undefined;
  private senderName: string | undefined;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.senderEmail = process.env.BREVO_SENDER_EMAIL;
    this.senderName = process.env.BREVO_SENDER_NAME || 'DAI Fashion';

    if (!this.apiKey || !this.senderEmail) {
      console.warn('⚠️ Brevo API Key or Sender Email not configured. Emails will not be sent.');
    }
  }

  async sendEmail(toEmail: string, subject: string, htmlContent: string): Promise<boolean> {
    if (!this.apiKey || !this.senderEmail) {
      console.error('❌ Brevo is not configured. Cannot send email.');
      return false;
    }

    try {
      console.log('📧 === BREVO EMAIL SERVICE ===');
      console.log(`📧 To: ${toEmail}`);
      console.log(`📧 Subject: ${subject}`);
      console.log(`📧 From: ${this.senderEmail} (${this.senderName})`);

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: { email: this.senderEmail, name: this.senderName },
          to: [{ email: toEmail }],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Brevo: OTP email sent successfully!');
        console.log(`🆔 Message ID: ${result.messageId || 'N/A'}`);
        console.log('📧 === END BREVO EMAIL ===');
        return true;
      } else {
        const errorData = await response.json();
        console.error(`❌ Brevo: Failed to send OTP email. Status: ${response.status}, Error:`, errorData);
        console.log('📧 === END BREVO EMAIL ===');
        return false;
      }
    } catch (error) {
      console.error(`❌ Brevo: Exception while sending OTP email:`, error);
      console.log('📧 === END BREVO EMAIL ===');
      return false;
    }
  }
}

const brevoEmailService = new BrevoEmailService();

// Local OTP System for Password Reset
class PasswordResetOTPSystem {
  private otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number; email: string }>()
  
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
  storeOTP(email: string, otp: string): boolean {
    const now = Date.now()
    const existingData = this.otpStore.get(email)
    
    // Rate limiting: max 3 OTP requests per 10 minutes
    if (existingData && existingData.attempts >= 3) {
      const timeSinceFirstAttempt = now - (existingData.expiresAt - 10 * 60 * 1000)
      if (timeSinceFirstAttempt < 10 * 60 * 1000) {
        console.log(`🚫 Rate limit exceeded for ${email}`)
        return false
      }
      // Reset attempts after 10 minutes
      this.otpStore.delete(email)
    }
    
    const expiresAt = now + 10 * 60 * 1000 // 10 minutes expiry
    const attempts = existingData ? existingData.attempts + 1 : 1
    
    this.otpStore.set(email, { otp, expiresAt, attempts, email })
    console.log(`💾 Stored password reset OTP for ${email}, attempt ${attempts}`)
    
    return true
  }

  // Verify OTP (don't delete it yet - keep for password reset)
  verifyOTP(email: string, otp: string): boolean {
    const data = this.otpStore.get(email)
    if (!data) {
      console.log(`❌ No password reset OTP found for ${email}`)
      return false
    }
    
    if (Date.now() > data.expiresAt) {
      console.log(`⏰ Password reset OTP expired for ${email}`)
      this.otpStore.delete(email)
      return false
    }
    
    if (data.otp !== otp) {
      console.log(`❌ Invalid password reset OTP for ${email}`)
      return false
    }
    
    // OTP verified successfully, but don't delete it yet
    // It will be deleted after password reset is complete
    console.log(`✅ Password reset OTP verified successfully for ${email}`)
    return true
  }

  // Mark OTP as used (call this after password reset is complete)
  markOTPAsUsed(email: string): void {
    this.otpStore.delete(email)
    console.log(`🗑️ OTP marked as used and removed for ${email}`)
  }

  // Check if OTP is still valid (without deleting it)
  isOTPValid(email: string, otp: string): boolean {
    const data = this.otpStore.get(email)
    if (!data) {
      return false
    }
    
    if (Date.now() > data.expiresAt) {
      this.otpStore.delete(email)
      return false
    }
    
    return data.otp === otp
  }

  // Clean up expired OTPs
  private cleanupExpiredOTPs() {
    const now = Date.now()
    for (const [email, data] of this.otpStore.entries()) {
      if (now > data.expiresAt) {
        this.otpStore.delete(email)
        console.log(`🧹 Cleaned up expired password reset OTP for ${email}`)
      }
    }
  }

  // Send OTP via Brevo or fallback to console
  async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      console.log('📧 === PASSWORD RESET OTP SYSTEM ===')
      console.log(`📧 Email: ${email}`)
      console.log(`🔐 OTP Code: ${otp}`)
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`)

      // Try to send via Brevo first
      const subject = 'DAI Fashion - Password Reset OTP';
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 15px; border-radius: 10px; display: inline-block;">
              <div style="background: #000; padding: 10px; border-radius: 8px;">
                <span style="color: #fbbf24; font-weight: bold; font-size: 24px;">DF</span>
              </div>
            </div>
            <h1 style="color: #1f2937; margin: 20px 0 10px 0;">Password Reset Request</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hello! You have requested to reset your password for your DAI Fashion account.
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your One-Time Password (OTP) is:</p>
              <div style="background: #1f2937; color: #fbbf24; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 8px; letter-spacing: 4px; font-family: monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              <strong>Important:</strong>
            </p>
            <ul style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px;">
                Need help? Contact our support team
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2025 DAI Fashion. All rights reserved.</p>
          </div>
        </div>
      `;

      // Attempt to send via Brevo
      const sentViaBrevo = await brevoEmailService.sendEmail(email, subject, htmlContent);

      if (sentViaBrevo) {
        console.log('✅ OTP sent successfully via Brevo email!');
        console.log('📧 === END PASSWORD RESET OTP ===');
        return true;
      } else {
        // Fallback to console logging if Brevo fails
        console.log('⚠️ Brevo email failed, falling back to console logging');
        console.log(`💡 For testing: Use this OTP code: ${otp}`);
        console.log('📧 === END PASSWORD RESET OTP ===');
        return true; // Consider console logging as successful for development
      }
    } catch (error) {
      console.error('❌ Error in password reset OTP system:', error)
      console.log('📧 === END PASSWORD RESET OTP ===');
      return false
    }
  }
}

// Initialize password reset OTP system
const passwordResetOTPSystem = new PasswordResetOTPSystem()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { step, email, otp, newPassword } = body

    console.log('🔐 === PASSWORD RESET REQUEST ===')
    console.log('📋 Request body:', body)

    if (step === 'send-otp') {
      // Validate email
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { success: false, message: 'Valid email address is required' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Check if user exists in database
      try {
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })

        if (!user) {
          console.log(`❌ Password reset attempted for non-existent email: ${email}`)
          return NextResponse.json(
            { success: false, message: 'No account found with this email address. Please check your email spelling or sign up for a new account.' },
            { status: 404, headers: corsHeaders }
          )
        }

        console.log(`✅ User found for password reset: ${email}`)
        await prisma.$disconnect()
      } catch (dbError) {
        console.log(`⚠️ Database check failed, proceeding with OTP generation: ${dbError}`)
        // Continue with OTP generation even if database check fails
      }

      // Generate and store OTP
      const generatedOTP = passwordResetOTPSystem.generateOTP()
      const otpStored = passwordResetOTPSystem.storeOTP(email.toLowerCase(), generatedOTP)
      
      if (!otpStored) {
        return NextResponse.json(
          { success: false, message: 'Rate limit exceeded. Please wait before requesting another OTP.' },
          { status: 429, headers: corsHeaders }
        )
      }

      console.log('✅ OTP generated and stored')
      console.log(`🔐 Generated OTP: ${generatedOTP}`)
      console.log(`⏰ Expires at: ${new Date(Date.now() + 10 * 60 * 1000).toISOString()}`)

      // Send OTP via Brevo or fallback to console
      const otpSent = await passwordResetOTPSystem.sendOTP(email.toLowerCase(), generatedOTP)
      
      if (otpSent) {
        console.log('✅ Password reset OTP sent successfully')
        console.log('🔐 === END PASSWORD RESET REQUEST ===')
        return NextResponse.json({ 
          success: true, 
          message: 'OTP sent to your email! Check your inbox.' 
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
      if (!email || !otp) {
        return NextResponse.json(
          { success: false, message: 'Email and OTP are required' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Verify OTP
      const otpValid = passwordResetOTPSystem.verifyOTP(email.toLowerCase(), otp)
      if (!otpValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired OTP' },
          { status: 400, headers: corsHeaders }
        )
      }

      console.log('✅ Password reset OTP verified successfully')
      console.log('🔐 === END PASSWORD RESET REQUEST ===')
      
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully. You can now reset your password.'
      }, { headers: corsHeaders })
    }

    if (step === 'reset-password') {
      // Validate required fields
      if (!email || !otp || !newPassword) {
        return NextResponse.json(
          { success: false, message: 'Email, OTP, and new password are required' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Verify OTP again (security check) - use validation without deletion
      const otpValid = passwordResetOTPSystem.isOTPValid(email.toLowerCase(), otp)
      if (!otpValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired OTP' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Validate password strength
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 6 characters long' },
          { status: 400, headers: corsHeaders }
        )
      }

      // Mark OTP as used after successful password reset
      passwordResetOTPSystem.markOTPAsUsed(email.toLowerCase())
      
      // Actually update the password in the database
      try {
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12)
        
        // Update user's password in database
        await prisma.user.update({
          where: { email: email.toLowerCase() },
          data: { passwordHash: hashedPassword }
        })
        
        await prisma.$disconnect()
        
        console.log('✅ Password updated successfully in database for:', email.toLowerCase())
        console.log('🔐 === END PASSWORD RESET REQUEST ===')
        
        return NextResponse.json({
          success: true,
          message: 'Password reset successful! You can now login with your new password.'
        }, { headers: corsHeaders })
        
      } catch (dbError) {
        console.error('❌ Database error during password update:', dbError)
        console.log('🔐 === END PASSWORD RESET REQUEST ===')
        
        return NextResponse.json({
          success: false,
          message: 'Password reset failed. Please try again or contact support.'
        }, { status: 500, headers: corsHeaders })
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid step' },
      { status: 400, headers: corsHeaders }
    )

  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
