// Test script to check Gmail OAuth configuration
const { google } = require('googleapis');
require('dotenv').config();

console.log('🔍 Testing Gmail OAuth Configuration...\n');

// Check environment variables
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

console.log('Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', clientId ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', clientSecret ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_REDIRECT_URI:', redirectUri ? '✅ Set' : '❌ Missing');

if (!clientId || !clientSecret) {
  console.log('\n❌ Gmail OAuth not configured properly.');
  console.log('Add these to your .env file:');
  console.log('GOOGLE_CLIENT_ID=your-google-client-id');
  console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret');
  console.log('GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback');
  process.exit(1);
}

// Check if using placeholder values
if (clientId.includes('your-google-client-id') || clientSecret.includes('your-google-client-secret')) {
  console.log('\n⚠️  Using placeholder values. Gmail integration is disabled.');
  console.log('To enable Gmail integration, replace with actual Google OAuth credentials.');
  process.exit(0);
}

// Test OAuth client creation
try {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  console.log('\n✅ OAuth client created successfully');
  
  // Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });
  
  console.log('\n🔗 Generated OAuth URL:');
  console.log(authUrl);
  console.log('\n✅ Gmail OAuth configuration is working!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure your email is added as a test user in Google Cloud Console');
  console.log('2. Visit the OAuth URL above to test the connection');
  console.log('3. Check that the redirect URI matches: http://localhost:5000/api/gmail/callback');
  
} catch (error) {
  console.log('\n❌ Error creating OAuth client:', error.message);
}
