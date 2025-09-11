import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  EnvelopeIcon,
  SparklesIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Smart Resume Parsing',
      description: 'Upload your PDF resume and our AI extracts your skills and experience automatically.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BriefcaseIcon,
      title: 'Personalized Job Matching',
      description: 'Get job recommendations tailored to your skills from thousands of remote opportunities.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: EnvelopeIcon,
      title: 'One-Click Email',
      description: 'Send selected jobs directly to your email with our premium bulk email feature.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: SparklesIcon,
      title: 'Premium Features',
      description: 'Unlock advanced matching, unlimited exports, and priority support.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const steps = [
    {
      icon: CloudArrowUpIcon,
      title: 'Upload Resume',
      description: 'Upload your PDF resume and our AI will extract your skills and experience',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Get Matches',
      description: 'Receive personalized job recommendations based on your skills and preferences',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Apply & Get Hired',
      description: 'Apply directly or use our premium email feature to send jobs to yourself',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animated-blob w-72 h-72 bg-indigo-500/20 top-10 -left-20 animate-float"></div>
        <div className="animated-blob w-96 h-96 bg-purple-500/20 top-40 -right-32 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="animated-blob w-80 h-80 bg-pink-500/20 bottom-20 left-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Find Your Dream Job with
                <span className="block gradient-text animate-pulse-slow">
                  JobSnap
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                AI-powered job matching that connects your skills with the perfect remote opportunities. 
                Upload, analyze, and get hired faster than ever before.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/resume"
                    className="btn-glow text-xl px-10 py-4 inline-flex items-center group"
                  >
                    <CloudArrowUpIcon className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                    Upload Resume
                  </Link>
                  <Link
                    to="/jobs"
                    className="btn-outline text-xl px-10 py-4 inline-flex items-center group"
                  >
                    <BriefcaseIcon className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-glow text-xl px-10 py-4 inline-flex items-center group"
                  >
                    Get Started Free
                    <ArrowRightIcon className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-outline text-xl px-10 py-4 inline-flex items-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="hero-card text-center">
                <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                <div className="text-slate-400">Jobs Available</div>
              </div>
              <div className="hero-card text-center">
                <div className="text-4xl font-bold gradient-text mb-2">95%</div>
                <div className="text-slate-400">Match Accuracy</div>
              </div>
              <div className="hero-card text-center">
                <div className="text-4xl font-bold gradient-text mb-2">2.5K+</div>
                <div className="text-slate-400">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="gradient-text">JobSnap</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our AI-powered platform revolutionizes job hunting with cutting-edge technology and personalized experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="hero-card text-center group" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Get matched with your dream job in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center group" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="relative mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-6`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-slate-600 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="hero-card">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your <span className="gradient-text">Dream Job</span>?
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Join thousands of professionals who have transformed their careers with JobSnap's AI-powered job matching
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn-glow text-xl px-12 py-4 inline-flex items-center group"
                >
                  Start Your Journey
                  <RocketLaunchIcon className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="btn-outline text-xl px-12 py-4 inline-flex items-center"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">J</span>
              </div>
              <span className="text-xl font-bold gradient-text">JobSnap</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="text-slate-400 text-sm mt-4 md:mt-0">
              © 2024 JobSnap. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
