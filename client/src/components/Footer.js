import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Job Matching', href: '/jobs' },
      { name: 'Resume Upload', href: '/resume' },
      { name: 'Premium', href: '/premium' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Status', href: '/status' }
    ]
  };

  return (
    <footer className="relative mt-20">
      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-16"></div>
      
      {/* Main Footer Content */}
      <div className="glass-card border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  JobSnap
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                AI-powered job matching platform that connects talented professionals with their dream opportunities. 
                Upload your resume and let our smart algorithms find the perfect matches.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com/jobsnap`}
                    className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/20"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400 mr-2" />
                Product
              </h3>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-blue-400 mr-2" />
                Company
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <EnvelopeIcon className="w-5 h-5 text-emerald-400 mr-2" />
                Support
              </h3>
              <ul className="space-y-4 mb-8">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-400">
                  <EnvelopeIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">support@jobsnap.com</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <PhoneIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-400">
                  <MapPinIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 pt-8 border-t border-slate-700/50">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-slate-400 mb-6">
                Get the latest job opportunities and career tips delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="btn-glow px-6 py-3 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <span>© {currentYear} JobSnap. All rights reserved.</span>
              </div>
              
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <span>Made with</span>
                <HeartIcon className="w-4 h-4 text-red-400 animate-pulse" />
                <span>by the JobSnap team</span>
                <CodeBracketIcon className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
