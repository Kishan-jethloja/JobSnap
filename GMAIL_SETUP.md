# Gmail Integration Setup Guide

This guide will help you set up Gmail OAuth integration for JobSnap's premium features.

## Prerequisites

- Google Cloud Console account
- JobSnap project running locally
- Basic understanding of OAuth 2.0

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID for reference

## Step 2: Enable Gmail API

1. In the Google Cloud Console, navigate to **APIs & Services > Library**
2. Search for "Gmail API"
3. Click on Gmail API and click **Enable**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type (for testing) or **Internal** (for organization use)
3. Fill in the required information:
   - **App name**: JobSnap
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/userinfo.email`
5. Add test users (your email and any test accounts)
6. Save and continue

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Choose **Web application** as application type
4. Set the name: "JobSnap Gmail Integration"
5. Add authorized redirect URIs:
   - `http://localhost:3000/gmail/callback` (for development)
   - Add your production URL when deploying
6. Click **Create**
7. **IMPORTANT**: Copy the Client ID and Client Secret

## Step 5: Update Environment Variables

1. Open `server/.env` file
2. Replace the placeholder values:

```env
GOOGLE_CLIENT_ID="your-actual-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/gmail/callback"
```

## Step 6: Test the Integration

1. Restart your JobSnap server
2. Register/login as a user
3. Upgrade to premium (demo upgrade available)
4. Go to Selected Jobs page
5. Click "Connect Gmail" - should redirect to Google OAuth
6. Grant permissions and return to JobSnap
7. Select some jobs and click "Create Gmail Drafts"

## Troubleshooting

### Common Issues

**Error: "Gmail OAuth not configured"**
- Check that your .env file has the correct credentials
- Ensure you've restarted the server after updating .env

**Error: "redirect_uri_mismatch"**
- Verify the redirect URI in Google Cloud Console matches exactly
- Check for typos in the URL (http vs https, localhost vs 127.0.0.1)

**Error: "access_denied"**
- Make sure you've added your email as a test user in OAuth consent screen
- Check that all required scopes are added

**Error: "invalid_client"**
- Double-check your Client ID and Client Secret
- Ensure there are no extra spaces or characters

### Testing Tips

1. Use Chrome DevTools Network tab to debug OAuth flow
2. Check server logs for detailed error messages
3. Verify Gmail API is enabled in Google Cloud Console
4. Test with a fresh incognito browser session

## Production Deployment

When deploying to production:

1. Update OAuth consent screen with production domain
2. Add production redirect URI to OAuth credentials
3. Update `GOOGLE_REDIRECT_URI` in production environment
4. Consider moving from "Testing" to "Published" status for OAuth consent

## Security Notes

- Never commit actual credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate OAuth credentials
- Monitor API usage in Google Cloud Console
- Implement proper error handling for expired tokens

## API Limits

- Gmail API has generous quotas for most use cases
- Monitor usage in Google Cloud Console
- Implement rate limiting if needed for high-volume usage

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the OAuth flow step by step
4. Consult Google's OAuth 2.0 documentation

---

**Note**: This setup is for development and testing. For production use, ensure proper security measures and consider additional authentication layers.
