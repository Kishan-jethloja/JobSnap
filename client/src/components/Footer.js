import React from 'react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20">
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between text-slate-400 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">JobSnap</span>
          </div>
          <div>© {currentYear} — Find jobs that match your skills.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
