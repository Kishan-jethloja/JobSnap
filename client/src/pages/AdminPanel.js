import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { emailAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  EnvelopeIcon,
  StarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEmails, setRecentEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simple admin check - in production, this would be more robust
  const isAdmin = user?.email === 'admin@example.com';

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchAdminStats = async () => {
    try {
      const response = await emailAPI.getStats();
      setStats(response.data.stats);
      setRecentEmails(response.data.recentEmails || []);
    } catch (error) {
      setError('Failed to fetch admin statistics');
      console.error('Admin stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">
              You don't have permission to access the admin panel
            </p>
            <a href="/dashboard" className="btn-primary">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">
            System overview and statistics
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <UsersIcon className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Premium Users</p>
                  <p className="text-3xl font-bold text-white">{stats.premiumUsers}</p>
                  <p className="text-xs text-gray-500">
                    {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% of total
                  </p>
                </div>
                <StarIcon className="w-10 h-10 text-yellow-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Emails Sent</p>
                  <p className="text-3xl font-bold text-white">{stats.totalEmails}</p>
                </div>
                <EnvelopeIcon className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Job Selections</p>
                  <p className="text-3xl font-bold text-white">{stats.totalSelectedJobs}</p>
                </div>
                <ChartBarIcon className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </div>
        )}

        {/* Recent Email Activity */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Email Activity</h2>
          
          {recentEmails.length > 0 ? (
            <div className="space-y-4">
              {recentEmails.map((email, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{email.subject}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(email.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>To: {email.recipientEmail}</span>
                    <span>Jobs: {email.jobCount}</span>
                    {email.userId && (
                      <span>User: {email.userId.name || 'Unknown'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <EnvelopeIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent email activity</p>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">System Health</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Email Service</span>
                <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Job API</span>
                <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={fetchAdminStats}
                className="w-full btn-secondary text-left"
              >
                Refresh Statistics
              </button>
              <button
                onClick={() => window.location.href = '/jobs'}
                className="w-full btn-secondary text-left"
              >
                View Job Listings
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full btn-secondary text-left"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        <div className="mt-8 card bg-blue-900/20 border-blue-700/30">
          <h2 className="text-xl font-bold text-blue-400 mb-4">Admin Notes</h2>
          <div className="space-y-2 text-blue-300 text-sm">
            <p>• This is a demo admin panel. In production, implement proper role-based access control.</p>
            <p>• Add more detailed analytics, user management, and system monitoring features.</p>
            <p>• Consider implementing real-time updates using WebSockets or Server-Sent Events.</p>
            <p>• Add audit logging for admin actions and system changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
