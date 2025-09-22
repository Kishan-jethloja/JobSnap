const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

console.log('🔍 Gmail OAuth Setup Verification');
console.log('=================================\n');

// Check 1: Environment Variables
console.log('1. Environment Variables Check:');
console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || '❌ Not set');
console.log('   GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set (hidden)' : '❌ Not set');
console.log('   GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || '❌ Not set');

// Check 2: Validate credential format
console.log('\n2. Credential Format Validation:');
if (process.env.GOOGLE_CLIENT_ID) {
  if (process.env.GOOGLE_CLIENT_ID.includes('your-google-client-id')) {
    console.log('   ❌ CLIENT_ID is still placeholder value');
  } else if (process.env.GOOGLE_CLIENT_ID.endsWith('.googleusercontent.com')) {
    console.log('   ✅ CLIENT_ID format looks correct');
  } else {
    console.log('   ⚠️  CLIENT_ID format might be incorrect (should end with .googleusercontent.com)');
  }
} else {
  console.log('   ❌ CLIENT_ID not found');
}

if (process.env.GOOGLE_CLIENT_SECRET) {
  if (process.env.GOOGLE_CLIENT_SECRET.includes('your-google-client-secret')) {
    console.log('   ❌ CLIENT_SECRET is still placeholder value');
  } else if (process.env.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
    console.log('   ✅ CLIENT_SECRET format looks correct');
  } else {
    console.log('   ⚠️  CLIENT_SECRET format might be incorrect (usually starts with GOCSPX-)');
  }
} else {
  console.log('   ❌ CLIENT_SECRET not found');
}

// Check 3: Test OAuth client creation
console.log('\n3. OAuth Client Test:');
try {
  const { OAuth2Client } = require('google-auth-library');
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.drafts',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent'
  });
  
  console.log('   ✅ OAuth client created successfully');
  console.log('   ✅ Auth URL generated successfully');
  console.log('   🔗 Sample URL:', authUrl.substring(0, 100) + '...');
  
} catch (error) {
  console.log('   ❌ OAuth client creation failed:', error.message);
}

// Check 4: Required setup status
console.log('\n4. Setup Status Summary:');
const hasValidClientId = process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes('your-google-client-id');
const hasValidClientSecret = process.env.GOOGLE_CLIENT_SECRET && !process.env.GOOGLE_CLIENT_SECRET.includes('your-google-client-secret');
const hasRedirectUri = process.env.GOOGLE_REDIRECT_URI;

if (hasValidClientId && hasValidClientSecret && hasRedirectUri) {
  console.log('   ✅ All credentials appear to be set correctly');
  console.log('   ✅ Ready to test Gmail connection');
} else {
  console.log('   ❌ Setup incomplete. Missing:');
  if (!hasValidClientId) console.log('      - Valid GOOGLE_CLIENT_ID');
  if (!hasValidClientSecret) console.log('      - Valid GOOGLE_CLIENT_SECRET');
  if (!hasRedirectUri) console.log('      - GOOGLE_REDIRECT_URI');
}

console.log('\n5. Next Steps:');
if (hasValidClientId && hasValidClientSecret && hasRedirectUri) {
  console.log('   1. Start your server: cd server && npm run dev');
  console.log('   2. Start your client: cd client && npm start');
  console.log('   3. Go to http://localhost:3000/selected-jobs');
  console.log('   4. Click "Connect Gmail" button');
  console.log('   5. You should be redirected to Google OAuth page');
} else {
  console.log('   1. Go to https://console.cloud.google.com/');
  console.log('   2. Create OAuth 2.0 credentials');
  console.log('   3. Update your server/.env file with real credentials');
  console.log('   4. Run this script again to verify');
}

console.log('\n🔧 Verification complete!');
