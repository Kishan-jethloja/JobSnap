const express = require('express');
const axios = require('axios');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Mock job data as fallback
const mockJobs = [
  {
    id: 'mock-1',
    title: 'Senior Full Stack Developer',
    company_name: 'TechCorp Inc.',
    url: 'https://example.com/job/1',
    description: 'We are looking for a Senior Full Stack Developer with experience in React, Node.js, and MongoDB. You will be responsible for developing and maintaining web applications, working with cross-functional teams, and mentoring junior developers.',
    tags: ['react', 'nodejs', 'mongodb', 'javascript', 'fullstack'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-2',
    title: 'Frontend React Developer',
    company_name: 'StartupXYZ',
    url: 'https://example.com/job/2',
    description: 'Join our dynamic team as a Frontend React Developer. You will build responsive user interfaces, optimize application performance, and collaborate with designers and backend developers.',
    tags: ['react', 'javascript', 'css', 'html', 'frontend'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-3',
    title: 'Backend Node.js Developer',
    company_name: 'CloudSolutions Ltd',
    url: 'https://example.com/job/3',
    description: 'We need a Backend Node.js Developer to design and implement server-side logic, develop APIs, and ensure high performance and responsiveness of applications.',
    tags: ['nodejs', 'express', 'mongodb', 'api', 'backend'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-4',
    title: 'DevOps Engineer',
    company_name: 'InfraTech Solutions',
    url: 'https://example.com/job/4',
    description: 'Looking for a DevOps Engineer to manage cloud infrastructure, implement CI/CD pipelines, and ensure system reliability and scalability.',
    tags: ['devops', 'aws', 'docker', 'kubernetes', 'ci/cd'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-5',
    title: 'Python Data Scientist',
    company_name: 'DataAnalytics Pro',
    url: 'https://example.com/job/5',
    description: 'Join our data science team to analyze large datasets, build machine learning models, and provide insights to drive business decisions.',
    tags: ['python', 'machine-learning', 'data-science', 'pandas', 'tensorflow'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-6',
    title: 'Mobile App Developer (React Native)',
    company_name: 'MobileFirst Inc',
    url: 'https://example.com/job/6',
    description: 'Develop cross-platform mobile applications using React Native. Work with product managers and designers to create amazing user experiences.',
    tags: ['react-native', 'mobile', 'javascript', 'ios', 'android'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-7',
    title: 'UI/UX Designer',
    company_name: 'DesignStudio Creative',
    url: 'https://example.com/job/7',
    description: 'Create intuitive and visually appealing user interfaces. Conduct user research, create wireframes, and collaborate with development teams.',
    tags: ['ui/ux', 'figma', 'design', 'user-research', 'prototyping'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-8',
    title: 'Cybersecurity Specialist',
    company_name: 'SecureNet Systems',
    url: 'https://example.com/job/8',
    description: 'Protect our systems and data from cyber threats. Implement security measures, conduct vulnerability assessments, and respond to security incidents.',
    tags: ['cybersecurity', 'penetration-testing', 'security', 'networking', 'compliance'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-9',
    title: 'Software Engineer - Java',
    company_name: 'Enterprise Solutions Corp',
    url: 'https://example.com/job/9',
    description: 'Develop enterprise-level applications using Java, Spring Boot, and microservices architecture. Work with large-scale distributed systems.',
    tags: ['java', 'spring-boot', 'microservices', 'enterprise', 'backend'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-10',
    title: 'Product Manager',
    company_name: 'Innovation Labs',
    url: 'https://example.com/job/10',
    description: 'Lead product development from conception to launch. Work with engineering, design, and marketing teams to deliver exceptional products.',
    tags: ['product-management', 'strategy', 'agile', 'leadership', 'analytics'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-11',
    title: 'Machine Learning Engineer',
    company_name: 'AI Innovations Inc',
    url: 'https://example.com/job/11',
    description: 'Build and deploy machine learning models at scale. Work with TensorFlow, PyTorch, and cloud platforms to solve complex problems.',
    tags: ['machine-learning', 'tensorflow', 'pytorch', 'python', 'ai'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-12',
    title: 'Cloud Architect',
    company_name: 'CloudTech Solutions',
    url: 'https://example.com/job/12',
    description: 'Design and implement cloud infrastructure solutions using AWS, Azure, and GCP. Ensure scalability, security, and cost optimization.',
    tags: ['cloud', 'aws', 'azure', 'gcp', 'architecture'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-13',
    title: 'QA Automation Engineer',
    company_name: 'QualityFirst Tech',
    url: 'https://example.com/job/13',
    description: 'Develop automated testing frameworks and ensure software quality. Work with Selenium, Cypress, and CI/CD pipelines.',
    tags: ['qa', 'automation', 'selenium', 'cypress', 'testing'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-14',
    title: 'Database Administrator',
    company_name: 'DataCore Systems',
    url: 'https://example.com/job/14',
    description: 'Manage and optimize database systems. Ensure data integrity, performance, and security across MySQL, PostgreSQL, and MongoDB.',
    tags: ['database', 'mysql', 'postgresql', 'mongodb', 'dba'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-15',
    title: 'Blockchain Developer',
    company_name: 'CryptoTech Ventures',
    url: 'https://example.com/job/15',
    description: 'Develop decentralized applications and smart contracts. Work with Ethereum, Solidity, and Web3 technologies.',
    tags: ['blockchain', 'ethereum', 'solidity', 'web3', 'cryptocurrency'],
    publication_date: new Date().toISOString()
  }
];

// Function to try multiple job APIs
async function fetchJobsFromAPIs(search, limit) {
  const apis = [
    // Try Adzuna API (free tier available)
    async () => {
      const response = await axios.get('https://api.adzuna.com/v1/api/jobs/us/search/1', {
        params: { 
          app_id: 'test', // You can get a free API key from adzuna.com
          app_key: 'test',
          results_per_page: Math.min(limit, 20),
          what: search || 'developer'
        },
        timeout: 10000,
        headers: { 'User-Agent': 'JobSnap/1.0' }
      });
      return response.data.results?.map(job => ({
        id: job.id,
        title: job.title,
        company_name: job.company?.display_name || 'Unknown Company',
        url: job.redirect_url || '#',
        description: job.description || '',
        tags: job.category?.tag ? [job.category.tag] : [],
        publication_date: job.created
      })) || [];
    },
    // Try Remotive API
    async () => {
      const apiUrl = process.env.REMOTIVE_API || 'https://remotive.io/api/remote-jobs';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('limit', limit);
      
      const response = await axios.get(`${apiUrl}?${params.toString()}`, {
        timeout: 10000,
        headers: { 'User-Agent': 'JobSnap/1.0', 'Accept': 'application/json' }
      });
      return response.data.jobs || [];
    },
    // Try JSearch API (RapidAPI - has free tier)
    async () => {
      if (!process.env.RAPIDAPI_KEY) {
        throw new Error('No RapidAPI key available');
      }
      const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: {
          query: search || 'developer',
          page: '1',
          num_pages: '1'
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        timeout: 10000
      });
      return response.data.data?.map(job => ({
        id: job.job_id,
        title: job.job_title,
        company_name: job.employer_name,
        url: job.job_apply_link || '#',
        description: job.job_description || '',
        tags: job.job_employment_type ? [job.job_employment_type.toLowerCase()] : [],
        publication_date: job.job_posted_at_datetime_utc
      })) || [];
    }
  ];

  // Try each API in sequence
  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`Trying job API ${i + 1}...`);
      const jobs = await apis[i]();
      if (jobs && jobs.length > 0) {
        console.log(`✅ Successfully fetched ${jobs.length} jobs from API ${i + 1}`);
        return jobs;
      }
    } catch (error) {
      console.log(`❌ API ${i + 1} failed: ${error.message}`);
      continue;
    }
  }

  // If all APIs fail, return mock data
  console.log('🔄 All APIs failed, using mock data');
  return mockJobs.slice(0, limit);
}

// @route   GET /api/jobs/fetch
// @desc    Fetch jobs from multiple APIs with fallback to mock data
// @access  Public
router.get('/fetch', async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;
    
    console.log(`Fetching jobs with search: "${search}", limit: ${limit}`);

    // Try to fetch from multiple APIs
    const remoteJobs = await fetchJobsFromAPIs(search, limit);
    const savedJobs = [];

    // Process and save jobs
    for (const job of remoteJobs) {
      try {
        const jobData = {
          apiJobId: job.id.toString(),
          title: job.title || 'No Title',
          company: job.company_name || job.company || 'Unknown Company',
          url: job.url || '#',
          applicationUrl: job.job_apply_link || job.redirect_url || job.url || '#',
          description: job.description || '',
          tags: Array.isArray(job.tags) ? job.tags : [],
          location: job.location || job.job_city || job.candidate_required_location || '',
          salary: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : '',
          jobType: job.job_employment_type || 'Full-time',
          experienceLevel: job.job_experience_required_display || 'Mid-level',
          publication_date: job.publication_date ? new Date(job.publication_date) : new Date(),
          cachedAt: new Date(),
          isPremiumJob: false
        };

        // Upsert job (update if exists, create if not)
        const savedJob = await Job.findOneAndUpdate(
          { apiJobId: jobData.apiJobId },
          jobData,
          { upsert: true, new: true }
        );

        savedJobs.push(savedJob);
      } catch (jobError) {
        console.error(`Error saving job ${job.id}:`, jobError);
      }
    }

    res.json({
      message: `Fetched and cached ${savedJobs.length} jobs`,
      jobs: savedJobs,
      total: savedJobs.length,
      source: savedJobs.length > 0 ? 'api' : 'mock'
    });
  } catch (error) {
    console.error('Job fetch error:', error);
    
    // Even if there's an error, try to return mock data
    try {
      const mockJobsData = mockJobs.slice(0, parseInt(req.query.limit) || 50);
      const savedJobs = [];

      for (const job of mockJobsData) {
        const jobData = {
          apiJobId: job.id.toString(),
          title: job.title,
          company: job.company_name,
          url: job.url,
          applicationUrl: job.url,
          description: job.description,
          tags: job.tags,
          location: '',
          salary: '',
          jobType: 'Full-time',
          experienceLevel: 'Mid-level',
          publication_date: new Date(job.publication_date),
          cachedAt: new Date(),
          isPremiumJob: false
        };

        const savedJob = await Job.findOneAndUpdate(
          { apiJobId: jobData.apiJobId },
          jobData,
          { upsert: true, new: true }
        );

        savedJobs.push(savedJob);
      }

      res.json({
        message: `Using sample jobs (${savedJobs.length} jobs loaded)`,
        jobs: savedJobs,
        total: savedJobs.length,
        source: 'fallback'
      });
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      res.status(500).json({ 
        message: 'Server error while fetching jobs', 
        error: error.message 
      });
    }
  }
});
// @route   GET /api/jobs/search
// @desc    Search cached jobs
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      query = {
        $or: [
          { title: searchRegex },
          { company: searchRegex },
          { description: searchRegex },
          { tags: { $in: [searchRegex] } }
        ]
      };
    }

    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(query)
      .sort({ cachedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ message: 'Server error while searching jobs' });
  }
});

// @route   GET /api/jobs/all
// @desc    Get all cached jobs (fallback when no matches)
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find({})
      .sort({ cachedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments({});

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// @route   POST /api/jobs/match
// @desc    Trigger job matching based on user resume
// @access  Private
router.post('/match', authMiddleware, async (req, res) => {
  try {
    // This endpoint triggers the matching process
    // The actual matching logic is in the GET /match endpoint
    res.json({
      message: 'Job matching triggered successfully',
      success: true
    });
  } catch (error) {
    console.error('Job matching trigger error:', error);
    res.status(500).json({ message: 'Server error while triggering job matching' });
  }
});

// @route   GET /api/jobs/match
// @desc    Get skill-matched jobs based on user resume
// @access  Private
router.get('/match', authMiddleware, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    // Get user's resume to extract skills
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume || !resume.skills || resume.skills.length === 0) {
      // If no resume or skills, return all jobs
      const jobs = await Job.find({})
        .sort({ cachedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Job.countDocuments({});
      
      return res.json({
        jobs: jobs.map(job => ({ ...job.toObject(), matchPercentage: 0, matchedSkills: [] })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // Extract and normalize user skills
    const userSkills = resume.skills.map(skill => skill.toLowerCase().trim());
    
    // Skill variations mapping for better matching
    const skillVariations = {
      'javascript': ['js', 'javascript', 'ecmascript'],
      'typescript': ['ts', 'typescript'],
      'node.js': ['nodejs', 'node', 'node.js'],
      'react.js': ['react', 'reactjs', 'react.js'],
      'vue.js': ['vue', 'vuejs', 'vue.js'],
      'angular': ['angular', 'angularjs'],
      'python': ['python', 'py'],
      'java': ['java'],
      'c++': ['cpp', 'c++', 'cplusplus'],
      'c#': ['csharp', 'c#', 'dotnet'],
      'php': ['php'],
      'ruby': ['ruby', 'rb'],
      'go': ['golang', 'go'],
      'rust': ['rust'],
      'swift': ['swift'],
      'kotlin': ['kotlin'],
      'mongodb': ['mongo', 'mongodb'],
      'postgresql': ['postgres', 'postgresql'],
      'mysql': ['mysql'],
      'redis': ['redis'],
      'docker': ['docker', 'containerization'],
      'kubernetes': ['k8s', 'kubernetes'],
      'aws': ['aws', 'amazon web services'],
      'azure': ['azure', 'microsoft azure'],
      'gcp': ['gcp', 'google cloud'],
      'git': ['git', 'version control'],
      'html': ['html', 'html5'],
      'css': ['css', 'css3'],
      'sass': ['sass', 'scss'],
      'webpack': ['webpack'],
      'express': ['express', 'expressjs'],
      'django': ['django'],
      'flask': ['flask'],
      'spring': ['spring', 'spring boot'],
      'laravel': ['laravel'],
      'rails': ['rails', 'ruby on rails']
    };

    // Get all jobs
    const allJobs = await Job.find({}).sort({ cachedAt: -1 });
    
    // Calculate match scores for each job
    const jobsWithScores = allJobs.map(job => {
      let matchScore = 0;
      let matchedSkills = [];
      const maxScore = 100;

      // Check job tags (exact matches get higher score)
      if (job.tags && job.tags.length > 0) {
        job.tags.forEach(tag => {
          const normalizedTag = tag.toLowerCase().trim();
          
          // Direct skill match
          if (userSkills.includes(normalizedTag)) {
            matchScore += 5;
            if (!matchedSkills.includes(tag)) {
              matchedSkills.push(tag);
            }
          } else {
            // Check skill variations
            for (const [baseSkill, variations] of Object.entries(skillVariations)) {
              if (variations.includes(normalizedTag) && userSkills.some(skill => variations.includes(skill))) {
                matchScore += 5;
                if (!matchedSkills.includes(tag)) {
                  matchedSkills.push(tag);
                }
                break;
              }
            }
          }
        });
      }

      // Check job title for skill mentions
      if (job.title) {
        const titleWords = job.title.toLowerCase().split(/[\s,.-]+/);
        titleWords.forEach(word => {
          if (userSkills.includes(word)) {
            matchScore += 4;
            if (!matchedSkills.includes(word)) {
              matchedSkills.push(word);
            }
          } else {
            // Check variations in title
            for (const [baseSkill, variations] of Object.entries(skillVariations)) {
              if (variations.includes(word) && userSkills.some(skill => variations.includes(skill))) {
                matchScore += 4;
                if (!matchedSkills.includes(word)) {
                  matchedSkills.push(word);
                }
                break;
              }
            }
          }
        });
      }

      // Check job description for skill mentions (partial matches)
      if (job.description) {
        const descriptionWords = job.description.toLowerCase().split(/[\s,.-]+/);
        userSkills.forEach(skill => {
          if (descriptionWords.includes(skill)) {
            matchScore += 2;
            if (!matchedSkills.includes(skill)) {
              matchedSkills.push(skill);
            }
          }
        });
      }

      // Bonus for multiple skill matches
      if (matchedSkills.length > 3) {
        matchScore += 10;
      } else if (matchedSkills.length > 1) {
        matchScore += 5;
      }

      // Calculate percentage (cap at 100%)
      const matchPercentage = Math.min(Math.round((matchScore / maxScore) * 100), 100);

      return {
        ...job.toObject(),
        matchScore,
        matchPercentage,
        matchedSkills: matchedSkills.slice(0, 5) // Limit to top 5 matched skills
      };
    });

    // Sort by match score (highest first)
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    // Apply pagination
    const paginatedJobs = jobsWithScores.slice(skip, skip + parseInt(limit));
    const total = jobsWithScores.length;

    res.json({
      jobs: paginatedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      userSkills: userSkills.slice(0, 10) // Return user skills for debugging
    });

  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ message: 'Server error while matching jobs' });
  }
});

module.exports = router;
