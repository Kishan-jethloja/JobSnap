const express = require('express');
const axios = require('axios');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Fetch jobs from Remotive API and cache them
const fetchAndCacheJobs = async () => {
  try {
    const response = await axios.get('https://remotive.com/api/remote-jobs');
    const jobs = response.data.jobs || [];

    const jobsToSave = [];
    
    for (const job of jobs) {
      try {
        // Check if job already exists and is fresh
        const existingJob = await Job.findOne({ jobIdFromAPI: job.id.toString() });
        if (existingJob && existingJob.isFresh()) {
          continue; // Skip if job exists and is fresh
        }

        const jobData = {
          jobIdFromAPI: job.id.toString(),
          title: job.title,
          company: job.company_name,
          tags: job.tags || [],
          description: job.description,
          location: job.candidate_required_location,
          salary: job.salary,
          url: job.url,
          publishedAt: job.publication_date ? new Date(job.publication_date) : null,
          cachedAt: new Date()
        };

        if (existingJob) {
          // Update existing job
          Object.assign(existingJob, jobData);
          await existingJob.save();
        } else {
          // Create new job
          jobsToSave.push(jobData);
        }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
      }
    }

    if (jobsToSave.length > 0) {
      await Job.insertMany(jobsToSave);
      console.log(`Cached ${jobsToSave.length} new jobs`);
    }

    return true;
  } catch (error) {
    console.error('Error fetching jobs from Remotive:', error);
    return false;
  }
};

// Calculate job match score based on skills
const calculateMatchScore = (jobTags, userSkills) => {
  if (!userSkills || userSkills.length === 0) return 0;
  
  const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
  const jobTagsLower = jobTags.map(tag => tag.toLowerCase());
  
  let matches = 0;
  userSkillsLower.forEach(skill => {
    if (jobTagsLower.some(tag => tag.includes(skill) || skill.includes(tag))) {
      matches++;
    }
  });
  
  return (matches / userSkills.length) * 100;
};

// Get all jobs with optional filtering
router.get('/', auth, async (req, res) => {
  try {
    const { search, location, limit = 50, page = 1 } = req.body;
    
    // Try to fetch fresh jobs from API (don't wait for it)
    fetchAndCacheJobs().catch(console.error);

    // Build query
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Get user's skills for matching
    const userResume = await Resume.findOne({ userId: req.user._id });
    const userSkills = userResume ? userResume.skills : [];

    // Get jobs from database
    const skip = (page - 1) * limit;
    const jobs = await Job.find(query)
      .sort({ cachedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Calculate match scores and add to jobs
    const jobsWithScores = jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job.tags, userSkills)
    }));

    // Sort by match score (highest first) if user has skills
    if (userSkills.length > 0) {
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    }

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(query);

    res.json({
      jobs: jobsWithScores,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs,
        hasNextPage: skip + jobs.length < totalJobs,
        hasPrevPage: page > 1
      },
      userSkills
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Error fetching jobs.' });
  }
});

// Get matched jobs based on user's skills
router.get('/matched', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.body;
    
    // Get user's skills
    const userResume = await Resume.findOne({ userId: req.user._id });
    if (!userResume || !userResume.skills.length) {
      return res.status(404).json({ 
        error: 'No resume found or no skills extracted. Please upload a resume first.' 
      });
    }

    const userSkills = userResume.skills;

    // Get all jobs and calculate match scores
    const jobs = await Job.find({})
      .sort({ cachedAt: -1 })
      .limit(parseInt(limit) * 2) // Get more jobs to filter from
      .lean();

    // Calculate match scores and filter jobs with at least 20% match
    const matchedJobs = jobs
      .map(job => ({
        ...job,
        matchScore: calculateMatchScore(job.tags, userSkills)
      }))
      .filter(job => job.matchScore >= 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit));

    res.json({
      jobs: matchedJobs,
      userSkills,
      totalMatches: matchedJobs.length
    });
  } catch (error) {
    console.error('Get matched jobs error:', error);
    res.status(500).json({ error: 'Error fetching matched jobs.' });
  }
});

// Get job by ID
router.get('/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Get user's skills for match score
    const userResume = await Resume.findOne({ userId: req.user._id });
    const userSkills = userResume ? userResume.skills : [];
    const matchScore = calculateMatchScore(job.tags, userSkills);

    res.json({
      job: {
        ...job.toObject(),
        matchScore
      },
      userSkills
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Error fetching job details.' });
  }
});

// Force refresh jobs from API
router.post('/refresh', auth, async (req, res) => {
  try {
    const success = await fetchAndCacheJobs();
    
    if (success) {
      res.json({ message: 'Jobs refreshed successfully' });
    } else {
      res.status(500).json({ error: 'Failed to refresh jobs' });
    }
  } catch (error) {
    console.error('Refresh jobs error:', error);
    res.status(500).json({ error: 'Error refreshing jobs.' });
  }
});

module.exports = router;
