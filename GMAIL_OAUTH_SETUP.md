# Gmail OAuth Setup Guide

## 🚨 Fix for "Access blocked: Clinic Booking System has not completed the Google verification process"

This error occurs because your email (`jethlojakishan0@gmail.com`) is not added as a test user in Google Cloud Console.

### ⚡ IMMEDIATE FIX (2 minutes):

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** (or create one)
3. **Go to OAuth consent screen**:
   - Navigate to "APIs & Services" → "OAuth consent screen"
4. **Add Test Users**:
   - Scroll down to "Test users" section
   - Click "ADD USERS"
   - Add: `jethlojakishan0@gmail.com`
   - Click "SAVE"

That's it! The error should be fixed immediately.

## Alternative Quick Fix

If you don't need Gmail integration right now, add these to your `.env` file:

### Option 1: Disable Gmail Integration (Recommended for Testing)

If you don't need Gmail integration right now, you can disable it by adding these environment variables to your `.env` file:

```env
# Disable Gmail OAuth (use placeholder values)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback
```

This will show a proper error message instead of the Google OAuth error.

### Option 2: Set Up Gmail OAuth Properly

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Gmail API**
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/gmail/callback`
     - `http://localhost:3000/gmail/callback` (for development)

4. **Add Your Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback
   ```

5. **Add Test Users (Important!)**
   - In Google Cloud Console, go to "OAuth consent screen"
   - Add your email address as a test user
   - This prevents the "Access blocked" error

## Current Status

The application now:
- ✅ Uses popup windows for OAuth (no more main window redirects)
- ✅ Shows proper error messages when Gmail is not configured
- ✅ Handles OAuth flow correctly
- ✅ Falls back gracefully when Gmail integration is unavailable

## Testing Without Gmail

The app works perfectly without Gmail integration:
- ✅ User registration and login
- ✅ Resume upload and parsing
- ✅ Job browsing and selection
- ✅ Email sending (requires SMTP setup)
- ✅ Premium features

Gmail integration is only needed for the "Create Gmail Drafts" feature.
