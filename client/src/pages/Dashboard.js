import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, jobsAPI, premiumAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  EnvelopeIcon,
  StarIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  RocketLaunchIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState({
    hasResume: false,
    resumeSkills: [],
    matchedJobs: 0,
    emailsSent: 0
  });
  const [loading, setLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch resume data
      try {
        const resumeResponse = await resumeAPI.getMyResume();
        setStats(prev => ({
          ...prev,
          hasResume: true,
          resumeSkills: resumeResponse.data.resume.skills || []
        }));
      } catch (error) {
        // No resume found
        setStats(prev => ({ ...prev, hasResume: false }));
      }

      // Fetch premium status
      if (isPremium) {
        try {
          const premiumResponse = await premiumAPI.getStatus();
          setPremiumStatus(premiumResponse.data);
        } catch (error) {
          console.error('Failed to fetch premium status:', error);
        }
      }

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Upload your PDF resume to get started',
      icon: DocumentTextIcon,
      link: '/resume',
      gradient: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      title: 'Browse Jobs',
      description: 'Explore personalized job recommendations',
      icon: BriefcaseIcon,
      link: '/jobs',
      gradient: 'from-emerald-500 to-teal-500',
      available: stats.hasResume
    },
    {
      title: 'Send Jobs via Email',
      description: 'Email selected jobs to yourself',
      icon: EnvelopeIcon,
      link: '/jobs',
      gradient: 'from-purple-500 to-pink-500',
      available: isPremium && stats.hasResume
    },
    {
      title: 'Upgrade to Premium',
      description: 'Unlock advanced features',
      icon: StarIcon,
      link: '/premium',
      gradient: 'from-yellow-500 to-orange-500',
      available: !isPremium
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card text-center max-w-md">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="mb-12 animate-fade-in">
            <div className="glass-card bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-2 border-indigo-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/25">
                    <RocketLaunchIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-2">
                      Welcome back, {user?.name || 'User'}! 👋
                    </h1>
                    <p className="text-slate-400 text-lg">
                      Ready to find your next opportunity? Let's continue your job search journey.
                    </p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-slate-300 font-medium">Account Status</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {isPremium ? (
                        <>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                            ✨ PREMIUM
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 text-gray-300">
                          FREE TIER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Status Alert */}
          {isPremium && premiumStatus && (
            <div className="mb-8 animate-slide-up">
              <div className="glass-card border-2 border-gradient-to-r from-yellow-500/30 to-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <TrophyIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Premium Membership Active</h3>
                      <p className="text-slate-400">
                        {premiumStatus.daysRemaining > 0 
                          ? `${premiumStatus.daysRemaining} days remaining • Enjoy unlimited features`
                          : 'Expires soon • Renew to keep premium benefits'
                        }
                      </p>
                    </div>
                  </div>
                  <Link to="/premium" className="btn-secondary">
                    Manage Plan
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
            <div className="glass-card hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Resume Status</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stats.hasResume ? 'Uploaded' : 'Missing'}
                  </p>
                  <div className="flex items-center mt-2">
                    {stats.hasResume ? (
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400 mr-1" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-orange-400 mr-1" />
                    )}
                    <span className={`text-xs ${stats.hasResume ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {stats.hasResume ? 'Ready to match' : 'Upload needed'}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.hasResume ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-orange-500 to-red-500'}`}>
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="glass-card hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Skills Extracted</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.resumeSkills.length}</p>
                  <div className="flex items-center mt-2">
                    <ChartBarIcon className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-xs text-blue-400">
                      {stats.resumeSkills.length > 0 ? 'Skills identified' : 'No skills yet'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="glass-card hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Account Type</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {isPremium ? 'Premium' : 'Free'}
                  </p>
                  <div className="flex items-center mt-2">
                    <SparklesIcon className={`w-4 h-4 mr-1 ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`} />
                    <span className={`text-xs ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {isPremium ? 'All features unlocked' : 'Limited features'}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
                  <StarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="glass-card hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Emails Sent</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.emailsSent}</p>
                  <div className="flex items-center mt-2">
                    <EnvelopeIcon className="w-4 h-4 text-purple-400 mr-1" />
                    <span className="text-xs text-purple-400">
                      {isPremium ? 'Premium feature' : 'Upgrade needed'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-8">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <div key={index} className="relative animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <Link
                    to={action.link}
                    className={`block glass-card hover:scale-105 transition-all duration-300 ${action.available ? 'hover:shadow-2xl hover:shadow-indigo-500/10' : 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{action.description}</p>
                  </Link>
                  {!action.available && (
                    <div className="absolute inset-0 flex items-center justify-center glass-card bg-gray-900/80">
                      <span className="text-slate-400 text-sm font-medium text-center px-4">
                        {!stats.hasResume && action.title !== 'Upload Resume' && action.title !== 'Upgrade to Premium' 
                          ? 'Upload resume first' 
                          : isPremium && action.title === 'Upgrade to Premium' 
                          ? 'Already premium' 
                          : 'Not available'
                        }
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Overview */}
          {stats.hasResume && stats.resumeSkills.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-8">
                Your Skills
              </h2>
              <div className="glass-card">
                <div className="flex flex-wrap gap-3">
                  {stats.resumeSkills.slice(0, 15).map((skill, index) => (
                    <span
                      key={index}
                      className="skill-tag"
                    >
                      {skill}
                    </span>
                  ))}
                  {stats.resumeSkills.length > 15 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-slate-300 rounded-full text-sm font-medium border border-gray-500/30">
                      +{stats.resumeSkills.length - 15} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="glass-card">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-6">
              Recommended Next Steps
            </h2>
            <div className="space-y-4">
              {!stats.hasResume && (
                <div className="glass-card border-2 border-blue-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <PlusIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Upload Your Resume</p>
                      <p className="text-slate-400 text-sm">Get personalized job matches based on your skills and experience</p>
                    </div>
                    <Link to="/resume" className="btn-secondary text-sm">
                      Upload Now
                    </Link>
                  </div>
                </div>
              )}
              {stats.hasResume && !isPremium && (
                <div className="glass-card border-2 border-yellow-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <StarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Upgrade to Premium</p>
                      <p className="text-slate-400 text-sm">Unlock email features, advanced matching, and priority support</p>
                    </div>
                    <Link to="/premium" className="btn-glow text-sm">
                      Upgrade
                    </Link>
                  </div>
                </div>
              )}
              {stats.hasResume && (
                <div className="glass-card border-2 border-emerald-500/30">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <BriefcaseIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Browse Job Matches</p>
                      <p className="text-slate-400 text-sm">Explore jobs that match your skills and preferences</p>
                    </div>
                    <Link to="/jobs" className="btn-secondary text-sm">
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
