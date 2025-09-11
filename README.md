# JobSnap - AI-Powered Resume-Based Job Recommender

JobSnap is a full-stack MERN application that uses AI to match your resume with the best remote job opportunities. Upload your PDF resume, get personalized job recommendations, and send selected jobs to your email with premium features.

## 🚀 Features

- **Smart Resume Parsing**: Upload PDF resumes and extract skills automatically using AI
- **Personalized Job Matching**: Get job recommendations tailored to your skills from Remotive API
- **Premium Email Feature**: Select multiple jobs and send them to your email with one click
- **Dark Theme UI**: Beautiful, responsive design with Tailwind CSS
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Premium Subscription**: Upgrade to unlock advanced features
- **Admin Dashboard**: Basic admin panel with system statistics

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction
- **NodeMailer** for email sending
- **Axios** for API requests

### Frontend
- **React.js** with React Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Heroicons** for icons
- **JWT-decode** for token handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Gmail account with App Password (for email features)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JobSnap
```

### 2. Server Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
MONGO_URI="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/jobsnapDB?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-make-it-long-and-secure"
PORT=5000
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your.email@gmail.com"
SMTP_PASS="your-gmail-app-password"
REMOTIVE_API="https://remotive.io/api/remote-jobs"
```

### 3. Client Setup
```bash
cd ../client
npm install
```

Create `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

**Build Client:**
```bash
cd client
npm run build
```

**Start Server:**
```bash
cd server
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Resume Management
- `POST /api/resume/upload` - Upload and parse PDF resume
- `GET /api/resume/my-resume` - Get user's resume
- `GET /api/resume/resume/:id/download` - Download resume PDF

### Job Management
- `GET /api/jobs/fetch` - Fetch jobs from Remotive API
- `POST /api/jobs/match` - Get personalized job matches
- `GET /api/jobs/search` - Search cached jobs

### Premium Features
- `POST /api/premium/upgrade` - Upgrade to premium
- `GET /api/premium/status` - Get premium status
- `POST /api/premium/cancel` - Cancel premium subscription

### Email Features (Premium Only)
- `POST /api/email/sendSelectedJobs` - Send selected jobs via email
- `GET /api/email/history` - Get email history
- `GET /api/email/stats` - Get admin statistics

## 🎯 Usage Guide

### 1. Getting Started
1. Register for a new account or login
2. Upload your PDF resume on the Resume page
3. Wait for the AI to parse your skills and experience

### 2. Finding Jobs
1. Go to the Jobs page to see personalized matches
2. Use the search feature to filter jobs
3. Click "Refresh Jobs" to fetch latest opportunities

### 3. Premium Features
1. Upgrade to Premium on the Premium page
2. Select jobs by checking the boxes (Premium only)
3. Click "Send to Email" to receive jobs in your inbox

### 4. Admin Access
- Login with email `admin@example.com` to access admin panel
- View system statistics and recent activity

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcrypt (12 salt rounds)
- Protected routes with authentication middleware
- Premium feature gating
- Input validation and sanitization
- CORS configuration for cross-origin requests

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `SMTP_PASS`

### Alternative SMTP Providers
- **SendGrid**: Replace SMTP settings with SendGrid configuration
- **AWS SES**: Configure AWS SES SMTP settings
- **Mailgun**: Use Mailgun SMTP configuration

## 🎨 UI Features

- **Dark Theme**: Modern dark theme with Tailwind CSS
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Components**: Hover effects, loading states, animations
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Professional Design**: Clean, modern interface with consistent styling

## 🔧 Customization

### Adding New Job Sources
1. Create new API integration in `server/routes/jobs.js`
2. Update job fetching logic to include new sources
3. Modify job matching algorithm as needed

### Extending Resume Parsing
1. Update `server/utils/resumeParser.js`
2. Add new skill extraction patterns
3. Implement additional parsing features

### Premium Features
1. Add new premium routes in `server/routes/premium.js`
2. Update frontend premium checks
3. Implement payment integration (Stripe/Razorpay)

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure IP address is whitelisted

**Email Not Sending:**
- Verify Gmail App Password is correct
- Check SMTP configuration
- Ensure 2FA is enabled on Gmail

**PDF Upload Issues:**
- Check file size (max 5MB)
- Ensure file is valid PDF format
- Verify multer configuration

**Job Matching Not Working:**
- Upload a resume first
- Check if resume parsing extracted skills
- Verify Remotive API is accessible

## 📝 Development Notes

### Code Structure
```
JobSnap/
├── server/                 # Backend Express.js application
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication & premium middleware
│   ├── utils/             # Utility functions (parser, mailer)
│   └── server.js          # Main server file
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (auth)
│   │   └── api/           # API integration
│   └── public/            # Static assets
└── README.md              # This file
```

### Environment Variables
- Never commit `.env` files to version control
- Use different configurations for development/production
- Rotate secrets regularly in production

### Database Design
- Users collection stores authentication and premium status
- Resumes collection stores PDF binary data and parsed content
- Jobs collection caches API responses with upsert logic
- Email logs track all sent emails for analytics

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Vercel/Netlify (Frontend)
1. Build the React app
2. Deploy the build folder
3. Configure API URL environment variable

### MongoDB Atlas
1. Create cluster and database
2. Configure network access
3. Get connection string for MONGO_URI

## 📈 Future Enhancements

- Real-time job alerts with WebSockets
- Advanced resume analysis with AI scoring
- Integration with LinkedIn and other job boards
- Mobile app with React Native
- Advanced analytics and reporting
- Team collaboration features
- Interview scheduling integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Remotive API for job data
- Tailwind CSS for styling framework
- Heroicons for beautiful icons
- MongoDB Atlas for database hosting
- All the open-source libraries that made this possible

---

**Note**: This is a demo application. For production use, implement proper payment processing, enhanced security measures, and comprehensive testing.
