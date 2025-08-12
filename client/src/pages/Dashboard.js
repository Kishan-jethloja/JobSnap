import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ResumeUpload from '../components/ResumeUpload';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumeData();
    fetchMatchedJobs();
  }, []);

  const fetchResumeData = async () => {
    try {
      const response = await axios.get('/api/resume/my-resume');
      setResumeData(response.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        setError('Error fetching resume data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchedJobs = async () => {
    try {
      const response = await axios.get('/api/jobs/matched');
      setMatchedJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching matched jobs:', error);
    }
  };

  const handleResumeUploadSuccess = (data) => {
    setResumeData(data);
    fetchMatchedJobs(); // Refresh matched jobs after new resume
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Manage your resume and discover job opportunities</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Resume Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📄 Your Resume</h2>
            {resumeData && (
              <span className="status-badge success">
                ✓ Uploaded
              </span>
            )}
          </div>
          
          {resumeData ? (
            <div className="resume-info">
              <p><strong>File:</strong> {resumeData.originalName}</p>
              <p><strong>Uploaded:</strong> {new Date(resumeData.uploadedAt).toLocaleDateString()}</p>
              
              <div className="skills-section">
                <h3>Extracted Skills ({resumeData.skills.length})</h3>
                <div className="skills-grid">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => window.location.reload()}
                className="refresh-button"
              >
                Refresh Skills
              </button>
            </div>
          ) : (
            <div className="upload-section">
              <p>Upload your resume to get started with job matching</p>
              <ResumeUpload onUploadSuccess={handleResumeUploadSuccess} />
            </div>
          )}
        </div>

        {/* Matched Jobs Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🎯 Matched Jobs</h2>
            <Link to="/jobs" className="view-all-link">
              View All Jobs →
            </Link>
          </div>
          
          {matchedJobs.length > 0 ? (
            <div className="matched-jobs">
              {matchedJobs.slice(0, 3).map((job) => (
                <div key={job._id} className="job-preview">
                  <div className="job-header">
                    <h4>{job.title}</h4>
                    <span className="match-score">{Math.round(job.matchScore)}% Match</span>
                  </div>
                  <p className="company">{job.company}</p>
                  <div className="job-tags">
                    {job.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="apply-link"
                  >
                    Apply Now
                  </a>
                </div>
              ))}
              
              {matchedJobs.length > 3 && (
                <div className="more-jobs">
                  <p>+{matchedJobs.length - 3} more matches</p>
                  <Link to="/jobs" className="view-all-button">
                    View All Matches
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="no-jobs">
              {resumeData ? (
                <>
                  <p>No matched jobs found yet.</p>
                  <p>Try refreshing the job listings or check back later.</p>
                  <button 
                    onClick={fetchMatchedJobs}
                    className="refresh-button"
                  >
                    Refresh Jobs
                  </button>
                </>
              ) : (
                <p>Upload your resume to see matched jobs</p>
              )}
            </div>
          )}
        </div>

        {/* Premium Section */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>⭐ Premium Features</h2>
            {user?.isPremium ? (
              <span className="status-badge premium">Premium</span>
            ) : (
              <span className="status-badge free">Free</span>
            )}
          </div>
          
          {user?.isPremium ? (
            <div className="premium-features">
              <h3>Your Premium Benefits:</h3>
              <ul>
                <li>✓ Select multiple jobs</li>
                <li>✓ Send jobs via email</li>
                <li>✓ Priority job matching</li>
                <li>✓ Advanced filters</li>
              </ul>
              <Link to="/jobs" className="cta-button">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="upgrade-section">
              <h3>Upgrade to Premium</h3>
              <p>Get access to advanced features and email job sharing</p>
              <ul>
                <li>Select multiple jobs</li>
                <li>Send jobs via email</li>
                <li>Priority job matching</li>
                <li>Advanced filters</li>
              </ul>
              <Link to="/premium" className="cta-button">
                Upgrade Now
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>⚡ Quick Actions</h2>
          </div>
          
          <div className="quick-actions">
            <Link to="/jobs" className="action-button">
              <span className="action-icon">🔍</span>
              <span>Browse All Jobs</span>
            </Link>
            
            <Link to="/premium" className="action-button">
              <span className="action-icon">⭐</span>
              <span>Premium Features</span>
            </Link>
            
            {resumeData && (
              <button 
                onClick={fetchMatchedJobs}
                className="action-button"
              >
                <span className="action-icon">🔄</span>
                <span>Refresh Matches</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
