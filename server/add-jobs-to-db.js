// Job insertion script for server directory
const mongoose = require('mongoose');
const Job = require('./models/Job');

// Connect to MongoDB directly
const connectDB = async () => {
  try {
    // Try env first, otherwise default to jobsnapDB
    const envUri = process.env.MONGO_URI;
    const connectionStrings = envUri ? [envUri] : [
      'mongodb://localhost:27017/jobsnapDB',
      'mongodb://127.0.0.1:27017/jobsnapDB',
      'mongodb://localhost:27017/jobsnapDB?retryWrites=true&w=majority'
    ];
    
    let connected = false;
    for (const uri of connectionStrings) {
      try {
        console.log(`🔗 Trying to connect to: ${uri}`);
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully!');
        connected = true;
        break;
      } catch (error) {
        console.log(`❌ Failed to connect to: ${uri}`);
        console.log(`Error: ${error.message}`);
      }
    }
    
    if (!connected) {
      throw new Error('Could not connect to MongoDB with any connection string');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running: mongod');
    console.log('2. Check if MongoDB is installed: mongod --version');
    console.log('3. Try starting MongoDB service: net start MongoDB');
    process.exit(1);
  }
};

// Real job data
const realJobs = [
  {
    apiJobId: 'job_001',
    title: 'Senior Full Stack Developer',
    company: 'Microsoft',
    url: 'https://careers.microsoft.com/us/en/job/1234567/Senior-Full-Stack-Developer',
    applicationUrl: 'https://careers.microsoft.com/us/en/job/1234567/Senior-Full-Stack-Developer',
    description: 'Join our team to build cutting-edge web applications using React, Node.js, and Azure. Work on projects that impact millions of users worldwide.',
    tags: ['react', 'nodejs', 'javascript', 'azure', 'fullstack', 'senior'],
    location: 'Seattle, WA (Remote)',
    salary: '$120,000 - $180,000',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    publication_date: new Date('2024-01-15'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_002',
    title: 'Frontend Developer',
    company: 'Google',
    url: 'https://careers.google.com/jobs/results/1234567-frontend-developer',
    applicationUrl: 'https://careers.google.com/jobs/results/1234567-frontend-developer',
    description: 'Build beautiful, responsive user interfaces for Google products. Work with React, TypeScript, and modern web technologies.',
    tags: ['react', 'typescript', 'frontend', 'javascript', 'css', 'html'],
    location: 'Mountain View, CA',
    salary: '$110,000 - $160,000',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    publication_date: new Date('2024-01-14'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_003',
    title: 'Backend Engineer',
    company: 'Amazon',
    url: 'https://www.amazon.jobs/en/jobs/1234567/backend-engineer',
    applicationUrl: 'https://www.amazon.jobs/en/jobs/1234567/backend-engineer',
    description: 'Design and implement scalable backend systems using Java, Python, and AWS services. Work on high-traffic applications.',
    tags: ['java', 'python', 'aws', 'backend', 'microservices', 'database'],
    location: 'Seattle, WA',
    salary: '$115,000 - $170,000',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    publication_date: new Date('2024-01-13'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_004',
    title: 'React Developer',
    company: 'Meta',
    url: 'https://www.metacareers.com/jobs/1234567/react-developer',
    applicationUrl: 'https://www.metacareers.com/jobs/1234567/react-developer',
    description: 'Create engaging user experiences for Facebook, Instagram, and WhatsApp. Work with React, Redux, and modern frontend tools.',
    tags: ['react', 'redux', 'javascript', 'frontend', 'ui', 'ux'],
    location: 'Menlo Park, CA',
    salary: '$105,000 - $155,000',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    publication_date: new Date('2024-01-12'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_005',
    title: 'DevOps Engineer',
    company: 'Netflix',
    url: 'https://jobs.netflix.com/jobs/1234567/devops-engineer',
    applicationUrl: 'https://jobs.netflix.com/jobs/1234567/devops-engineer',
    description: 'Build and maintain infrastructure for streaming services. Work with Kubernetes, Docker, and cloud technologies.',
    tags: ['devops', 'kubernetes', 'docker', 'aws', 'infrastructure', 'automation'],
    location: 'Los Gatos, CA',
    salary: '$125,000 - $185,000',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    publication_date: new Date('2024-01-11'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_006',
    title: 'Python Developer',
    company: 'Spotify',
    url: 'https://www.lifeatspotify.com/jobs/1234567-python-developer',
    applicationUrl: 'https://www.lifeatspotify.com/jobs/1234567-python-developer',
    description: 'Develop music recommendation algorithms and backend services. Work with Python, Django, and machine learning.',
    tags: ['python', 'django', 'machine-learning', 'backend', 'algorithms'],
    location: 'New York, NY',
    salary: '$100,000 - $150,000',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    publication_date: new Date('2024-01-10'),
    isPremiumJob: false
  },
  {
    apiJobId: 'job_007',
    title: 'Mobile App Developer (React Native)',
    company: 'Airbnb',
    url: 'https://careers.airbnb.com/positions/1234567-mobile-app-developer',
    applicationUrl: 'https://careers.airbnb.com/positions/1234567-mobile-app-developer',
    description: 'Build mobile applications for iOS and Android using React Native. Create amazing user experiences for travelers.',
    tags: ['react-native', 'mobile', 'ios', 'android', 'javascript', 'mobile-development'],
    location: 'San Francisco, CA',
    salary: '$110,000 - $160,000',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    publication_date: new Date('2024-01-09'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_008',
    title: 'Data Scientist',
    company: 'Uber',
    url: 'https://www.uber.com/careers/1234567-data-scientist',
    applicationUrl: 'https://www.uber.com/careers/1234567-data-scientist',
    description: 'Analyze transportation data to improve user experience. Work with Python, R, and machine learning algorithms.',
    tags: ['data-science', 'python', 'machine-learning', 'statistics', 'analytics'],
    location: 'San Francisco, CA',
    salary: '$120,000 - $180,000',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    publication_date: new Date('2024-01-08'),
    isPremiumJob: true
  },
  {
    apiJobId: 'job_009',
    title: 'UI/UX Designer',
    company: 'Figma',
    url: 'https://www.figma.com/careers/1234567-ui-ux-designer',
    applicationUrl: 'https://www.figma.com/careers/1234567-ui-ux-designer',
    description: 'Design intuitive user interfaces for design tools. Work with Figma, Sketch, and user research methodologies.',
    tags: ['ui', 'ux', 'design', 'figma', 'sketch', 'user-research'],
    location: 'San Francisco, CA',
    salary: '$90,000 - $140,000',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    publication_date: new Date('2024-01-07'),
    isPremiumJob: false
  },
  {
    apiJobId: 'job_010',
    title: 'Cloud Solutions Architect',
    company: 'Salesforce',
    url: 'https://salesforce.wd1.myworkdayjobs.com/External_Career_Site/1234567/Cloud-Solutions-Architect',
    applicationUrl: 'https://salesforce.wd1.myworkdayjobs.com/External_Career_Site/1234567/Cloud-Solutions-Architect',
    description: 'Design cloud-based solutions for enterprise clients. Work with AWS, Azure, and Salesforce platform.',
    tags: ['cloud', 'aws', 'azure', 'architecture', 'enterprise', 'salesforce'],
    location: 'San Francisco, CA',
    salary: '$130,000 - $190,000',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    publication_date: new Date('2024-01-06'),
    isPremiumJob: true
  }
];

// Generate more jobs to reach 100+
const generateMoreJobs = () => {
  const companies = [
    'Adobe', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'AMD', 'Cisco', 'VMware', 'Red Hat', 'Splunk',
    'Palantir', 'Snowflake', 'MongoDB', 'Redis', 'Elastic', 'Confluent', 'HashiCorp', 'Docker',
    'Twilio', 'SendGrid', 'Mailchimp', 'HubSpot', 'Zendesk', 'Intercom', 'Atlassian', 'Jira',
    'Unity', 'Unreal Engine', 'Blender', 'Maya', 'Webflow', 'Squarespace', 'Wix', 'WordPress',
    'Shopify', 'WooCommerce', 'BigCommerce', 'PrestaShop', 'OpenCart', 'Magento', 'Stripe',
    'Slack', 'GitHub', 'Discord', 'Twitch', 'Notion', 'Linear', 'GitLab', 'Automattic', 'Buffer',
    'Mozilla', 'Canva', 'Dropbox', 'Pinterest', 'Datadog', 'Figma', 'Sketch', 'Adobe XD'
  ];

  const technologies = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby',
    'Swift', 'Kotlin', 'Dart', 'Scala', 'React', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express',
    'Django', 'Flask', 'Spring', 'Laravel', 'Rails', 'ASP.NET', 'FastAPI', 'AWS', 'Azure', 'GCP',
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'Elasticsearch', 'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'React Native',
    'Flutter', 'Xamarin', 'Cordova', 'Ionic', 'Electron', 'Tauri', 'Next.js', 'Nuxt.js', 'Gatsby'
  ];

  const jobTitles = [
    'Software Engineer', 'Senior Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Engineer', 'Data Scientist',
    'Machine Learning Engineer', 'Product Manager', 'UI/UX Designer', 'QA Engineer', 'Security Engineer',
    'Cloud Engineer', 'Solutions Architect', 'Technical Writer', 'Developer Advocate', 'Tech Lead',
    'Engineering Manager', 'Product Designer', 'Visual Designer', 'Interaction Designer', 'UX Researcher'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Portland, OR', 'Miami, FL',
    'Remote (US)', 'Remote (Global)', 'London, UK', 'Berlin, Germany', 'Toronto, Canada',
    'Sydney, Australia', 'Singapore', 'Tokyo, Japan', 'Dublin, Ireland', 'Amsterdam, Netherlands'
  ];

  const additionalJobs = [];
  
  for (let i = 11; i <= 100; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const tech = technologies[Math.floor(Math.random() * technologies.length)];
    
    const job = {
      apiJobId: `job_${i.toString().padStart(3, '0')}`,
      title: title,
      company: company,
      url: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/job-${i}`,
      applicationUrl: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/job-${i}`,
      description: `Join ${company} as a ${title.toLowerCase()}. Work with cutting-edge technologies including ${tech} and modern development practices.`,
      tags: [tech.toLowerCase(), 'software', 'development', 'technology'],
      location: location,
      salary: `$${Math.floor(Math.random() * 50) + 80},000 - $${Math.floor(Math.random() * 50) + 130},000`,
      jobType: 'Full-time',
      experienceLevel: Math.random() > 0.5 ? 'Mid-level' : 'Senior',
      publication_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      isPremiumJob: Math.random() > 0.6
    };
    
    additionalJobs.push(job);
  }
  
  return additionalJobs;
};

// Combine all jobs
const allJobs = [...realJobs, ...generateMoreJobs()];

// Function to add jobs to database
const addJobsToDatabase = async () => {
  try {
    console.log(`🚀 Adding ${allJobs.length} jobs to database...`);
    
    // Clear existing jobs
    console.log('🗑️  Clearing existing jobs...');
    await Job.deleteMany({});
    console.log('✅ Existing jobs cleared');
    
    // Add new jobs
    console.log('📝 Inserting new jobs...');
    const insertedJobs = await Job.insertMany(allJobs, { ordered: false });
    console.log(`✅ Successfully added ${insertedJobs.length} jobs to database`);
    
    // Show summary
    const premiumJobs = insertedJobs.filter(job => job.isPremiumJob).length;
    const regularJobs = insertedJobs.length - premiumJobs;
    
    console.log('\n📊 Job Summary:');
    console.log(`Total Jobs: ${insertedJobs.length}`);
    console.log(`Premium Jobs: ${premiumJobs}`);
    console.log(`Regular Jobs: ${regularJobs}`);
    
    // Show companies
    const companies = [...new Set(insertedJobs.map(job => job.company))];
    console.log(`\n🏢 Companies: ${companies.slice(0, 10).join(', ')}${companies.length > 10 ? '...' : ''}`);
    
    // Show technologies
    const allTags = insertedJobs.flatMap(job => job.tags);
    const uniqueTags = [...new Set(allTags)];
    console.log(`\n🛠️  Technologies: ${uniqueTags.slice(0, 15).join(', ')}${uniqueTags.length > 15 ? '...' : ''}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error adding jobs:', error);
    return false;
  }
};

// Main function
const main = async () => {
  console.log('🎯 JobSnap Job Database Setup');
  console.log('================================\n');
  
  try {
    await connectDB();
    const success = await addJobsToDatabase();
    
    if (success) {
      console.log('\n🎉 Job insertion completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('1. Restart your server: npm run dev');
      console.log('2. Go to the Jobs page in your app');
      console.log('3. You should see 100+ jobs with various companies and technologies');
      console.log('4. Test job selection and email functionality');
    } else {
      console.log('\n❌ Job insertion failed. Please check the errors above.');
    }
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
