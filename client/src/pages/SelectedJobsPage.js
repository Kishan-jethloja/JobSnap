import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { emailAPI, gmailAPI } from '../api/api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  EnvelopeIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const SelectedJobsPage = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Gmail integration state
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState('');
  const [creatingDrafts, setCreatingDrafts] = useState(false);
  const [gmailLoading, setGmailLoading] = useState(false);

  useEffect(() => {
    if (!isPremium) {
      setError('Premium subscription required to access this feature');
      setLoading(false);
      return;
    }
    
    fetchEmailHistory();
    loadSelectedJobs();
    checkGmailStatus();
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

  const checkGmailStatus = async () => {
    try {
      const response = await gmailAPI.getStatus();
      setGmailConnected(response.data.isConnected);
      if (response.data.isConnected) {
        setGmailEmail(response.data.gmailEmail);
      }
    } catch (error) {
      console.error('Failed to check Gmail status:', error);
    }
  };

  const handleGmailConnect = async () => {
    try {
      setGmailLoading(true);
      const response = await gmailAPI.getAuthUrl();
      
      // Open Google OAuth in a popup window
      const popup = window.open(
        response.data.authUrl,
        'gmail-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for messages from the popup
      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GMAIL_CONNECTED') {
          popup.close();
          window.removeEventListener('message', messageListener);
          
          if (event.data.success) {
            setSuccess('Gmail connected successfully!');
            checkGmailStatus(); // Refresh Gmail status
          } else {
            setError('Failed to connect Gmail account.');
          }
          setGmailLoading(false);
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setGmailLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Gmail connection error:', error);
      if (error.response?.data?.message?.includes('not configured')) {
        setError('Gmail integration is not configured. Please contact the administrator or check the CONFIGURATION_GUIDE.md file.');
      } else {
        setError('Failed to connect Gmail. Please try again.');
      }
      setGmailLoading(false);
    }
  };

  const handleCreateGmailDrafts = async () => {
    if (selectedJobs.length === 0) {
      setError('Please select at least one job to create drafts');
      return;
    }

    if (!gmailConnected) {
      setError('Please connect your Gmail account first');
      return;
    }

    setCreatingDrafts(true);
    setError('');
    setSuccess('');

    try {
      const response = await gmailAPI.createDrafts(selectedJobs);
      setSuccess(`Successfully created ${response.data.successCount} Gmail drafts! Check your Gmail drafts folder.`);
      
      // Clear selected jobs after successful draft creation
      setSelectedJobs([]);
      localStorage.removeItem('selectedJobs');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create Gmail drafts. Please try again.');
    } finally {
      setCreatingDrafts(false);
    }
  };

  const handleDisconnectGmail = async () => {
    try {
      await gmailAPI.disconnect();
      setGmailConnected(false);
      setGmailEmail('');
      setSuccess('Gmail disconnected successfully');
    } catch (error) {
      setError('Failed to disconnect Gmail');
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
            <button 
              onClick={() => navigate('/premium')}
              className="btn-primary"
            >
              Upgrade to Premium
            </button>
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
              <div className="flex flex-wrap gap-3">
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
                  className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
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
                
                {/* Gmail Draft Creation Button */}
                <button
                  onClick={handleCreateGmailDrafts}
                  disabled={creatingDrafts || selectedJobs.length === 0 || !gmailConnected}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  title={!gmailConnected ? 'Connect Gmail first' : 'Create Gmail drafts for selected jobs'}
                >
                  {creatingDrafts ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Creating Drafts...</span>
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                      Create Gmail Drafts
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
              <button 
                onClick={() => navigate('/jobs')}
                className="btn-primary"
              >
                Browse Jobs
              </button>
            </div>
          )}
        </div>

        {/* Gmail Connection Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Gmail Integration</h2>
            <div className="flex items-center space-x-3">
              {gmailConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium">Connected</span>
                  </div>
                  <span className="text-gray-300">{gmailEmail}</span>
                  <button
                    onClick={handleDisconnectGmail}
                    className="text-red-400 hover:text-red-300 text-sm underline"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGmailConnect}
                  disabled={gmailLoading}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gmailLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Connect Gmail
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <DocumentDuplicateIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Automated Gmail Drafts</h3>
                <p className="text-gray-400 mb-3">
                  Connect your Gmail account to automatically create professional job application emails as drafts. 
                  Each selected job will generate a personalized email draft that you can review and send with one click from Gmail.
                </p>
                <div className="flex flex-wrap gap-2 text-sm mb-3">
                  <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded">✓ Professional templates</span>
                  <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded">✓ Personalized content</span>
                  <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded">✓ One-click sending</span>
                  <span className="bg-orange-900/50 text-orange-300 px-2 py-1 rounded">✓ Secure OAuth</span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded">
                  <strong>Note:</strong> Gmail integration requires Google OAuth setup. If you see OAuth errors, 
                  check the GMAIL_OAUTH_SETUP.md file for configuration instructions.
                </div>
              </div>
            </div>
          </div>
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
