// Simple test to verify job fetching works
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock job data (same as in routes)
const mockJobs = [
  {
    id: 'mock-1',
    title: 'Senior Full Stack Developer',
    company_name: 'TechCorp Inc.',
    url: 'https://example.com/job/1',
    description: 'We are looking for a Senior Full Stack Developer with experience in React, Node.js, and MongoDB.',
    tags: ['react', 'nodejs', 'mongodb', 'javascript', 'fullstack'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-2',
    title: 'Frontend React Developer',
    company_name: 'StartupXYZ',
    url: 'https://example.com/job/2',
    description: 'Join our dynamic team as a Frontend React Developer.',
    tags: ['react', 'javascript', 'css', 'html', 'frontend'],
    publication_date: new Date().toISOString()
  },
  {
    id: 'mock-3',
    title: 'Backend Node.js Developer',
    company_name: 'CloudSolutions Ltd',
    url: 'https://example.com/job/3',
    description: 'We need a Backend Node.js Developer to design and implement server-side logic.',
    tags: ['nodejs', 'express', 'mongodb', 'api', 'backend'],
    publication_date: new Date().toISOString()
  }
];

// Simple test endpoint
app.get('/api/jobs/test', (req, res) => {
  console.log('✅ Test endpoint called');
  
  const jobs = mockJobs.map(job => ({
    apiJobId: job.id,
    title: job.title,
    company: job.company_name,
    url: job.url,
    description: job.description,
    tags: job.tags,
    publication_date: new Date(job.publication_date),
    cachedAt: new Date(),
    isPremiumJob: false
  }));

  res.json({
    message: `Test successful - ${jobs.length} jobs available`,
    jobs: jobs,
    total: jobs.length,
    source: 'test'
  });
});

// Test fetch endpoint
app.get('/api/jobs/fetch', (req, res) => {
  console.log('✅ Fetch endpoint called');
  
  const jobs = mockJobs.map(job => ({
    apiJobId: job.id,
    title: job.title,
    company: job.company_name,
    url: job.url,
    description: job.description,
    tags: job.tags,
    publication_date: new Date(job.publication_date),
    cachedAt: new Date(),
    isPremiumJob: false
  }));

  res.json({
    message: `Fetched ${jobs.length} mock jobs`,
    jobs: jobs,
    total: jobs.length,
    source: 'mock'
  });
});

// Test search endpoint
app.get('/api/jobs/search', (req, res) => {
  console.log('✅ Search endpoint called');
  
  const jobs = mockJobs.map(job => ({
    apiJobId: job.id,
    title: job.title,
    company: job.company_name,
    url: job.url,
    description: job.description,
    tags: job.tags,
    publication_date: new Date(job.publication_date),
    cachedAt: new Date(),
    isPremiumJob: false
  }));

  res.json({
    jobs: jobs,
    pagination: {
      page: 1,
      limit: 20,
      total: jobs.length,
      pages: 1
    }
  });
});

// Test all jobs endpoint
app.get('/api/jobs/all', (req, res) => {
  console.log('✅ All jobs endpoint called');
  
  const jobs = mockJobs.map(job => ({
    apiJobId: job.id,
    title: job.title,
    company: job.company_name,
    url: job.url,
    description: job.description,
    tags: job.tags,
    publication_date: new Date(job.publication_date),
    cachedAt: new Date(),
    isPremiumJob: false
  }));

  res.json({
    jobs: jobs,
    pagination: {
      page: 1,
      limit: 20,
      total: jobs.length,
      pages: 1
    }
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`📝 Test endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/jobs/test`);
  console.log(`   GET http://localhost:${PORT}/api/jobs/fetch`);
  console.log(`   GET http://localhost:${PORT}/api/jobs/search`);
  console.log(`   GET http://localhost:${PORT}/api/jobs/all`);
});
