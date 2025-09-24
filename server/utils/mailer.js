const nodemailer = require('nodemailer');
const gmailService = require('./gmailService');
const GmailAuth = require('../models/GmailAuth');
const Resume = require('../models/Resume');

// Create transporter
const createTransporter = () => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP configuration is missing. Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS in your .env file.');
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendSelectedJobsEmail = async ({ to, jobs, userName, userId = null }) => {
  try {
    // Try to load user's resume for attachment (if available)
    let resumeDoc = null;
    if (userId) {
      try {
        resumeDoc = await Resume.findOne({ userId });
      } catch (_) {}
    }
    // Try Gmail first if user has Gmail connected
    if (userId) {
      try {
        const gmailAuth = await GmailAuth.findOne({ userId, isActive: true });
        if (gmailAuth && !gmailAuth.isTokenExpired()) {
          console.log('📧 Sending email via Gmail API...');
          return await sendEmailViaGmail({ to, jobs, userName, gmailAuth });
        }
      } catch (gmailError) {
        console.log('Gmail sending failed, falling back to SMTP:', gmailError.message);
      }
    }

    // Fallback to SMTP
    console.log('📧 Sending email via SMTP...');
    const transporter = createTransporter();

    // Generate job list HTML
    const jobListHtml = jobs.map(job => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h3 style="margin: 0 0 8px 0; color: #333;">
          <a href="${job.url}" target="_blank" style="color: #4f46e5; text-decoration: none;">${job.title}</a>
        </h3>
        <p style="margin: 0; color: #666; font-weight: 500;">${job.company}</p>
        <a href="${job.url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Apply Now</a>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Selected Jobs from JobSnap</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin-bottom: 10px;">🎯 JobSnap</h1>
          <p style="color: #666; margin: 0;">Your Personalized Job Recommendations</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333;">Hi ${userName}!</h2>
          <p>Here are the ${jobs.length} job${jobs.length > 1 ? 's' : ''} you selected from your personalized recommendations:</p>
        </div>

        <div style="margin-bottom: 30px;">
          ${jobListHtml}
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
          <p>This email was sent by JobSnap - Your AI-powered job recommender</p>
          <p>
            <a href="#" style="color: #4f46e5; text-decoration: none;">Unsubscribe</a> | 
            <a href="#" style="color: #4f46e5; text-decoration: none;">Update Preferences</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"JobSnap" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `🎯 ${jobs.length} Job Recommendations from JobSnap`,
      html: htmlContent,
      attachments: resumeDoc && resumeDoc.pdf ? [{
        filename: 'resume.pdf',
        content: resumeDoc.pdf,
        contentType: resumeDoc.contentType || 'application/pdf'
      }] : []
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send email via Gmail API
const sendEmailViaGmail = async ({ to, jobs, userName, gmailAuth }) => {
  try {
    // Set credentials
    gmailService.setCredentials(gmailAuth.getTokenData());

    // Generate job list HTML
    const jobListHtml = jobs.map(job => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h3 style="margin: 0 0 8px 0; color: #333;">
          <a href="${job.url}" target="_blank" style="color: #4f46e5; text-decoration: none;">${job.title}</a>
        </h3>
        <p style="margin: 0; color: #666; font-weight: 500;">${job.company}</p>
        <a href="${job.url}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">Apply Now</a>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Selected Jobs from JobSnap</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; margin-bottom: 10px;">🎯 JobSnap</h1>
          <p style="color: #666; margin: 0;">Your Personalized Job Recommendations</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333;">Hi ${userName}!</h2>
          <p>Here are the ${jobs.length} job${jobs.length > 1 ? 's' : ''} you selected from your personalized recommendations:</p>
        </div>

        <div style="margin-bottom: 30px;">
          ${jobListHtml}
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
          <p>This email was sent by JobSnap - Your AI-powered job recommender</p>
          <p>
            <a href="#" style="color: #4f46e5; text-decoration: none;">Unsubscribe</a> | 
            <a href="#" style="color: #4f46e5; text-decoration: none;">Update Preferences</a>
          </p>
        </div>
      </body>
      </html>
    `;

    // Try to include resume as attachment if available
    let resumeDoc = null;
    try {
      // gmailAuth is tied to a user; we need userId to fetch resume, but gmail route passes gmailAuth only.
      // Fallback: gmailAuth.userId is not populated here; skip if not available.
      // We'll attach via SMTP path above; here we attach only if middleware later passes resume data.
    } catch (_) {}

    // Build MIME message (multipart/mixed) so we can support attachments in Gmail
    const boundary = 'jobsnap_boundary_' + Date.now();
    const messageParts = [
      `To: ${to}`,
      `Subject: 🎯 ${jobs.length} Job Recommendations from JobSnap`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="' + boundary + '"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlContent
    ];

    // We currently do not have resume buffer in this scope (no userId); keeping without attachment for Gmail path
    messageParts.push(`--${boundary}--`);

    const message = messageParts.join('\n');

    // Encode the message
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email via Gmail API
    const gmail = gmailService.getGmailAPI();
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log('✅ Email sent via Gmail API:', result.data.id);
    
    return {
      success: true,
      messageId: result.data.id,
      method: 'gmail'
    };
  } catch (error) {
    console.error('Gmail email sending error:', error);
    throw new Error(`Failed to send email via Gmail: ${error.message}`);
  }
};

module.exports = {
  sendSelectedJobsEmail
};
