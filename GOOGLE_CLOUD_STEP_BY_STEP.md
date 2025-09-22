# Google Cloud Console Step-by-Step Guide

## Current Issue: Can't See Scopes Section

The Scopes section might not be visible if you haven't completed all the required steps. Here's the correct order:

## Step 1: Enable Gmail API First
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services > Library**
4. Search for "Gmail API"
5. Click **Gmail API** and click **ENABLE**

## Step 2: OAuth Consent Screen Setup
1. Go to **APIs & Services > OAuth consent screen**
2. If you see "Configure consent screen":
   - Choose **External** (for personal use) or **Internal** (for organization)
   - Click **CREATE**

3. Fill out **OAuth consent screen** tab:
   - **App name**: JobSnap
   - **User support email**: Your email
   - **App logo**: (optional)
   - **App domain**: (leave blank for now)
   - **Developer contact information**: Your email
   - Click **SAVE AND CONTINUE**

4. **Scopes** tab (this is where you add scopes):
   - Click **ADD OR REMOVE SCOPES**
   - In the popup, manually add these scopes:
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/userinfo.email`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

5. **Test users** tab:
   - Click **ADD USERS**
   - Add your email address (jethlojakishan0@gmail.com)
   - Click **SAVE AND CONTINUE**

6. **Summary** tab:
   - Review and click **BACK TO DASHBOARD**

## Step 3: Create OAuth Credentials
1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **OAuth 2.0 Client IDs**
4. Choose **Web application**
5. Name: "JobSnap Gmail Integration"
6. **Authorized redirect URIs**:
   - Click **ADD URI**
   - Enter: `http://localhost:3000/gmail/callback`
7. Click **CREATE**
8. **IMPORTANT**: Copy the Client ID and Client Secret

## Step 4: Update Your .env File
```env
GOOGLE_CLIENT_ID="your-actual-client-id-here.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:3000/gmail/callback"
```

## Troubleshooting

### If you still can't see Scopes section:
1. Make sure Gmail API is enabled
2. Complete the App information first
3. The Scopes tab appears after saving App information

### If Scopes section is grayed out:
1. You might be using Internal user type without proper domain setup
2. Switch to External user type
3. Or contact your Google Workspace admin

### Alternative: Add Scopes Manually
If the UI doesn't work, you can add scopes when creating credentials:
1. When testing the OAuth flow, Google will ask for permissions
2. The app will request the scopes defined in the code
3. You can approve them during testing

## Quick Test
After setup:
1. Restart your JobSnap server
2. Go to the app and try Gmail connection
3. You should see Google's permission screen asking for Gmail access
