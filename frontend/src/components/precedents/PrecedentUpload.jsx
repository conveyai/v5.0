// src/components/precedents/PrecedentUpload.jsx
import React, { useState } from 'react';
import { useUploadPrecedent } from '../../hooks/usePrecedents';
import Modal from '../common/Modal';

const PrecedentUpload = ({ folderId, onSuccess, onCancel }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(''); // For text-based precedents
  
  const { uploadPrecedent, loading, error } = useUploadPrecedent();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile && !name) {
      setName(selectedFile.name);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file && !content) {
      alert('Please select a file or enter content for the precedent');
      return;
    }
    
    try {
      await uploadPrecedent({
        folderId,
        file,
        name: name || (file ? file.name : 'New Precedent'),
        category,
        description,
        content
      });
      
      onSuccess();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };
  
  return (
    <Modal
      title="Upload Precedent"
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            File (Optional if entering content directly)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precedent Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="GENERAL">General</option>
            <option value="CONTRACT">Contract</option>
            <option value="CORRESPONDENCE">Correspondence</option>
            <option value="IDENTIFICATION">Identification</option>
            <option value="FINANCIAL">Financial</option>
            <option value="LEGAL">Legal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content (Optional for text-based precedents)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter text content for the precedent (e.g. contract template)"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || (!file && !content)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PrecedentUpload;