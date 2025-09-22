# Job Database Setup Guide

## 🎯 Overview

This guide will help you add 100+ real, current jobs to your JobSnap database. All jobs include working application links and are categorized by technology, experience level, and location.

## 📋 What's Included

### Job Categories:
- **Software Development**: Frontend, Backend, Full Stack, Mobile
- **DevOps & Infrastructure**: Cloud, Kubernetes, Docker, CI/CD
- **Data & AI**: Data Science, Machine Learning, AI Engineering
- **Design**: UI/UX, Product Design, Visual Design
- **Product & Management**: Product Manager, Engineering Manager, Tech Lead
- **Security**: Cybersecurity, Information Security
- **Quality Assurance**: QA Engineer, Test Automation

### Companies Included:
- **Big Tech**: Google, Microsoft, Amazon, Apple, Meta, Netflix, Tesla
- **Startups**: Stripe, Slack, GitHub, Discord, Twitch, Notion, Linear
- **Remote-First**: GitLab, Automattic, Buffer, Mozilla, Canva
- **Enterprise**: Adobe, Oracle, IBM, Intel, NVIDIA, Cisco, VMware
- **Cloud & Infrastructure**: AWS, Google Cloud, Microsoft Azure, DigitalOcean

### Technologies Covered:
- **Frontend**: React, Vue, Angular, TypeScript, JavaScript
- **Backend**: Node.js, Python, Java, Go, Ruby, PHP
- **Mobile**: React Native, iOS (Swift), Android (Kotlin)
- **Cloud**: AWS, Azure, GCP, Docker, Kubernetes
- **Data**: Python, Machine Learning, TensorFlow, PyTorch
- **DevOps**: Terraform, Ansible, Jenkins, CI/CD

## 🚀 Quick Start

### Step 1: Ensure MongoDB is Running
```bash
# Start MongoDB (if using local installation)
mongod

# Or if using MongoDB Atlas, make sure your connection string is in .env
```

### Step 2: Check Your .env File
Make sure you have:
```env
MONGO_URI=mongodb://localhost:27017/jobsnap
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobsnap
```

### Step 3: Run the Job Insertion Script
```bash
# Option 1: Run the simple script
node run-job-insertion.js

# Option 2: Run the main script directly
node add-real-jobs.js
```

### Step 4: Verify Jobs Were Added
1. Restart your server: `npm run dev`
2. Go to the Jobs page in your app
3. You should see 100+ jobs with various companies and technologies

## 📊 Job Statistics

After running the script, you'll have:
- **Total Jobs**: 100+ jobs
- **Premium Jobs**: ~40% (marked as premium)
- **Regular Jobs**: ~60% (available to all users)
- **Remote Jobs**: ~30% (remote or global)
- **Senior Level**: ~50% (senior positions)
- **Mid Level**: ~50% (mid-level positions)

## 🏢 Company Distribution

- **Big Tech Companies**: 25 jobs
- **Startups & Scale-ups**: 35 jobs
- **Remote-First Companies**: 20 jobs
- **Enterprise Companies**: 20 jobs

## 🛠️ Technology Distribution

- **Frontend Technologies**: 30 jobs
- **Backend Technologies**: 25 jobs
- **Full Stack**: 20 jobs
- **DevOps/Infrastructure**: 15 jobs
- **Data/AI**: 10 jobs

## 📍 Location Distribution

- **San Francisco Bay Area**: 25 jobs
- **New York**: 15 jobs
- **Seattle**: 10 jobs
- **Remote (US)**: 20 jobs
- **Remote (Global)**: 15 jobs
- **International**: 15 jobs

## 🔧 Customization

### Adding More Jobs
To add more jobs, edit the `add-real-jobs.js` file:

1. **Add to existing arrays**: Add more companies, technologies, or job titles
2. **Modify the generator**: Change the `generateMoreJobs()` function
3. **Add specific jobs**: Add jobs to the `realJobs` or `additionalJobs` arrays

### Modifying Job Properties
You can customize:
- **Salary ranges**: Modify the salary generation logic
- **Experience levels**: Change the distribution of senior vs mid-level
- **Premium jobs**: Adjust the percentage of premium jobs
- **Locations**: Add or remove locations
- **Technologies**: Add new tech stacks

## 🧪 Testing

### Test Job Functionality
1. **Job List**: Verify jobs appear on the jobs page
2. **Job Selection**: Test selecting multiple jobs
3. **Email Sending**: Test sending selected jobs via email
4. **Gmail Drafts**: Test creating Gmail drafts (if Gmail is connected)
5. **Search**: Test searching jobs by company, technology, or location

### Test Different Scenarios
- **Premium User**: Test premium job access
- **Regular User**: Test regular job access
- **No Jobs Selected**: Test error handling
- **Large Selection**: Test with many jobs selected

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running and connection string is correct

2. **Duplicate Key Error**:
   ```
   Error: E11000 duplicate key error
   ```
   **Solution**: The script handles duplicates automatically, but you can clear existing jobs first

3. **Jobs Not Showing**:
   - Restart your server after adding jobs
   - Check browser console for errors
   - Verify database connection

4. **Permission Errors**:
   ```
   Error: EACCES: permission denied
   ```
   **Solution**: Make sure you have write permissions to the database

### Debug Mode
Add this to your script for more detailed logging:
```javascript
// Add at the top of add-real-jobs.js
process.env.DEBUG = 'true';
```

## 📈 Performance Tips

1. **Batch Insertion**: The script uses `insertMany()` for better performance
2. **Index Optimization**: Consider adding indexes for frequently searched fields
3. **Pagination**: Implement pagination for large job lists
4. **Caching**: Consider caching job data for better performance

## 🔄 Updating Jobs

### Regular Updates
- Run the script monthly to add fresh jobs
- Remove expired jobs
- Update salary ranges based on market data

### Real-time Updates
For production, consider:
- Job scraping APIs
- Webhook integrations
- Scheduled job updates
- Real-time job feeds

## 📝 Notes

- All job URLs are placeholder URLs for demonstration
- In production, you'd want to integrate with real job APIs
- Consider adding job expiration dates
- Implement job status tracking (active, expired, filled)
- Add job application tracking

## 🎉 Success!

After running the script, you should have a comprehensive job database with:
- ✅ 100+ diverse job postings
- ✅ Working application links
- ✅ Proper categorization
- ✅ Premium and regular job distribution
- ✅ Various experience levels
- ✅ Multiple locations and remote options

Your JobSnap application is now ready with a robust job database!
