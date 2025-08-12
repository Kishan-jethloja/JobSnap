import React from 'react';
import './JobCard.css';

const JobCard = ({ job, isPremium, isSelected, onSelect }) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={`job-card ${isSelected ? 'selected' : ''}`}>
      {/* Premium Selection Checkbox */}
      {isPremium && (
        <div className="job-selection">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="job-checkbox"
          />
        </div>
      )}

      {/* Job Header */}
      <div className="job-header">
        <h3 className="job-title">
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="job-link"
          >
            {job.title}
          </a>
        </h3>
        
        {job.matchScore > 0 && (
          <div className="match-score">
            <span className="score-text">{Math.round(job.matchScore)}%</span>
            <span className="score-label">Match</span>
          </div>
        )}
      </div>

      {/* Company Info */}
      <div className="job-company">
        <span className="company-name">{job.company}</span>
        {job.location && (
          <span className="job-location">📍 {job.location}</span>
        )}
      </div>

      {/* Salary Info */}
      {job.salary && (
        <div className="job-salary">
          💰 {job.salary}
        </div>
      )}

      {/* Job Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="job-tags">
          {job.tags.slice(0, 5).map((tag, index) => (
            <span key={index} className="job-tag">
              {tag}
            </span>
          ))}
          {job.tags.length > 5 && (
            <span className="more-tags">+{job.tags.length - 5} more</span>
          )}
        </div>
      )}

      {/* Job Description */}
      <div className="job-description">
        <p>{truncateText(job.description, 200)}</p>
      </div>

      {/* Job Actions */}
      <div className="job-actions">
        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="apply-button"
        >
          Apply Now
        </a>
        
        {!isPremium && (
          <div className="premium-notice">
            <span className="premium-icon">⭐</span>
            <span>Upgrade to select jobs</span>
          </div>
        )}
      </div>

      {/* Job Meta */}
      <div className="job-meta">
        {job.publishedAt && (
          <span className="job-date">
            Posted: {new Date(job.publishedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
