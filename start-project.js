#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting JobSnap Application');
console.log('===============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please run: node setup-project.js first\n');
  process.exit(1);
}

// Function to start a process
function startProcess(command, args, cwd, name, color) {
  const process = spawn(command, args, { 
    cwd, 
    stdio: 'pipe',
    shell: true 
  });

  process.stdout.on('data', (data) => {
    console.log(`${color}[${name}]${'\x1b[0m'} ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.log(`${color}[${name}]${'\x1b[0m'} ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`${color}[${name}]${'\x1b[0m'} Process exited with code ${code}`);
  });

  return process;
}

// Start MongoDB (if available)
console.log('🔍 Checking MongoDB...');
try {
  const mongoProcess = spawn('mongod', ['--version'], { stdio: 'ignore' });
  mongoProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ MongoDB is available');
      console.log('📡 Starting MongoDB...');
      startProcess('mongod', [], process.cwd(), 'MongoDB', '\x1b[36m'); // Cyan
    } else {
      console.log('⚠️  MongoDB not found. Please install and start MongoDB manually.');
    }
  });
} catch (error) {
  console.log('⚠️  MongoDB not found. Please install and start MongoDB manually.');
}

// Wait a moment then start the servers
setTimeout(() => {
  console.log('\n🖥️  Starting Backend Server...');
  const serverProcess = startProcess('npm', ['start'], 
    path.join(__dirname, 'server'), 'Backend', '\x1b[32m'); // Green

  setTimeout(() => {
    console.log('\n🌐 Starting Frontend Client...');
    const clientProcess = startProcess('npm', ['start'], 
      path.join(__dirname, 'client'), 'Frontend', '\x1b[34m'); // Blue
  }, 3000);

}, 2000);

console.log('\n📋 Application Starting...');
console.log('Backend will run on: http://localhost:5000');
console.log('Frontend will run on: http://localhost:3000');
console.log('\n⚠️  Make sure to:');
console.log('1. Have MongoDB running');
console.log('2. Update server/.env with your credentials');
console.log('3. Wait for both servers to start completely');
console.log('\nPress Ctrl+C to stop all processes');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down JobSnap...');
  process.exit(0);
});
