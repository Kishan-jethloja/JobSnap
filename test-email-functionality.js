// Test script to check email and Gmail functionality
require('dotenv').config();
const mongoose = require('mongoose');
const { sendSelectedJobsEmail } = require('./server/utils/mailer');
const gmailService = require('./server/utils/gmailService');

console.log('🔍 Testing Email and Gmail Functionality...\n');

// Test environment variables
console.log('Environment Variables Check:');
console.log('SMTP_HOST:', process.env.SMTP_HOST ? '✅ Set' : '❌ Missing');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');

// Test Gmail service configuration
console.log('\nGmail Service Status:');
console.log('Gmail configured:', gmailService.isConfigured ? '✅ Yes' : '❌ No');

if (!gmailService.isConfigured) {
  console.log('\n⚠️  Gmail OAuth not configured. Add these to your .env file:');
  console.log('GOOGLE_CLIENT_ID=your-google-client-id');
  console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret');
  console.log('GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback');
}

// Test SMTP configuration
console.log('\nSMTP Configuration:');
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.log('❌ SMTP not configured. Add these to your .env file:');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_USER=your-email@gmail.com');
  console.log('SMTP_PASS=your-app-password');
} else {
  console.log('✅ SMTP configuration found');
}

console.log('\n📧 Email Sending Options:');
console.log('1. Gmail API (if Gmail is connected): ✅ Available');
console.log('2. SMTP (if configured):', (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ? '✅ Available' : '❌ Not configured');

console.log('\n🔧 Troubleshooting Tips:');
console.log('1. If "Send to Email" button doesn\'t work:');
console.log('   - Check if you have Gmail connected OR SMTP configured');
console.log('   - Check browser console for error messages');
console.log('   - Check server logs for detailed error information');

console.log('\n2. If "Create Gmail Drafts" button doesn\'t work:');
console.log('   - Make sure Gmail is connected (check Gmail status)');
console.log('   - Make sure you have selected jobs');
console.log('   - Check that Gmail OAuth is properly configured');

console.log('\n3. For Gmail setup:');
console.log('   - Follow the GMAIL_OAUTH_SETUP.md guide');
console.log('   - Make sure your email is added as a test user in Google Cloud Console');

console.log('\n4. For SMTP setup (Gmail):');
console.log('   - Enable 2-factor authentication on your Gmail account');
console.log('   - Generate an App Password: https://myaccount.google.com/apppasswords');
console.log('   - Use the App Password (not your regular password) in SMTP_PASS');

console.log('\n✅ Test completed! Check the information above to resolve any issues.');
