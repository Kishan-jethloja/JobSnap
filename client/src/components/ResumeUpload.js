import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUploadSuccess(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div className="resume-upload">
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="upload-content">
            <div className="upload-spinner"></div>
            <p>Processing your resume...</p>
            <p className="upload-subtitle">Extracting skills and analyzing content</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📄</div>
            {isDragActive ? (
              <>
                <h3>Drop your resume here</h3>
                <p>Release to upload your PDF resume</p>
              </>
            ) : (
              <>
                <h3>Upload Your Resume</h3>
                <p>Drag & drop your PDF resume here, or click to browse</p>
                <p className="upload-subtitle">
                  Supported format: PDF (max 5MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="upload-tips">
        <h4>Tips for better results:</h4>
        <ul>
          <li>Use a clear, well-formatted PDF resume</li>
          <li>Include your skills and technologies</li>
          <li>Make sure text is selectable (not scanned images)</li>
          <li>Keep file size under 5MB</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;
