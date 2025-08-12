const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Extract skills from text using keyword matching
const extractSkills = (text) => {
  const commonSkills = [
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
    // Web Technologies
    'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Laravel', 'Spring',
    // Databases
    'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'CI/CD',
    // Data Science & ML
    'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
    // Mobile Development
    'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
    // Other Technologies
    'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'JIRA', 'Confluence'
  ];

  const extractedSkills = [];
  const lowerText = text.toLowerCase();

  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      extractedSkills.push(skill);
    }
  });

  // Also look for skill patterns like "skills:", "technologies:", etc.
  const skillPatterns = [
    /skills?[:\s]+([^.\n]+)/gi,
    /technologies?[:\s]+([^.\n]+)/gi,
    /programming languages?[:\s]+([^.\n]+)/gi,
    /frameworks?[:\s]+([^.\n]+)/gi,
    /tools?[:\s]+([^.\n]+)/gi
  ];

  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const skills = match.replace(/^(skills?|technologies?|programming languages?|frameworks?|tools?)[:\s]+/i, '');
        skills.split(/[,;|]/).forEach(skill => {
          const trimmedSkill = skill.trim();
          if (trimmedSkill && trimmedSkill.length > 2 && !extractedSkills.includes(trimmedSkill)) {
            extractedSkills.push(trimmedSkill);
          }
        });
      });
    }
  });

  return [...new Set(extractedSkills)]; // Remove duplicates
};

// Upload and parse resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file.' });
    }

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const parsedText = pdfData.text;
    
    // Extract skills
    const skills = extractSkills(parsedText);

    // Check if user already has a resume
    const existingResume = await Resume.findOne({ userId: req.user._id });
    
    if (existingResume) {
      // Update existing resume
      existingResume.pdfBuffer = req.file.buffer;
      existingResume.originalName = req.file.originalname;
      existingResume.parsedText = parsedText;
      existingResume.skills = skills;
      await existingResume.save();
      
      res.json({
        message: 'Resume updated successfully',
        skills,
        resumeId: existingResume._id
      });
    } else {
      // Create new resume
      const resume = new Resume({
        userId: req.user._id,
        pdfBuffer: req.file.buffer,
        originalName: req.file.originalname,
        parsedText,
        skills
      });

      await resume.save();

      res.status(201).json({
        message: 'Resume uploaded and parsed successfully',
        skills,
        resumeId: resume._id
      });
    }
  } catch (error) {
    console.error('Resume upload error:', error);
    if (error.message === 'Only PDF files are allowed') {
      return res.status(400).json({ error: 'Only PDF files are allowed.' });
    }
    res.status(500).json({ error: 'Error processing resume. Please try again.' });
  }
});

// Get user's resume and skills
router.get('/my-resume', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    
    if (!resume) {
      return res.status(404).json({ error: 'No resume found. Please upload a resume first.' });
    }

    res.json({
      skills: resume.skills,
      uploadedAt: resume.uploadedAt,
      originalName: resume.originalName
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Error fetching resume data.' });
  }
});

// Download resume (for premium users)
router.get('/download', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id });
    
    if (!resume) {
      return res.status(404).json({ error: 'No resume found.' });
    }

    res.set({
      'Content-Type': resume.contentType,
      'Content-Disposition': `attachment; filename="${resume.originalName}"`,
      'Content-Length': resume.pdfBuffer.length
    });

    res.send(resume.pdfBuffer);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ error: 'Error downloading resume.' });
  }
});

module.exports = router;
