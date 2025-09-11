import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { emailAPI } from '../api/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  EnvelopeIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

const SelectedJobsPage = () => {
  const { user, isPremium } = useAuth();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isPremium) {
      setError('Premium subscription required to access this feature');
      setLoading(false);
      return;
    }
    
    fetchEmailHistory();
    loadSelectedJobs();
  }, [isPremium]);

  const loadSelectedJobs = () => {
    // Load from localStorage or state management
    const saved = localStorage.getItem('selectedJobs');
    if (saved) {
      try {
        setSelectedJobs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse selected jobs:', e);
      }
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const response = await emailAPI.getHistory();
      setEmailHistory(response.data.emailLogs || []);
    } catch (error) {
      console.error('Failed to fetch email history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (selectedJobs.length === 0) {
      setError('Please select at least one job to send');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await emailAPI.sendSelectedJobs(selectedJobs);
      setSuccess(`Successfully sent ${selectedJobs.length} jobs to ${user?.email}`);
      
      // Clear selected jobs
      setSelectedJobs([]);
      localStorage.removeItem('selectedJobs');
      
      // Refresh email history
      fetchEmailHistory();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleRemoveJob = (jobId) => {
    const updated = selectedJobs.filter(job => job.apiJobId !== jobId);
    setSelectedJobs(updated);
    localStorage.setItem('selectedJobs', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setSelectedJobs([]);
    localStorage.removeItem('selectedJobs');
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Premium Feature</h2>
            <p className="text-gray-400 mb-6">
              Upgrade to Premium to send selected jobs to your email
            </p>
            <a href="/premium" className="btn-primary">
              Upgrade to Premium
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading selected jobs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Selected Jobs</h1>
          <p className="text-gray-400">
            Manage and send your selected job opportunities via email
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Selected Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Selected Jobs ({selectedJobs.length})
            </h2>
            {selectedJobs.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={handleClearAll}
                  className="btn-secondary flex items-center"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Clear All
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sending || selectedJobs.length === 0}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Sending...</span>
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Send to Email
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {selectedJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {selectedJobs.map((job) => (
                <div key={job.apiJobId} className="relative">
                  <JobCard
                    job={job}
                    isSelected={false}
                    onSelect={() => {}}
                    isPremium={true}
                    showCheckbox={false}
                  />
                  <button
                    onClick={() => handleRemoveJob(job.apiJobId)}
                    className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                    title="Remove job"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card">
              <InboxIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No jobs selected</h3>
              <p className="text-gray-400 mb-6">
                Go to the job list and select jobs to send via email
              </p>
              <a href="/jobs" className="btn-primary">
                Browse Jobs
              </a>
            </div>
          )}
        </div>

        {/* Email History Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6">Email History</h2>
          
          {emailHistory.length > 0 ? (
            <div className="space-y-4">
              {emailHistory.map((email, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{email.subject}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(email.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>To: {email.recipientEmail}</span>
                    <span>Jobs: {email.jobCount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <EnvelopeIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No emails sent yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedJobsPage;
