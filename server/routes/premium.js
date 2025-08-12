const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Job = require('../models/Job');
const { auth, requirePremium } = require('../middleware/auth');

const router = express.Router();

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Mock upgrade to premium (for demo purposes)
router.post('/upgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.isPremium) {
      return res.status(400).json({ error: 'User is already premium.' });
    }

    // Mock premium upgrade - in real app, this would integrate with Stripe/Razorpay
    user.isPremium = true;
    user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await user.save();

    res.json({
      message: 'Successfully upgraded to premium!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        isPremiumActive: user.isPremiumActive(),
        premiumExpiresAt: user.premiumExpiresAt
      }
    });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ error: 'Error upgrading to premium.' });
  }
});

// Send selected jobs via email (premium feature)
router.post('/sendSelectedJobs', auth, requirePremium, async (req, res) => {
  try {
    const { jobIds, recipientEmail } = req.body;
    
    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ error: 'Please select at least one job.' });
    }

    if (!recipientEmail) {
      return res.status(400).json({ error: 'Recipient email is required.' });
    }

    // Get selected jobs
    const jobs = await Job.find({ _id: { $in: jobIds } });
    
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'No jobs found with the provided IDs.' });
    }

    // Create HTML email content
    const emailContent = createJobEmailHTML(jobs, req.user.name);

    // Send email
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: recipientEmail,
      subject: `JobSnap - ${jobs.length} Job${jobs.length > 1 ? 's' : ''} for You`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: `Successfully sent ${jobs.length} job${jobs.length > 1 ? 's' : ''} to ${recipientEmail}`,
      jobsSent: jobs.length
    });
  } catch (error) {
    console.error('Send jobs email error:', error);
    res.status(500).json({ error: 'Error sending jobs via email.' });
  }
});

// Get premium status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      isPremium: user.isPremium,
      isPremiumActive: user.isPremiumActive(),
      premiumExpiresAt: user.premiumExpiresAt
    });
  } catch (error) {
    console.error('Get premium status error:', error);
    res.status(500).json({ error: 'Error fetching premium status.' });
  }
});

// Create HTML email content for jobs
const createJobEmailHTML = (jobs, userName) => {
  const jobCards = jobs.map(job => `
    <div style="
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <h3 style="
        color: #2c3e50;
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: 600;
      ">${job.title}</h3>
      
      <p style="
        color: #7f8c8d;
        margin: 0 0 10px 0;
        font-size: 14px;
        font-weight: 500;
      ">${job.company}</p>
      
      ${job.location ? `<p style="
        color: #95a5a6;
        margin: 0 0 10px 0;
        font-size: 13px;
      ">📍 ${job.location}</p>` : ''}
      
      ${job.salary ? `<p style="
        color: #27ae60;
        margin: 0 0 10px 0;
        font-size: 13px;
        font-weight: 600;
      ">💰 ${job.salary}</p>` : ''}
      
      ${job.tags && job.tags.length > 0 ? `<div style="
        margin: 10px 0;
      ">
        ${job.tags.slice(0, 5).map(tag => `
          <span style="
            background-color: #3498db;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            margin-right: 5px;
            display: inline-block;
            margin-bottom: 5px;
          ">${tag}</span>
        `).join('')}
      </div>` : ''}
      
      <p style="
        color: #34495e;
        margin: 10px 0;
        font-size: 14px;
        line-height: 1.5;
      ">${job.description.substring(0, 200)}${job.description.length > 200 ? '...' : ''}</p>
      
      <a href="${job.url}" style="
        background-color: #3498db;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        font-weight: 500;
        font-size: 14px;
      ">Apply Now</a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JobSnap - Your Job Matches</title>
    </head>
    <body style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
    ">
      <div style="
        background-color: #ffffff;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      ">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="
            color: #2c3e50;
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
          ">JobSnap</h1>
          <p style="
            color: #7f8c8d;
            margin: 0;
            font-size: 16px;
          ">Your personalized job matches</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="
            color: #2c3e50;
            margin: 0 0 15px 0;
            font-size: 22px;
            font-weight: 600;
          ">Hello ${userName}!</h2>
          <p style="
            color: #34495e;
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
          ">
            We found ${jobs.length} amazing job${jobs.length > 1 ? 's' : ''} that match your skills and experience. 
            Check them out below and apply to the ones that interest you!
          </p>
        </div>
        
        <div style="margin-bottom: 30px;">
          ${jobCards}
        </div>
        
        <div style="
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 30px;
        ">
          <p style="
            color: #7f8c8d;
            margin: 0;
            font-size: 14px;
          ">
            💡 Tip: Make sure to customize your application for each position to increase your chances of getting hired!
          </p>
        </div>
        
        <div style="
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        ">
          <p style="
            color: #95a5a6;
            margin: 0;
            font-size: 12px;
          ">
            This email was sent by JobSnap. 
            <br>
            To stop receiving these emails, please contact support.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = router;
