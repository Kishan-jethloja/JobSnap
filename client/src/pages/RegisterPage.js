import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/25">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent mb-3">
              Join JobSnap
            </h1>
            <p className="text-slate-400 text-lg">
              Create your account and start your job search journey
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
                {/* Name Field */}
                <div className="floating-label-group">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="floating-input pl-12"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="name" className="floating-label ml-12">
                      Full Name
                    </label>
                  </div>
                </div>

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

                {/* Confirm Password Field */}
                <div className="floating-label-group">
                  <div className="relative">
                    <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="floating-input pl-12 pr-12"
                      placeholder=" "
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="confirmPassword" className="floating-label ml-12">
                      Confirm Password
                    </label>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors z-10"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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
                      <span className="ml-3">Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Footer Links */}
              <div className="text-center pt-6 border-t border-gray-700/50">
                <p className="text-slate-400">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text hover:from-purple-300 hover:to-indigo-300 transition-all"
                  >
                    Sign In
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

export default RegisterPage;
