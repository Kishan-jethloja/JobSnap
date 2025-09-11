# JobSnap Setup Guide

## Quick Start (Guaranteed to Work)

The application now includes **mock job data** that will always work, even without external APIs or database connections.

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```bash
# server/.env
MONGO_URI="mongodb://127.0.0.1:27017/jobsnapDB"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=5000
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your.email@gmail.com"
SMTP_PASS="your-app-password"
REMOTIVE_API="https://remotive.io/api/remote-jobs"
```

Create a `.env` file in the `client` directory:

```bash
# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Application

```bash
# Terminal 1 - Start the server
cd server
npm start

# Terminal 2 - Start the client
cd client
npm start
```

## Job Fetching Features

### Automatic Fallback System

The application uses a **multi-tier fallback system** for job fetching:

1. **Primary APIs**: Tries multiple job APIs (Adzuna, Remotive, JSearch)
2. **Mock Data**: If all APIs fail, uses 15 realistic job listings
3. **Cached Jobs**: Shows previously fetched jobs from database
4. **Error Handling**: Graceful degradation with user-friendly messages

### Mock Job Data

The application includes 15 realistic job listings covering:
- Full Stack Development
- Frontend/Backend Development
- DevOps & Cloud Architecture
- Data Science & Machine Learning
- Mobile Development
- UI/UX Design
- Cybersecurity
- Product Management
- QA Engineering
- Database Administration
- Blockchain Development

### API Integration (Optional)

For live job data, you can optionally set up:

1. **Adzuna API** (Free tier available)
   - Sign up at https://developer.adzuna.com/
   - Add `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` to server/.env

2. **RapidAPI JSearch** (Free tier available)
   - Sign up at https://rapidapi.com/
   - Subscribe to JSearch API
   - Add `RAPIDAPI_KEY` to server/.env

## Database Setup (Optional)

### MongoDB (Recommended)

```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGO_URI in server/.env
```

### Without Database

The application will work without MongoDB - it will just show fresh mock data each time.

## Features That Work Without Setup

- ✅ Job listing and display
- ✅ Job search and filtering
- ✅ Mock job data (15 realistic jobs)
- ✅ Responsive UI
- ✅ Job card components
- ✅ Error handling

## Features That Need Setup

- 🔧 User authentication (needs JWT_SECRET)
- 🔧 Resume upload (needs database)
- 🔧 Job matching (needs resume + database)
- 🔧 Email functionality (needs SMTP settings)
- 🔧 Premium features (needs database)

## Troubleshooting

### "Failed to fetch jobs" Error

This should no longer occur as the app now uses mock data as fallback. If you still see this:

1. Check if the server is running on port 5000
2. Verify the client is connecting to the right API URL
3. Check browser console for detailed error messages

### No Jobs Displayed

The app should always show jobs (either from APIs or mock data). If not:

1. Check server logs for errors
2. Verify the `/api/jobs/fetch` endpoint is working
3. Try the "Refresh Jobs" button

### Database Connection Issues

The app works without a database connection. Jobs will be fetched fresh each time instead of being cached.

## Development Notes

- The server runs on port 5000
- The client runs on port 3000
- Mock data is regenerated with current timestamps
- All external API calls have 10-second timeouts
- Graceful error handling throughout the application
