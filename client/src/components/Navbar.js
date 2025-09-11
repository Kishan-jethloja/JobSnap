import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: HomeIcon, auth: false },
    { name: 'Jobs', href: '/jobs', icon: BriefcaseIcon, auth: true },
    { name: 'Resume', href: '/resume', icon: DocumentTextIcon, auth: true },
    { name: 'Premium', href: '/premium', icon: StarIcon, auth: true },
    { name: 'Dashboard', href: '/dashboard', icon: Cog6ToothIcon, auth: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-glass fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-2xl font-bold gradient-text">JobSnap</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-lg'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">Hi, {user?.name}</p>
                    {isPremium && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                        ✨ PREMIUM
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-1 p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{user?.name?.charAt(0)}</span>
                      </div>
                      <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                    </button>
                    
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 glass-card py-2 animate-slide-up">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-slate-700/50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 rounded-xl animate-slide-up">
          <div className="px-2 py-4 space-y-2">
            {isAuthenticated && (
              <div className="px-4 py-3 border-b border-slate-600/50 mb-2">
                <p className="text-white font-medium">Hi, {user?.name}</p>
                {isPremium && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black mt-1">
                    ✨ PREMIUM
                  </span>
                )}
              </div>
            )}
            
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 border-t border-slate-600/50 mt-2 pt-4"
              >
                <XMarkIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="space-y-2 border-t border-slate-600/50 pt-4 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
