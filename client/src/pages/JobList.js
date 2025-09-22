import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../api/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockJobs } from '../data/mockJobs';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const JobList = () => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const [matchingJobs, setMatchingJobs] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState('');
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    setLoading(true);
    setError('');
    setFetchingStatus('');
    
    try {
      setFetchingStatus('📋 Loading available jobs...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let allJobs = [];
      
      try {
        const allJobsResponse = await axios.get('/api/jobs/all?limit=50');
        allJobs = allJobsResponse.data.jobs || [];
        setFetchingStatus('✅ Jobs loaded successfully');
      } catch (error) {
        console.log('API failed, using mock data:', error.message);
        // Fallback to mock data if API fails
        allJobs = mockJobs.map(job => ({
          ...job,
          _id: job.apiJobId,
          apiJobId: job.apiJobId,
          company: job.company,
          applicationUrl: job.url
        }));
        setFetchingStatus('📋 Using sample job data');
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setJobs(allJobs);
      setAllJobs(allJobs);
      setFetchingStatus('');
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
      setLoading(false);
      setFetchingStatus('');
    }
  };

  const fetchFreshJobs = async () => {
    setFetchingJobs(true);
    setError('');
    setFetchingStatus('');
    
    try {
      // Step 1: Fetch fresh jobs from external APIs
      setFetchingStatus('🔄 Fetching fresh jobs from external sources...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let freshJobs = [];
      try {
        const response = await jobsAPI.fetchJobs({ search: searchTerm, limit: 50 });
        if (response.data.jobs && response.data.jobs.length > 0) {
          freshJobs = response.data.jobs;
          setFetchingStatus('✅ Fresh jobs retrieved from APIs');
        }
      } catch (error) {
        setFetchingStatus('⚠️ External APIs unavailable, checking database...');
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      
      // If no fresh jobs from APIs, fallback to database
      if (freshJobs.length === 0) {
        // Fallback to existing database jobs
        try {
          let query = searchTerm ? `?q=${encodeURIComponent(searchTerm)}&limit=50` : '?limit=50';
          const searchResponse = await axios.get(`/api/jobs/search${query}`);
          freshJobs = searchResponse.data.jobs || [];
          setFetchingStatus(`📋 Found ${freshJobs.length} jobs in database`);
        } catch (error) {
          // Final fallback to filtered mock data
          freshJobs = [...mockJobs];
          if (searchTerm) {
            freshJobs = mockJobs.filter(job =>
              job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
          }
          freshJobs = freshJobs.map(job => ({
            ...job,
            _id: job.apiJobId,
            apiJobId: job.apiJobId,
            company: job.company,
            applicationUrl: job.url
          }));
          setFetchingStatus(`📋 Found ${freshJobs.length} sample jobs`);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setJobs(freshJobs);
      setAllJobs(freshJobs);
      setFetchingStatus('');
      setFetchingJobs(false);
      
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      setError('Failed to refresh jobs. Please try again.');
      setFetchingJobs(false);
      setFetchingStatus('');
    }
  };

  const handleJobSelect = (job) => {
    if (!isPremium) return;
    
    setSelectedJobs(prev => {
      const isSelected = prev.some(j => j.apiJobId === job.apiJobId);
      if (isSelected) {
        return prev.filter(j => j.apiJobId !== job.apiJobId);
      } else {
        return [...prev, {
          apiJobId: job.apiJobId,
          title: job.title,
          company: job.company,
          url: job.url
        }];
      }
    });
  };

  const isJobSelected = (job) => {
    return selectedJobs.some(j => j.apiJobId === job.apiJobId);
  };

  const handleSendToEmail = () => {
    if (selectedJobs.length === 0) return;
    // Save selected jobs to localStorage and navigate
    localStorage.setItem('selectedJobs', JSON.stringify(selectedJobs));
    navigate('/selected');
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Available <span className="gradient-text">Jobs</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover exciting opportunities from top companies worldwide
            </p>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card text-center">
              <div className="text-2xl font-bold gradient-text mb-1">{filteredJobs.length}</div>
              <div className="text-slate-400 text-sm">Available Jobs</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-2xl font-bold gradient-text mb-1">{selectedJobs.length}</div>
              <div className="text-slate-400 text-sm">Selected Jobs</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {[...new Set(filteredJobs.map(job => job.company))].length}
              </div>
              <div className="text-slate-400 text-sm">Companies</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or description..."
                className="input-field w-full pl-12 text-lg py-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchFreshJobs}
                disabled={fetchingJobs}
                className="btn-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetchingJobs ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Refreshing...</span>
                    </div>
                    {fetchingStatus && (
                      <span className="text-xs text-indigo-400 mt-1">{fetchingStatus}</span>
                    )}
                  </div>
                ) : (
                  <>
                    <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
                    Refresh Jobs
                  </>
                )}
              </button>

              {isPremium && selectedJobs.length > 0 && (
                <button
                  onClick={handleSendToEmail}
                  className="btn-glow flex items-center justify-center"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Send {selectedJobs.length} to Email
                </button>
              )}
            </div>
          </div>

          {/* Selection Info */}
          {isPremium && (
            <div className="glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-slate-300 font-medium">
                    {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
                  </span>
                  {selectedJobs.length > 0 && (
                    <button
                      onClick={() => setSelectedJobs([])}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                    ✨ PREMIUM
                  </span>
                  Select jobs to email
                </div>
              </div>
            </div>
          )}

          {!isPremium && (
            <div className="glass-card border-2 border-gradient-to-r from-yellow-500/30 to-orange-500/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">Unlock Premium Features</p>
                  <p className="text-slate-400 text-sm">
                    Select multiple jobs and send them to your email with one click
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/premium')}
                  className="btn-primary"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 glass-card border-2 border-red-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-red-300">{error}</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="glass-card text-center max-w-md">
              <LoadingSpinner size="lg" text="Loading job matches..." />
              {fetchingStatus && (
                <div className="mt-6">
                  <p className="text-indigo-400 font-medium text-lg">{fetchingStatus}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-slate-400 text-lg">
                <span className="font-semibold text-white">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} found
                {searchTerm && (
                  <>
                    {' '}for <span className="text-indigo-400 font-medium">"{searchTerm}"</span>
                  </>
                )}
              </p>
            </div>

            {/* Job Grid */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
                {filteredJobs.map((job, index) => (
                  <div key={job.apiJobId || job._id} style={{animationDelay: `${index * 0.1}s`}}>
                    <JobCard
                      job={job}
                      isSelected={isJobSelected(job)}
                      onSelect={handleJobSelect}
                      isPremium={isPremium}
                      showCheckbox={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="glass-card max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MagnifyingGlassIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No jobs found</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    {searchTerm 
                      ? `No jobs match your search for "${searchTerm}". Try different keywords or clear your search.`
                      : 'No jobs available right now. Try refreshing or check back later.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="btn-secondary"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      onClick={fetchFreshJobs}
                      className="btn-primary"
                      disabled={fetchingJobs}
                    >
                      {fetchingJobs ? 'Loading...' : 'Refresh Jobs'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobList;
