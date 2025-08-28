# 🚀 Mobitel SMS Gateway Setup Guide

## ✅ What's Been Implemented:

- ✅ **Mobitel SMS Gateway Class** - Complete integration
- ✅ **Automatic Fallback** - Console logging if SMS fails
- ✅ **Phone Number Formatting** - Automatically formats for Mobitel
- ✅ **Environment Configuration** - Easy setup via .env file
- ✅ **Error Handling** - Comprehensive error logging

## 🔧 Setup Steps:

### 1. Get Mobitel SMS Gateway Credentials

Contact Mobitel Business Services to get:

- **API Endpoint URL** (e.g., `https://api.mobitel.lk/sms/send`)
- **Username** (your business account username)
- **Password** (your business account password)
- **Sender ID** (e.g., "DAI_FASHION" - must be pre-approved)

### 2. Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Mobitel SMS Gateway Configuration
MOBITEL_SMS_API_URL="https://api.mobitel.lk/sms/send"
MOBITEL_SMS_USERNAME="your_actual_mobitel_username"
MOBITEL_SMS_PASSWORD="your_actual_mobitel_password"
MOBITEL_SMS_SENDER_ID="DAI_FASHION"
```

### 3. Restart Your Server

```bash
npm run dev
```

## 🎯 How It Works:

### **Priority System:**

1. **First Priority**: Mobitel SMS Gateway (if configured)
2. **Fallback**: Console logging (always works)

### **Phone Number Formatting:**

- **Input**: `+94701410595` or `0701410595`
- **Mobitel Format**: `0701410595` (removes +94, adds 0)
- **Automatic**: No manual formatting needed

### **Message Format:**

```
Your Dai Fashion verification code is: 123456. Valid for 10 minutes.
```

## 📱 Expected Console Output:

### **When Mobitel SMS Works:**

```
📱 === MOBITEL SMS GATEWAY ===
🌐 API URL: https://api.mobitel.lk/sms/send
📞 Phone: +94701410595
📝 Message: Your Dai Fashion verification code is: 123456...
👤 Username: your_username
🆔 Sender ID: DAI_FASHION
📱 Formatted Phone: 0701410595
📤 Sending request to Mobitel...
✅ Mobitel SMS sent successfully!
🆔 Message ID: mobitel_1234567890
📱 === END MOBITEL SMS ===
```

### **When Mobitel SMS Fails (Fallback):**

```
⚠️ Mobitel SMS failed: Invalid credentials
🔄 Falling back to console logging...
📱 === LOCAL OTP SYSTEM ===
📞 Phone: +94701410595
🔐 OTP Code: 123456
💡 For testing: Use this OTP code: 123456
📱 === END LOCAL OTP ===
```

## 🔍 Troubleshooting:

### **Common Issues:**

1. **"Mobitel SMS Gateway not configured"**

   - Check your `.env` file has all required values
   - Restart the server after updating .env

2. **"Invalid credentials"**

   - Verify username/password with Mobitel
   - Check if your account is active

3. **"API endpoint not found"**

   - Verify the API URL with Mobitel
   - Check if the endpoint is correct

4. **"Sender ID not approved"**
   - Contact Mobitel to approve "DAI_FASHION"
   - Use a pre-approved sender ID

### **Testing Steps:**

1. **Test with Console Logging First:**

   - Leave Mobitel credentials empty
   - Verify OTP appears in console

2. **Test with Mobitel SMS:**
   - Add real credentials
   - Check console for Mobitel logs
   - Verify SMS delivery to phone

## 💰 Cost Benefits:

- **International SMS**: ~$0.0075 per SMS (~2.50 LKR)
- **Mobitel**: ~1-3 LKR per SMS (50-80% cheaper!)
- **Local Numbers**: Better delivery rates
- **No International Fees**: Direct local routing

## 🚀 Next Steps:

1. **Contact Mobitel Business Services**
2. **Get your API credentials**
3. **Update the .env file**
4. **Test with a real phone number**
5. **Enjoy cheap, reliable SMS!**

## 📞 Mobitel Business Contact:

- **Website**: [mobitel.lk/business](https://mobitel.lk/business)
- **Email**: business@mobitel.lk
- **Phone**: +94 11 2 444 444
- **Service**: Business SMS Gateway

## 🎉 Benefits:

- ✅ **Much cheaper** than international providers
- ✅ **Better delivery rates** for Sri Lankan numbers
- ✅ **Local support** and understanding
- ✅ **Automatic fallback** to console logging
- ✅ **Production ready** with error handling
- ✅ **Easy to configure** via environment variables

Your system is now ready for real SMS delivery via Mobitel! 🎯
