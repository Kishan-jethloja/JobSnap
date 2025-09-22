const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

class GmailService {
  constructor() {
    // Validate environment variables on startup
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn('⚠️  Gmail OAuth credentials not configured. Gmail features will be disabled.');
      this.isConfigured = false;
      return;
    }
    
    if (process.env.GOOGLE_CLIENT_ID.includes('your-google-client-id') ||
        process.env.GOOGLE_CLIENT_SECRET.includes('your-google-client-secret')) {
      console.warn('⚠️  Gmail OAuth credentials are placeholder values. Please configure real credentials.');
      this.isConfigured = false;
      return;
    }

    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/gmail/callback'
    );
    this.isConfigured = true;
    console.log('✅ Gmail OAuth service initialized successfully');
  }

  // Generate OAuth URL for user authentication
  getAuthUrl() {
    if (!this.isConfigured) {
      throw new Error('Gmail OAuth not configured. Please set up Google Cloud credentials in .env file. See CONFIGURATION_GUIDE.md for instructions.');
    }

    console.log('🔑 Generating Gmail OAuth URL...');

    const scopes = [
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    console.log('🔗 Generated OAuth URL:', authUrl);
    return authUrl;
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    console.log('🔄 Exchanging authorization code for tokens...');
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      console.log('✅ Successfully obtained tokens:', {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        expiryDate: tokens.expiry_date
      });
      return tokens;
    } catch (error) {
      console.error('❌ Failed to exchange code for tokens:', error.message);
      throw error;
    }
  }

  // Set credentials for authenticated requests
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Create Gmail API instance
  getGmailAPI() {
    return google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  // Generate professional email content for job applications
  generateJobApplicationEmail(job, userProfile) {
    const subject = `Application for ${job.title} at ${job.company}`;
    
    const emailBody = `Dear Hiring Manager,

I hope this email finds you well. I am writing to express my strong interest in the ${job.title} position at ${job.company}.

${userProfile.name ? `My name is ${userProfile.name}, and I am` : 'I am'} a passionate professional with experience in ${job.requiredSkills ? job.requiredSkills.slice(0, 3).join(', ') : 'relevant technologies'}. I believe my skills and experience make me an excellent candidate for this role.

Key highlights of my background:
${job.requiredSkills ? job.requiredSkills.slice(0, 5).map(skill => `• Proficient in ${skill}`).join('\n') : '• Strong technical background\n• Problem-solving abilities\n• Team collaboration skills'}

I am particularly drawn to this opportunity because:
• The role aligns perfectly with my career goals
• ${job.company} has an excellent reputation in the industry
• The position offers exciting challenges and growth opportunities

${job.location ? `I am ${job.location.includes('Remote') ? 'available for remote work' : `available to work in ${job.location}`}.` : ''}

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${userProfile.name || '[Your Name]'}
${userProfile.email || '[Your Email]'}
${userProfile.phone || '[Your Phone]'}

---
Job Details:
Position: ${job.title}
Company: ${job.company}
Location: ${job.location || 'Not specified'}
${job.salary ? `Salary: ${job.salary}` : ''}
${job.jobUrl ? `Job URL: ${job.jobUrl}` : ''}`;

    return { subject, body: emailBody };
  }

  // Create email draft in Gmail
  async createDraft(subject, body, userEmail) {
    try {
      console.log('📧 Creating Gmail draft:', { subject, userEmail });
      const gmail = this.getGmailAPI();
      
      // Create the email message
      const message = [
        `To: ${userEmail}`,
        `Subject: ${subject}`,
        '',
        body
      ].join('\n');

      // Encode the message
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      console.log('📤 Sending draft to Gmail API...');
      // Create draft
      const draft = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: encodedMessage
          }
        }
      });

      console.log('✅ Draft created successfully:', draft.data.id);
      return draft.data;
    } catch (error) {
      console.error('❌ Error creating Gmail draft:', error.message);
      console.error('Full error:', error);
      throw new Error(`Failed to create Gmail draft: ${error.message}`);
    }
  }

  // Create multiple drafts for selected jobs
  async createJobApplicationDrafts(jobs, userProfile, userEmail) {
    const results = [];
    
    for (const job of jobs) {
      try {
        const { subject, body } = this.generateJobApplicationEmail(job, userProfile);
        const draft = await this.createDraft(subject, body, userEmail);
        
        results.push({
          jobId: job.apiJobId || job._id,
          jobTitle: job.title,
          company: job.company,
          draftId: draft.id,
          success: true
        });
      } catch (error) {
        results.push({
          jobId: job.apiJobId || job._id,
          jobTitle: job.title,
          company: job.company,
          error: error.message,
          success: false
        });
      }
    }

    return results;
  }

  // Get user's Gmail profile
  async getUserProfile() {
    try {
      const gmail = this.getGmailAPI();
      const profile = await gmail.users.getProfile({ userId: 'me' });
      return profile.data;
    } catch (error) {
      console.error('Error getting Gmail profile:', error);
      throw new Error('Failed to get Gmail profile');
    }
  }

  // List user's drafts
  async listDrafts() {
    try {
      const gmail = this.getGmailAPI();
      const drafts = await gmail.users.drafts.list({ userId: 'me' });
      return drafts.data.drafts || [];
    } catch (error) {
      console.error('Error listing Gmail drafts:', error);
      throw new Error('Failed to list Gmail drafts');
    }
  }
}

module.exports = new GmailService();
