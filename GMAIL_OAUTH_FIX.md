# Gmail OAuth Authorization Error Fix

## The Problem
You're seeing "Access blocked: Authorization Error" with "Error 400: invalid_scope" because the OAuth scopes in your Google Cloud Console don't match what the application is requesting.

## Quick Fix Steps

### Step 1: Update Google Cloud Console OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > OAuth consent screen**
3. Click **EDIT APP**
4. Go to **Scopes** section
5. **Remove** any existing scopes
6. Click **ADD OR REMOVE SCOPES**
7. **Add these exact scopes**:
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/userinfo.email`
8. Click **UPDATE** and **SAVE AND CONTINUE**

### Step 2: Clear Browser Cache & Cookies

1. Open Chrome/Edge in **Incognito/Private mode**
2. Or clear all Google-related cookies and cache
3. This ensures you get fresh OAuth consent

### Step 3: Test the Integration

1. Restart your JobSnap server (the scopes are already fixed in code)
2. Try the Gmail connection again in incognito mode
3. You should now see the correct permission request

## Alternative: Create New OAuth Credentials

If the above doesn't work:

1. Go to **APIs & Services > Credentials**
2. **Delete** the existing OAuth 2.0 Client ID
3. **Create** a new OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: **JobSnap Gmail Integration**
   - Authorized redirect URIs: `http://localhost:3000/gmail/callback`
4. Copy the new **Client ID** and **Client Secret**
5. Update your `server/.env` file with new credentials
6. Restart the server

## What Changed in Code

I've updated the OAuth scopes from:
```
- https://www.googleapis.com/auth/gmail.compose
- https://www.googleapis.com/auth/gmail.drafts  
- https://www.googleapis.com/auth/userinfo.email
```

To:
```
- https://www.googleapis.com/auth/gmail.modify
- https://www.googleapis.com/auth/userinfo.email
```

The `gmail.modify` scope includes both compose and drafts permissions and is more commonly accepted.

## Verification

After fixing, you should see:
- ✅ Successful OAuth redirect to Google
- ✅ Permission request for "Manage your Gmail account"
- ✅ Successful return to JobSnap with Gmail connected
- ✅ Ability to create Gmail drafts

## Still Having Issues?

1. Check that Gmail API is enabled in Google Cloud Console
2. Verify your email is added as a test user
3. Make sure the redirect URI exactly matches: `http://localhost:3000/gmail/callback`
4. Try with a different Google account
