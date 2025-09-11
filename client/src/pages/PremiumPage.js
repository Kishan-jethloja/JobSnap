import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { premiumAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  StarIcon, 
  CheckIcon, 
  XMarkIcon,
  SparklesIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BoltIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const PremiumPage = () => {
  const { user, isPremium, updateUser } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPremiumStatus();
  }, []);

  const fetchPremiumStatus = async () => {
    try {
      if (isPremium) {
        const response = await premiumAPI.getStatus();
        setPremiumStatus(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch premium status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan = 'monthly') => {
    setUpgrading(true);
    setError('');
    setSuccess('');

    try {
      const response = await premiumAPI.upgrade(plan);
      updateUser(response.data.user);
      setSuccess('Successfully upgraded to Premium! 🎉');
      setPremiumStatus({
        isPremium: true,
        premiumExpiresAt: response.data.expiresAt,
        daysRemaining: plan === 'monthly' ? 30 : 365
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Upgrade failed. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    setError('');
    setSuccess('');

    try {
      const response = await premiumAPI.cancel();
      updateUser(response.data.user);
      setSuccess('Premium subscription cancelled successfully.');
      setPremiumStatus(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Cancellation failed. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  const features = [
    {
      name: 'Job Selection & Email',
      free: false,
      premium: true,
      description: 'Select multiple jobs and send them to your email with one click'
    },
    {
      name: 'Advanced Job Matching',
      free: 'Basic',
      premium: 'Advanced',
      description: 'Get better job matches with enhanced AI algorithms'
    },
    {
      name: 'Resume Analysis',
      free: 'Basic',
      premium: 'Detailed',
      description: 'Comprehensive resume analysis with improvement suggestions'
    },
    {
      name: 'Job Applications',
      free: '10/month',
      premium: 'Unlimited',
      description: 'Apply to as many jobs as you want'
    },
    {
      name: 'Email Support',
      free: false,
      premium: true,
      description: 'Priority email support for all your questions'
    },
    {
      name: 'Job Alerts',
      free: false,
      premium: true,
      description: 'Get notified when new jobs match your skills'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative z-10">
          <LoadingSpinner size="lg" text="Loading premium information..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/20 animate-pulse">
                <TrophyIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
              JobSnap Premium
            </h1>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Unlock the full power of AI-driven job matching and premium features to accelerate your career
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-12 animate-fade-in">
              <div className="glass-card border-2 border-emerald-500/30 bg-emerald-900/20 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-300 font-medium">Success!</p>
                    <p className="text-emerald-400 text-sm">{success}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-12 animate-fade-in">
              <div className="glass-card border-2 border-red-500/30 bg-red-900/20 max-w-2xl mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <XMarkIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-300 font-medium">Error</p>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Status */}
          {isPremium && premiumStatus && (
            <div className="mb-16 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="glass-card border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/20 animate-pulse">
                      <TrophyIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center lg:text-left">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                        Premium Active
                      </h2>
                      <p className="text-yellow-300 text-lg font-medium">
                        {premiumStatus.daysRemaining > 0 
                          ? `${premiumStatus.daysRemaining} days remaining`
                          : 'Expires soon'
                        }
                      </p>
                      {premiumStatus.premiumExpiresAt && (
                        <p className="text-yellow-400 text-sm mt-1">
                          Expires: {new Date(premiumStatus.premiumExpiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    disabled={canceling}
                    className="btn-outline border-red-500 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {canceling ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Canceling...</span>
                      </>
                    ) : (
                      'Cancel Subscription'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          {!isPremium && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-fade-in" style={{animationDelay: '0.4s'}}>
              {/* Free Plan */}
              <div className="glass-card border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <StarIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Free</h3>
                  <div className="text-5xl font-bold text-white mb-4">
                    $0<span className="text-xl text-slate-400">/month</span>
                  </div>
                  <p className="text-slate-400 text-lg">Perfect for getting started</p>
                </div>
                <div className="space-y-4 mb-8">
                  {[
                    { text: "Basic job matching", included: true },
                    { text: "Resume upload & parsing", included: true },
                    { text: "10 job applications/month", included: true },
                    { text: "Job selection & email", included: false },
                    { text: "Priority support", included: false },
                    { text: "Advanced AI matching", included: false }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {feature.included ? (
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <XMarkIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className={feature.included ? "text-slate-300" : "text-slate-500"}>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="glass-card bg-slate-800/50 border border-slate-600/30">
                    <span className="text-slate-400 font-medium">Current Plan</span>
                  </div>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="glass-card border-2 border-gradient-to-r from-yellow-500 to-orange-500 relative overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl shadow-yellow-500/20">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-sm font-bold rounded-bl-xl">
                  <FireIcon className="w-4 h-4 inline mr-1" />
                  RECOMMENDED
                </div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">Premium</h3>
                  <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                    $9<span className="text-xl text-slate-400">/month</span>
                  </div>
                  <p className="text-slate-400 text-lg">Everything you need to land your dream job</p>
                </div>
                <div className="space-y-4 mb-8">
                  {[
                    "Advanced AI job matching",
                    "Job selection & email sending", 
                    "Unlimited applications",
                    "Detailed resume analysis",
                    "Priority email support",
                    "Job alerts & notifications"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleUpgrade('monthly')}
                  disabled={upgrading}
                  className="w-full btn-glow py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {upgrading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Upgrading...</span>
                    </>
                  ) : (
                    <>
                      <RocketLaunchIcon className="w-5 h-5 mr-2" />
                      Upgrade to Premium
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Feature Comparison */}
          <div className="mb-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent text-center mb-12">
              Feature Comparison
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-6 px-8 text-white font-bold text-lg">Feature</th>
                      <th className="text-center py-6 px-8 text-white font-bold text-lg">Free</th>
                      <th className="text-center py-6 px-8 text-white font-bold text-lg">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                        <td className="py-6 px-8">
                          <div>
                            <div className="text-white font-semibold text-lg mb-1">{feature.name}</div>
                            <div className="text-slate-400 text-sm leading-relaxed">{feature.description}</div>
                          </div>
                        </td>
                        <td className="text-center py-6 px-8">
                          {feature.free === true ? (
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                              <CheckIcon className="w-5 h-5 text-white" />
                            </div>
                          ) : feature.free === false ? (
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                              <XMarkIcon className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <span className="text-slate-300 font-medium">{feature.free}</span>
                          )}
                        </td>
                        <td className="text-center py-6 px-8">
                          {feature.premium === true ? (
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                              <CheckIcon className="w-5 h-5 text-white" />
                            </div>
                          ) : feature.premium === false ? (
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                              <XMarkIcon className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <span className="text-yellow-400 font-bold">{feature.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
            {[
              {
                icon: EnvelopeIcon,
                title: "One-Click Email",
                description: "Select multiple jobs and send them to your email with a single click",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: BoltIcon,
                title: "AI-Powered Matching",
                description: "Advanced AI algorithms provide more accurate job recommendations",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: ShieldCheckIcon,
                title: "Priority Support",
                description: "Get help when you need it with priority email support",
                gradient: "from-emerald-500 to-teal-500"
              }
            ].map((benefit, index) => (
              <div key={index} className="glass-card text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Note */}
          <div className="glass-card border-2 border-blue-500/30 bg-blue-900/20 animate-fade-in" style={{animationDelay: '1s'}}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-300 mb-3">Demo Mode</h3>
                <p className="text-blue-400 leading-relaxed">
                  This is a demo version of JobSnap. The premium upgrade is for demonstration purposes only. 
                  In a production environment, this would integrate with a payment processor like Stripe or Razorpay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
