const pdfParse = require('pdf-parse');

// Common tech skills and keywords to look for
const TECH_KEYWORDS = [
  'javascript', 'python', 'java', 'react', 'node', 'nodejs', 'express',
  'mongodb', 'mysql', 'postgresql', 'sql', 'html', 'css', 'typescript',
  'angular', 'vue', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'github',
  'tensorflow', 'pytorch', 'keras', 'machine learning', 'ai', 'ml',
  'data science', 'analytics', 'tableau', 'power bi', 'excel',
  'agile', 'scrum', 'devops', 'ci/cd', 'jenkins', 'linux', 'ubuntu',
  'redis', 'elasticsearch', 'graphql', 'rest', 'api', 'microservices',
  'blockchain', 'solidity', 'web3', 'react native', 'flutter', 'ionic',
  'sass', 'less', 'webpack', 'babel', 'npm', 'yarn', 'jest', 'cypress'
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
