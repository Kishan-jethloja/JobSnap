const mongoose = require('mongoose');
const Job = require('../models/Job');

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateJobs(count) {
  const titles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'React Developer', 'Node.js Engineer', 'Python Developer', 'Java Engineer', 'Data Engineer',
    'DevOps Engineer', 'Site Reliability Engineer', 'Mobile Developer', 'QA Automation Engineer'
  ];
  const companies = [
    'TechCorp Inc.', 'Innovation Labs', 'CloudSolutions Ltd', 'DataAnalytics Pro',
    'SecureNet Systems', 'StartupXYZ', 'Enterprise Solutions Corp', 'DesignStudio Creative',
    'AI Innovations Inc', 'MobileFirst Inc'
  ];
  const tagPool = [
    'react', 'nodejs', 'javascript', 'typescript', 'python', 'java', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'mongodb', 'postgresql', 'mysql', 'devops', 'microservices', 'graphql', 'rest'
  ];
  const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'London, UK', 'Berlin, DE'];
  const jobTypes = ['Full-time', 'Contract', 'Part-time'];
  const experienceLevels = ['Junior', 'Mid-level', 'Senior'];

  const items = [];
  for (let i = 0; i < count; i++) {
    const id = `seed-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`;
    const title = randomFrom(titles);
    const company = randomFrom(companies);
    const url = `https://example.com/jobs/${id}`;
    const tags = Array.from({ length: 3 }, () => randomFrom(tagPool));
    const publicationDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 3600 * 1000);

    items.push({
      apiJobId: id,
      title,
      company,
      url,
      applicationUrl: url,
      description: `${title} at ${company}. Work on modern stacks and ship features.`,
      tags,
      location: randomFrom(locations),
      salary: '',
      jobType: randomFrom(jobTypes),
      experienceLevel: randomFrom(experienceLevels),
      publication_date: publicationDate,
      cachedAt: new Date(),
      isPremiumJob: false
    });
  }
  return items;
}

(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/jobsnapDB';
  console.log('Connecting to', uri);
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const toInsert = generateJobs(120);
    let upserted = 0;
    for (const job of toInsert) {
      await Job.findOneAndUpdate({ apiJobId: job.apiJobId }, job, { upsert: true, new: true });
      upserted++;
    }
    const total = await Job.countDocuments({});
    console.log(`Seeded ${upserted} jobs. Total now: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
})();


