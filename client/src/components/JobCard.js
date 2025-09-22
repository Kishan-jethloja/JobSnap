import React from 'react';
import { 
  BuildingOfficeIcon, 
  CalendarDaysIcon, 
  TagIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const JobCard = ({ job, isSelected, onSelect, isPremium, showCheckbox = true }) => {
  const handleCardClick = () => {
    if (showCheckbox && isPremium && onSelect) {
      onSelect(job);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };


  return (
    <div 
      className={`group relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:border-gray-600/50 ${
        isSelected ? 'ring-2 ring-indigo-500 bg-indigo-900/20 border-indigo-500/50' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <div className="absolute top-6 right-6 z-10">
          {isPremium ? (
            <div className="relative">
              {isSelected && (
                <CheckCircleIcon className="w-6 h-6 text-indigo-500 animate-bounce" />
              )}
              {!isSelected && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect && onSelect(job)}
                  className="w-6 h-6 text-indigo-600 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-indigo-500 focus:ring-2 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ) : (
            <div className="w-6 h-6 bg-gray-600/50 border-2 border-gray-500 rounded-lg opacity-50 cursor-not-allowed backdrop-blur-sm" 
                 title="Premium feature - Upgrade to select jobs" />
          )}
        </div>
      )}

      {/* Job Content */}
      <div className="pr-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:gradient-text transition-all duration-300">
                  {job.title}
                </h3>
                <div className="flex items-center text-slate-400">
                  <span className="text-sm font-medium">{job.company}</span>
                  {job.location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">{job.location}</span>
                    </>
                  )}
                  {job.salary && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-green-400 font-medium">{job.salary}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          {truncateText(job.description)}
        </p>



        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="text-xs text-slate-500 px-3 py-1">
                +{job.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center text-slate-500 text-sm">
            <CalendarDaysIcon className="w-4 h-4 mr-2" />
            <span>{formatDate(job.publication_date)}</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              const applicationUrl = job.applicationUrl || job.url;
              console.log('Job data:', job);
              console.log('Application URL:', applicationUrl);
              
              if (applicationUrl && applicationUrl !== '#' && applicationUrl !== '') {
                // Open the application URL in a new tab
                window.open(applicationUrl, '_blank', 'noopener,noreferrer');
              } else {
                alert(`Application URL not available for this job.\nJob: ${job.title}\nCompany: ${job.company}`);
              }
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Apply Now
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
