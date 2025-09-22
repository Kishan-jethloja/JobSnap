const pdfParse = require('pdf-parse');

// Comprehensive tech skills and keywords to look for
const TECH_KEYWORDS = [
  // Programming Languages
  'javascript', 'python', 'java', 'typescript', 'php', 'ruby', 'go', 'rust', 
  'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab', 'dart', 'elixir',
  'haskell', 'clojure', 'erlang', 'lua', 'groovy', 'objective-c',
  
  // Web Technologies
  'html', 'css', 'react', 'angular', 'vue', 'svelte', 'ember', 'backbone',
  'jquery', 'bootstrap', 'tailwind', 'sass', 'less', 'stylus',
  'webpack', 'vite', 'parcel', 'rollup', 'babel', 'eslint', 'prettier',
  
  // Backend & Frameworks
  'node', 'nodejs', 'express', 'fastify', 'koa', 'nestjs', 'django',
  'flask', 'fastapi', 'spring', 'spring boot', 'laravel', 'symfony',
  'rails', 'sinatra', 'asp.net', 'gin', 'echo', 'fiber',
  
  // Databases
  'mongodb', 'mysql', 'postgresql', 'sqlite', 'redis', 'cassandra',
  'dynamodb', 'firebase', 'supabase', 'prisma', 'sequelize', 'mongoose',
  'typeorm', 'knex', 'elasticsearch', 'solr', 'neo4j', 'couchdb',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
  'jenkins', 'gitlab ci', 'github actions', 'circleci', 'travis ci',
  'nginx', 'apache', 'linux', 'ubuntu', 'centos', 'debian', 'bash',
  
  // Data Science & AI
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
  'matplotlib', 'seaborn', 'jupyter', 'anaconda', 'machine learning',
  'deep learning', 'ai', 'ml', 'data science', 'analytics', 'statistics',
  'tableau', 'power bi', 'looker', 'qlik', 'excel', 'spark', 'hadoop',
  
  // Mobile Development
  'react native', 'flutter', 'ionic', 'xamarin', 'cordova', 'phonegap',
  'android', 'ios', 'xcode', 'android studio',
  
  // Testing & Quality
  'jest', 'cypress', 'selenium', 'mocha', 'chai', 'jasmine', 'karma',
  'pytest', 'junit', 'testng', 'cucumber', 'postman', 'insomnia',
  
  // Version Control & Collaboration
  'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
  
  // API & Architecture
  'rest', 'graphql', 'grpc', 'soap', 'api', 'microservices', 'serverless',
  'lambda', 'azure functions', 'cloud functions',
  
  // Blockchain & Web3
  'blockchain', 'solidity', 'web3', 'ethereum', 'bitcoin', 'smart contracts',
  
  // Package Managers & Tools
  'npm', 'yarn', 'pip', 'composer', 'maven', 'gradle', 'cargo',
  
  // Methodologies
  'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd',
  
  // Other Technologies
  'redis', 'rabbitmq', 'kafka', 'websockets', 'oauth', 'jwt', 'ssl',
  'https', 'json', 'xml', 'yaml', 'markdown'
];

const parsePdfBuffer = async (buffer) => {
  try {
    // Parse PDF buffer
    const data = await pdfParse(buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    // Extract skills using keyword matching
    const skills = extractSkills(text);

    return {
      text: text.trim(),
      skills: skills
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set();

  // Look for exact keyword matches
  TECH_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(lowerText)) {
      foundSkills.add(keyword);
    }
  });

  // Look for programming languages with common variations
  const languageVariations = {
    'c++': ['c\\+\\+', 'cpp', 'cplusplus'],
    'c#': ['c#', 'csharp', 'c-sharp'],
    '.net': ['\\.net', 'dotnet', 'asp\\.net'],
    'node.js': ['node\\.js', 'nodejs', 'node js'],
    'react.js': ['react\\.js', 'reactjs', 'react js'],
    'vue.js': ['vue\\.js', 'vuejs', 'vue js'],
    'angular.js': ['angular\\.js', 'angularjs', 'angular js']
  };

  Object.entries(languageVariations).forEach(([skill, variations]) => {
    variations.forEach(variation => {
      const regex = new RegExp(`\\b${variation}\\b`, 'gi');
      if (regex.test(lowerText)) {
        foundSkills.add(skill);
      }
    });
  });

  // Convert to array and limit to top matches
  return Array.from(foundSkills).slice(0, 20);
};

module.exports = {
  parsePdfBuffer,
  extractSkills
};
