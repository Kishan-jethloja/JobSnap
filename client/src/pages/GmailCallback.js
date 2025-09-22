import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gmailAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const GmailCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Connecting your Gmail account...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract authorization code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Gmail connection was cancelled or failed.');
          setTimeout(() => navigate('/selected-jobs'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received.');
          setTimeout(() => navigate('/selected-jobs'), 3000);
          return;
        }

        // Send code to backend
        const response = await gmailAPI.handleCallback(code);
        
        setStatus('success');
        setMessage(`Successfully connected ${response.data.gmailEmail}!`);
        
        // Handle popup flow
        if (window.opener) {
          // This is running in a popup window
          window.opener.postMessage({ type: 'GMAIL_CONNECTED', success: true }, '*');
          window.close();
        } else {
          // This is running in the main window
          setTimeout(() => {
            navigate('/selected');
          }, 2000);
        }

      } catch (error) {
        console.error('Gmail callback error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to connect Gmail account.');
        // Handle popup flow
        if (window.opener) {
          // This is running in a popup window
          window.opener.postMessage({ type: 'GMAIL_CONNECTED', success: false }, '*');
          window.close();
        } else {
          // This is running in the main window
          setTimeout(() => {
            navigate('/selected');
          }, 3000);
        }
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          {status === 'processing' && (
            <>
              <LoadingSpinner size="lg" />
              <h2 className="text-2xl font-bold text-white mt-4 mb-2">Connecting Gmail</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Success!</h2>
              <p className="text-gray-300">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting you back...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XMarkIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Connection Failed</h2>
              <p className="text-gray-300">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting you back...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GmailCallback;
