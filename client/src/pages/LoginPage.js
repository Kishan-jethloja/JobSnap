import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/25">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-lg">
              Sign in to continue your job search journey
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="glass-card border-2 border-red-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <div className="text-red-300">{error}</div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Email Field */}
                <div className="floating-label-group">
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="floating-input pl-12"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="email" className="floating-label ml-12">
                      Email Address
                    </label>
                  </div>
                </div>

                {/* Password Field */}
                <div className="floating-label-group">
                  <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="floating-input pl-12 pr-12"
                      placeholder=" "
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="password" className="floating-label ml-12">
                      Password
                    </label>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors z-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-glow py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-3">Signing In...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Footer Links */}
              <div className="text-center pt-6 border-t border-gray-700/50">
                <p className="text-slate-400">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="font-semibold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text hover:from-indigo-300 hover:to-purple-300 transition-all"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
