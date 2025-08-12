import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import JobCard from '../components/JobCard';
import './JobListings.css';

const JobListings = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, locationFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/jobs', {
        search: searchTerm,
        location: locationFilter,
        page: currentPage,
        limit: 20
      });
      
      setJobs(response.data.jobs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setError('Error fetching jobs. Please try again.');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (jobId) => {
    if (!user?.isPremium) {
      alert('This feature is only available for premium users. Please upgrade to select jobs.');
      return;
    }

    setSelectedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleSendSelectedJobs = async () => {
    if (!emailAddress) {
      alert('Please enter an email address');
      return;
    }

    setSendingEmail(true);
    try {
      await axios.post('/api/premium/sendSelectedJobs', {
        jobIds: selectedJobs,
        recipientEmail: emailAddress
      });
      
      alert('Jobs sent successfully!');
      setShowEmailModal(false);
      setSelectedJobs([]);
      setEmailAddress('');
    } catch (error) {
      alert(error.response?.data?.error || 'Error sending jobs');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCurrentPage(1);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="job-listings-container">
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="job-listings-container">
      <div className="job-listings-header">
        <h1>Job Listings</h1>
        <p>Find your perfect remote job opportunity</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="location-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
        
        {(searchTerm || locationFilter) && (
          <button onClick={clearFilters} className="clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Premium Features */}
      {user?.isPremium && selectedJobs.length > 0 && (
        <div className="premium-actions">
          <div className="selected-jobs-info">
            <span>{selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected</span>
            <button 
              onClick={() => setSelectedJobs([])}
              className="clear-selection"
            >
              Clear Selection
            </button>
          </div>
          <button 
            onClick={() => setShowEmailModal(true)}
            className="send-jobs-button"
          >
            📧 Send Selected Jobs
          </button>
        </div>
      )}

      {/* Job Listings */}
      <div className="jobs-grid">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            isPremium={user?.isPremium}
            isSelected={selectedJobs.includes(job._id)}
            onSelect={() => handleJobSelect(job._id)}
          />
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="no-jobs">
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or check back later for new opportunities.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Send Selected Jobs</h3>
            <p>Enter the email address where you'd like to receive the job listings:</p>
            
            <input
              type="email"
              placeholder="Enter email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="email-input"
            />
            
            <div className="modal-actions">
              <button
                onClick={() => setShowEmailModal(false)}
                className="cancel-button"
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                onClick={handleSendSelectedJobs}
                className="send-button"
                disabled={sendingEmail || !emailAddress}
              >
                {sendingEmail ? 'Sending...' : 'Send Jobs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;
