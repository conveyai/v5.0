// src/components/documents/FolderCreate.jsx
import React, { useState } from 'react';
import { useCreateDocumentFolder } from '../../hooks/useDocuments';
import Modal from '../common/Modal';

const FolderCreate = ({ matterId, parentFolderId, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  
  const { createFolder, loading, error } = useCreateDocumentFolder();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createFolder({
        matterId,
        parentFolderId,
        name
      });
      
      onSuccess();
    } catch (err) {
      console.error('Create folder failed:', err);
    }
  };
  
  return (
    <Modal
      title="Create New Folder"
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            {error.message}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Folder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            disabled={loading || !name.trim()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Creating...' : 'Create Folder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FolderCreate;