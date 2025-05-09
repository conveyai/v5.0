// frontend/src/components/common/FileUpload.jsx
import React, { useState } from 'react';
import api from '../../utils/api';

const FileUpload = ({ onUploadComplete, label, fileType = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Make the upload request
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });
      
      // Call the callback with the file URL
      onUploadComplete(response.data.fileUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label || "Upload File"}
      </label>
      <input
        type="file"
        accept={fileType}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100"
      />
      {uploading && (
        <div className="mt-2">
          <div className="bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{progress}% uploaded</span>
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;