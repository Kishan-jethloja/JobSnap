#!/usr/bin/env node

// Simple script to run the job insertion
console.log('🚀 Starting job insertion process...');
console.log('📋 This will add 100+ real jobs to your database');
console.log('⚠️  Make sure your MongoDB is running and .env file is configured');
console.log('');

// Check if .env file exists
const fs = require('fs');
const path = require('path');

if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('📝 Please create a .env file with your MongoDB connection string:');
  console.log('MONGO_URI=mongodb://localhost:27017/jobsnap');
  console.log('');
  process.exit(1);
}

// Run the job insertion
require('./add-real-jobs.js');
