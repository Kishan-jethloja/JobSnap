#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 JobSnap Project Setup');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully');
    console.log('⚠️  IMPORTANT: Please update the following in server/.env:');
    console.log('   - GOOGLE_CLIENT_ID (for Gmail integration)');
    console.log('   - GOOGLE_CLIENT_SECRET (for Gmail integration)');
    console.log('   - SMTP_PASS (for email features)');
    console.log('   - See GMAIL_SETUP.md for Google Cloud setup\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check MongoDB connection
console.log('🔍 Checking MongoDB...');
try {
  execSync('mongod --version', { stdio: 'ignore' });
  console.log('✅ MongoDB is installed');
  
  // Try to connect to MongoDB
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  dotenv.config({ path: envPath });
  
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobsnapDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log('✅ MongoDB connection successful');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.log('⚠️  MongoDB connection failed:', err.message);
    console.log('   Please ensure MongoDB is running: mongod');
  });
  
} catch (error) {
  console.log('⚠️  MongoDB not found. Please install MongoDB:');
  console.log('   Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/');
  console.log('   macOS: brew install mongodb/brew/mongodb-community');
  console.log('   Linux: https://docs.mongodb.com/manual/administration/install-on-linux/');
}

// Check Node.js version
console.log('\n🔍 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion >= 14) {
  console.log(`✅ Node.js ${nodeVersion} (compatible)`);
} else {
  console.log(`⚠️  Node.js ${nodeVersion} (recommend v14 or higher)`);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  console.log('   Installing server dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
  
  console.log('   Installing client dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start MongoDB: mongod');
console.log('2. Update server/.env with your credentials');
console.log('3. Start the server: cd server && npm start');
console.log('4. Start the client: cd client && npm start');
console.log('5. Visit http://localhost:3000');
console.log('\n📖 For Gmail integration setup, see GMAIL_SETUP.md');
