import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Premium.css';

const Premium = () => {
  const { user, updateUser } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError('');

    try {
      const response = await axios.post('/api/premium/upgrade');
      updateUser(response.data.user);
      alert('Successfully upgraded to premium!');
    } catch (error) {
      setError(error.response?.data?.error || 'Error upgrading to premium');
    } finally {
      setUpgrading(false);
    }
  };

  const features = [
    {
      name: 'Resume Upload & Analysis',
      free: '✓',
      premium: '✓',
      description: 'Upload PDF resume and extract skills'
    },
    {
      name: 'Job Matching',
      free: '✓',
      premium: '✓',
      description: 'Get matched with relevant jobs'
    },
    {
      name: 'Browse Job Listings',
      free: '✓',
      premium: '✓',
      description: 'Search and filter job opportunities'
    },
    {
      name: 'Select Multiple Jobs',
      free: '✗',
      premium: '✓',
      description: 'Select multiple jobs for comparison'
    },
    {
      name: 'Email Job Sharing',
      free: '✗',
      premium: '✓',
      description: 'Send selected jobs via email'
    },
    {
      name: 'Priority Job Matching',
      free: '✗',
      premium: '✓',
      description: 'Get priority access to new jobs'
    },
    {
      name: 'Advanced Filters',
      free: 'Basic',
      premium: 'Advanced',
      description: 'More detailed search and filter options'
    },
    {
      name: 'Job Alerts',
      free: '✗',
      premium: '✓',
      description: 'Get notified about new matching jobs'
    }
  ];

  if (user?.isPremium) {
    return (
      <div className="premium-container">
        <div className="premium-header">
          <h1>⭐ Premium Account</h1>
          <p>You're already enjoying all premium features!</p>
        </div>

        <div className="premium-status">
          <div className="status-card">
            <h3>Your Premium Benefits</h3>
            <ul>
              <li>✓ Select multiple jobs</li>
              <li>✓ Send jobs via email</li>
              <li>✓ Priority job matching</li>
              <li>✓ Advanced filters</li>
              <li>✓ Job alerts</li>
            </ul>
            <div className="premium-expiry">
              {user.premiumExpiresAt ? (
                <p>Premium expires: {new Date(user.premiumExpiresAt).toLocaleDateString()}</p>
              ) : (
                <p>Lifetime premium access</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="premium-header">
        <h1>⭐ Upgrade to Premium</h1>
        <p>Unlock advanced features and boost your job search</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="pricing-section">
        <div className="pricing-cards">
          {/* Free Plan */}
          <div className="pricing-card free">
            <div className="plan-header">
              <h3>Free Plan</h3>
              <div className="price">
                <span className="amount">$0</span>
                <span className="period">/month</span>
              </div>
            </div>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index} className={feature.free === '✓' ? 'included' : 'not-included'}>
                  <span className="feature-icon">{feature.free}</span>
                  <div className="feature-info">
                    <span className="feature-name">{feature.name}</span>
                    <span className="feature-desc">{feature.description}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="plan-footer">
              <span className="current-plan">Current Plan</span>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card premium featured">
            <div className="plan-badge">Most Popular</div>
            <div className="plan-header">
              <h3>Premium Plan</h3>
              <div className="price">
                <span className="amount">$9.99</span>
                <span className="period">/month</span>
              </div>
            </div>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={index} className={feature.premium === '✓' ? 'included' : 'not-included'}>
                  <span className="feature-icon">{feature.premium}</span>
                  <div className="feature-info">
                    <span className="feature-name">{feature.name}</span>
                    <span className="feature-desc">{feature.description}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="plan-footer">
              <button 
                onClick={handleUpgrade}
                disabled={upgrading}
                className="upgrade-button"
              >
                {upgrading ? 'Upgrading...' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details */}
      <div className="feature-details">
        <h2>Why Choose Premium?</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">📧</div>
            <h3>Email Job Sharing</h3>
            <p>Select multiple jobs and send them directly to your email for easy reference and sharing with colleagues.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3>Priority Matching</h3>
            <p>Get first access to new job opportunities that match your skills and experience level.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Filters</h3>
            <p>Use detailed filters to find jobs by salary range, experience level, company size, and more.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔔</div>
            <h3>Job Alerts</h3>
            <p>Receive notifications when new jobs matching your criteria are posted.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I cancel my premium subscription?</h3>
            <p>Yes, you can cancel your premium subscription at any time. Your premium features will remain active until the end of your billing period.</p>
          </div>
          <div className="faq-item">
            <h3>How does job email sharing work?</h3>
            <p>Select multiple jobs from the job listings page and click "Send Selected Jobs". Enter an email address and receive a beautifully formatted email with all the job details.</p>
          </div>
          <div className="faq-item">
            <h3>Is my data secure?</h3>
            <p>Absolutely! We use industry-standard encryption to protect your resume and personal information. Your data is never shared with third parties.</p>
          </div>
          <div className="faq-item">
            <h3>Can I upgrade from free to premium anytime?</h3>
            <p>Yes, you can upgrade to premium at any time. The premium features will be immediately available after your upgrade.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
