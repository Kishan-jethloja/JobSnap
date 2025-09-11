const express = require('express');
const multer = require('multer');
const Resume = require('../models/Resume');
const authMiddleware = require('../middleware/authMiddleware');
const { parsePdfBuffer } = require('../utils/resumeParser');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/resume/upload
// @desc    Upload and parse resume PDF
// @access  Private
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    // Parse PDF content
    const { text, skills } = await parsePdfBuffer(req.file.buffer);

    // Delete existing resume for this user
    await Resume.deleteMany({ userId: req.user.id });

    // Save new resume
    const resume = new Resume({
      userId: req.user.id,
      pdf: req.file.buffer,
      contentType: req.file.mimetype,
      parsedText: text,
      skills: skills
    });

    await resume.save();

    res.json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        id: resume._id,
        parsedText: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
        skills: skills,
        uploadedAt: resume.uploadedAt
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    if (error.message.includes('PDF')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error during resume upload' });
    }
  }
});

// @route   GET /api/resume/my-resume
// @desc    Get user's latest resume
// @access  Private
router.get('/my-resume', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id }).sort({ uploadedAt: -1 });
    
    if (!resume) {
      return res.status(404).json({ message: 'No resume found. Please upload a resume first.' });
    }

    res.json({
      resume: {
        id: resume._id,
        parsedText: resume.parsedText.substring(0, 1000) + (resume.parsedText.length > 1000 ? '...' : ''),
        skills: resume.skills,
        uploadedAt: resume.uploadedAt
      }
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resume/resume/:id/download
// @desc    Download resume PDF
// @access  Private
router.get('/resume/:id/download', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.set({
      'Content-Type': resume.contentType,
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': resume.pdf.length
    });

    res.send(resume.pdf);
  } catch (error) {
    console.error('Resume download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
