# JobSnap Configuration Guide

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/jobsnap

# JWT Secret (Generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Optional Variables (for enhanced features)

```env
# Email Configuration (for sending job emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google OAuth Configuration (for Gmail integration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback

# External Job APIs (Optional - for fetching real job data)
RAPIDAPI_KEY=your-rapidapi-key
REMOTIVE_API=https://remotive.io/api/remote-jobs
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm run install-deps
   ```

2. **Start MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGO_URI in .env file

3. **Start the Application**
   ```bash
   npm run dev
   ```

## Features That Work Without Configuration

- User registration and authentication
- Resume upload and parsing
- Job browsing (uses mock data)
- Premium subscription (demo mode)
- Basic job matching

## Features Requiring Configuration

- **Email sending**: Requires SMTP configuration
- **Gmail integration**: Requires Google OAuth setup
- **Real job data**: Requires external API keys

## Troubleshooting

### Common Issues Fixed

1. **CSS animations not working**: Fixed by adding custom animations to index.css
2. **Button navigation issues**: Fixed by using React Router's useNavigate hook
3. **API endpoint mismatches**: Fixed by adding missing POST route for job matching
4. **Loading spinner styling**: Fixed by correcting CSS class references
5. **Gmail OAuth errors**: Fixed by using popup windows and proper error handling

### Gmail OAuth Error Fix

If you see "Access blocked" or "Error 403: access_denied" when clicking "Connect Gmail":

**Quick Fix (Recommended):**
Add these placeholder values to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback
```

This will show a proper error message instead of the Google OAuth error.

**Full Setup:** See `GMAIL_OAUTH_SETUP.md` for complete Gmail OAuth configuration.

### Email Sending Issues Fix

If "Send to Email" button doesn't work:

1. **Gmail API Method** (Recommended):
   - Connect your Gmail account first
   - Make sure Gmail OAuth is properly configured
   - Check that your email is added as a test user

2. **SMTP Method** (Fallback):
   - Add SMTP configuration to .env:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
   - For Gmail: Enable 2FA and generate App Password at https://myaccount.google.com/apppasswords

### Gmail Draft Creation Issues Fix

If "Create Gmail Drafts" button doesn't work:

1. **Check Gmail Connection**:
   - Make sure Gmail is connected (green status)
   - Verify Gmail OAuth is configured properly

2. **Check Job Selection**:
   - Make sure you have selected jobs
   - Jobs should have valid data (title, company, URL)

3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed API calls

### If buttons still don't work:

1. Check browser console for JavaScript errors
2. Ensure all dependencies are installed: `npm run install-deps`
3. Restart the development server: `npm run dev`
4. Clear browser cache and reload

## Development Notes

- The application uses mock job data as fallback when external APIs are unavailable
- Premium features work in demo mode without payment integration
- Gmail integration is optional and requires Google Cloud Console setup
- All core functionality works without external API keys
