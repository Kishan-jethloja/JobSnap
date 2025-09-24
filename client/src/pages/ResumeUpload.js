import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, jobsAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  EyeIcon,
  CalendarDaysIcon,
  TagIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resume, setResume] = useState(null);
  const [matchingJobs, setMatchingJobs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExistingResume();
  }, []);

  const fetchExistingResume = async () => {
    try {
      const response = await resumeAPI.getMyResume();
      setResume(response.data.resume);
      setUploadSuccess(true);
    } catch (error) {
      // No existing resume
      setResume(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    
    if (!selectedFile) return;
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await resumeAPI.upload(formData);
      
      setResume(response.data.resume);
      setUploadSuccess(true);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('resume-file');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFindMatches = async () => {
    setMatchingJobs(true);
    try {
      await jobsAPI.matchJobs();
      navigate('/jobs');
    } catch (error) {
      setError('Failed to find job matches. Please try again.');
      setMatchingJobs(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DocumentTextIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
              Resume Upload
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your PDF resume and let our AI extract your skills to find perfect job matches
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-8 animate-fade-in">
              <div className="glass-card border-2 border-red-500/30 bg-red-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-300 font-medium">Upload Error</p>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadSuccess && resume && (
            <div className="mb-8 animate-fade-in">
              <div className="glass-card border-2 border-emerald-500/30 bg-emerald-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-300 font-medium">Success!</p>
                    <p className="text-emerald-400 text-sm">Resume uploaded and parsed successfully</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="glass-card animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CloudArrowUpIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Upload New Resume
                </h2>
              </div>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-indigo-400 bg-indigo-900/30 scale-105 shadow-2xl shadow-indigo-500/20'
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={`transition-all duration-300 ${dragActive ? 'scale-110' : ''}`}>
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CloudArrowUpIcon className={`w-10 h-10 transition-colors ${dragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-xl font-semibold text-white mb-2">
                    {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
                  </p>
                  <p className="text-slate-400 mb-6">or</p>
                  <label htmlFor="resume-file" className="btn-glow cursor-pointer inline-block">
                    <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                    Browse Files
                  </label>
                  <input
                    id="resume-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={uploading}
                  />
                  <p className="text-sm text-slate-500 mt-6 flex items-center justify-center space-x-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>PDF files only, max 5MB</span>
                  </p>
                </div>
              </div>

              {file && (
                <div className="mt-6 glass-card border-2 border-indigo-500/30 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{file.name}</p>
                        <p className="text-slate-400 text-sm flex items-center space-x-2">
                          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>Ready to upload</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="btn-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-40 h-10 whitespace-nowrap"
                    >
                      {uploading ? (
                        <>
                          <span className="inline-block w-4 h-4 mr-2 border-2 border-slate-300 border-t-white rounded-full animate-spin"></span>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <RocketLaunchIcon className="w-4 h-4 mr-2" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Info Section */}
            <div className="glass-card animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <EyeIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Current Resume
                </h2>
              </div>
              
              {resume ? (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <TagIcon className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-semibold text-white">Extracted Skills</h3>
                    </div>
                    {resume.skills && resume.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {resume.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="skill-tag"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No skills extracted yet</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <DocumentTextIcon className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Resume Preview</h3>
                    </div>
                    <div className="glass-card bg-slate-800/50 max-h-48 overflow-y-auto">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {resume.parsedText || 'No text content available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleFindMatches}
                      disabled={matchingJobs}
                      className="btn-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {matchingJobs ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Finding Matches...</span>
                        </>
                      ) : (
                        <>
                          <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                          Find Job Matches
                        </>
                      )}
                    </button>
                  </div>

                  <div className="glass-card bg-slate-800/30 border border-slate-600/30">
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-slate-300 text-sm font-medium">Upload Date</p>
                        <p className="text-slate-400 text-xs">{new Date(resume.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <DocumentTextIcon className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Resume Yet</h3>
                  <p className="text-slate-400 mb-4">Upload a PDF resume to get started</p>
                  <p className="text-slate-500 text-sm">
                    Once uploaded, we'll extract your skills and help you find matching jobs
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-12 glass-card animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Tips for Better Results
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Well-Formatted PDF",
                  description: "Use a clean, professional PDF with clear sections for skills and experience",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Technical Skills",
                  description: "Include relevant programming languages, frameworks, and technical tools",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "Keep It Updated",
                  description: "Regularly update your resume with new skills and recent experience",
                  color: "from-emerald-500 to-teal-500"
                },
                {
                  title: "Industry Terms",
                  description: "Use standard job titles and industry-recognized terminology",
                  color: "from-orange-500 to-red-500"
                }
              ].map((tip, index) => (
                <div key={index} className="glass-card bg-slate-800/30 border border-slate-600/30 hover:border-slate-500/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 bg-gradient-to-br ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{tip.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
