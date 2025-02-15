import axios from 'axios';

interface SMSProviderConfig {
  apiKey: string;
  senderId: string;
  templateId: string;
  baseUrl: string;
}

// Get SMS provider configuration from environment
const smsConfig: SMSProviderConfig = {
  apiKey: process.env.SMS_API_KEY || '',
  senderId: process.env.SMS_SENDER_ID || '',
  templateId: process.env.SMS_TEMPLATE_ID || '',
  baseUrl: process.env.SMS_API_URL || 'https://api.msg91.com/api/v5' // Using MSG91 as example
};

export async function sendSMS(phoneNumber: string, message: string) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.log('Development mode: Mock sending SMS');
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    return true;
  }

  try {
    // Validate configuration
    if (!smsConfig.apiKey || !smsConfig.senderId) {
      throw new Error('SMS provider configuration missing');
    }

    // Send SMS using MSG91 API
    const response = await axios.post(`${smsConfig.baseUrl}/flow/`, {
      template_id: smsConfig.templateId,
      sender: smsConfig.senderId,
      short_url: 0,
      mobiles: phoneNumber.replace('+91', ''), // Remove country code for MSG91
      VAR1: message // OTP code
    }, {
      headers: {
        'authkey': smsConfig.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('SMS sent successfully');
      return true;
    }

    throw new Error(`Failed to send SMS: ${response.statusText}`);
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

export async function sendOTP(phoneNumber: string, otp: string) {
  const message = `Your OTP is: ${otp}. Valid for 5 minutes.`;
  return sendSMS(phoneNumber, message);
}
