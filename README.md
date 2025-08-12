# JobSnap - AI-Powered Job Matching Platform

JobSnap is a full-stack MERN application that helps users find their dream jobs by analyzing their resumes and matching them with relevant job opportunities from the Remotive API.

## 🚀 Features

### Core Features
- **Resume Upload & Analysis**: Drag-and-drop PDF resume upload with AI-powered skill extraction
- **Smart Job Matching**: Automatic matching of user skills with job requirements
- **Real-time Job Listings**: Integration with Remotive API for live job data
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Mobile-first design that works on all devices

### Premium Features
- **Multi-Job Selection**: Select multiple jobs for comparison
- **Email Job Sharing**: Send selected jobs via beautifully formatted emails
- **Priority Job Matching**: Get first access to new job opportunities
- **Advanced Filters**: Enhanced search and filtering capabilities

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **nodemailer** - Email functionality
- **axios** - HTTP client for API calls

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **react-dropzone** - Drag-and-drop file upload
- **CSS3** - Styling with modern design

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JobSnap
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/jobsnap

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for premium features)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For email functionality, you'll need to:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the EMAIL_PASS field

### 3. Frontend Setup

Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

### 4. Start the Application

#### Development Mode

**Start the backend server:**
```bash
cd server
npm run dev
```

**Start the frontend development server:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Production Mode

**Build the frontend:**
```bash
cd client
npm run build
```

**Start the production server:**
```bash
cd server
npm start
```

## 📁 Project Structure

```
JobSnap/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Resume Management
- `POST /api/resume/upload` - Upload and parse resume
- `GET /api/resume/my-resume` - Get user's resume data
- `GET /api/resume/download` - Download resume (premium)

### Job Management
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/matched` - Get matched jobs based on skills
- `GET /api/jobs/:jobId` - Get specific job details
- `POST /api/jobs/refresh` - Refresh jobs from API

### Premium Features
- `POST /api/premium/upgrade` - Upgrade to premium
- `POST /api/premium/sendSelectedJobs` - Send selected jobs via email
- `GET /api/premium/status` - Get premium status

## 🎯 Usage Guide

### 1. Getting Started
1. Register a new account or login with existing credentials
2. Upload your PDF resume using the drag-and-drop interface
3. View extracted skills and matched jobs on your dashboard

### 2. Job Search
1. Navigate to "Job Listings" to browse all available jobs
2. Use search and location filters to find specific opportunities
3. View match percentages for each job based on your skills

### 3. Premium Features
1. Upgrade to premium to unlock advanced features
2. Select multiple jobs using checkboxes
3. Send selected jobs via email for easy reference

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: PDF-only uploads with size limits
- **CORS Protection**: Configured for secure cross-origin requests

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app
3. Set environment variables in Heroku dashboard
4. Deploy using Git:
```bash
heroku git:remote -a your-app-name
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your preferred hosting service

### Database Setup
- Use MongoDB Atlas for cloud database hosting
- Update the `MONGODB_URI` in your environment variables

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section below
2. Search existing issues in the repository
3. Create a new issue with detailed information

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check if the database name in the connection string matches your setup

**Email Not Sending**
- Verify your Gmail credentials in the environment variables
- Ensure 2-factor authentication is enabled and App Password is generated
- Check if your email provider allows less secure app access

**PDF Upload Issues**
- Ensure the file is a valid PDF
- Check file size (max 5MB)
- Verify the PDF contains selectable text (not scanned images)

**JWT Token Issues**
- Clear browser localStorage and try logging in again
- Check if the JWT_SECRET is properly set in environment variables

## 🎉 Acknowledgments

- [Remotive API](https://remotive.com/api/) for job data
- [React Dropzone](https://react-dropzone.js.org/) for file upload functionality
- [PDF Parse](https://www.npmjs.com/package/pdf-parse) for PDF text extraction

---

**JobSnap** - Find your dream job with AI-powered matching! 🚀
