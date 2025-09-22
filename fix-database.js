const mongoose = require('./server/node_modules/mongoose');
const dotenv = require('./server/node_modules/dotenv');

// Load environment variables
dotenv.config({ path: './server/.env' });

console.log('🔧 JobSnap Database Fix & Setup');
console.log('================================\n');

async function fixDatabase() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobsnapDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');

    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // Load models
    const User = require('./server/models/User');
    const Job = require('./server/models/Job');
    const Resume = require('./server/models/Resume');
    const EmailLog = require('./server/models/EmailLog');
    const GmailAuth = require('./server/models/GmailAuth');
    
    console.log('✅ All models loaded successfully');

    // Create indexes
    console.log('\n📊 Creating database indexes...');
    await User.createIndexes();
    await Job.createIndexes();
    await Resume.createIndexes();
    await EmailLog.createIndexes();
    await GmailAuth.createIndexes();
    console.log('✅ Database indexes created');

    // Check collections
    console.log('\n📋 Checking collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Count documents
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const resumeCount = await Resume.countDocuments();
    
    console.log(`\n📊 Document counts:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Jobs: ${jobCount}`);
    console.log(`   Resumes: ${resumeCount}`);

    // Seed jobs if none exist
    if (jobCount === 0) {
      console.log('\n🌱 No jobs found, seeding database...');
      const seedJobs = require('./server/seed-jobs');
      // The seed script will run automatically
    }

    console.log('\n✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Database connection closed');
  }
}

// Run the fix
fixDatabase();
