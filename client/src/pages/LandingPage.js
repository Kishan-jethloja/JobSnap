import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Dream Job with
            <span className="highlight"> AI-Powered Matching</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume, let our AI analyze your skills, and get matched with 
            the perfect remote job opportunities from top companies worldwide.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="cta-button primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="cta-button primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="cta-button secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">
            <div className="card-header">
              <div className="avatar">👨‍💻</div>
              <div className="user-info">
                <h4>John Developer</h4>
                <p>Full Stack Developer</p>
              </div>
            </div>
            <div className="skills">
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">MongoDB</span>
            </div>
            <div className="match-score">
              <span className="score">95% Match</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose JobSnap?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Smart Resume Analysis</h3>
              <p>
                Our AI extracts skills and experience from your resume, 
                ensuring accurate job matching.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Precise Job Matching</h3>
              <p>
                Get matched with jobs that actually fit your skills and experience level.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Opportunities</h3>
              <p>
                Access remote jobs from top companies worldwide, 
                no matter where you're located.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>
                Get job matches within seconds of uploading your resume.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📧</div>
              <h3>Email Integration</h3>
              <p>
                Premium users can send selected jobs directly to their email.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>
                Your resume and personal data are encrypted and kept secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Resume</h3>
              <p>Simply drag and drop your PDF resume or click to upload</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI extracts your skills and experience automatically</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Matches</h3>
              <p>Browse jobs that match your profile with match percentages</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Apply & Connect</h3>
              <p>Apply directly or save jobs for later with premium features</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Dream Job?</h2>
          <p>Join thousands of professionals who have found their perfect remote position</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="cta-button primary large">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="cta-button primary large">
              Start Your Journey
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
