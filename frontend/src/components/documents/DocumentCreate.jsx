// src/components/documents/DocumentCreate.jsx
import React, { useState, useEffect } from 'react';
import { usePrecedents } from '../../hooks/usePrecedents';
import { useUploadDocument } from '../../hooks/useDocuments';
import Modal from '../common/Modal';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

const DocumentCreate = ({ matterId, folderId, onSuccess, onCancel }) => {
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrecedentId, setSelectedPrecedentId] = useState('');
  const [useCustomContent, setUseCustomContent] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get precedents from API
  const { precedents, loading: precedentsLoading, error: precedentsError } = usePrecedents();
  const { uploadDocument, loading: uploadLoading, error: uploadError } = useUploadDocument();
  
  // Load precedent content when selected
  useEffect(() => {
    if (selectedPrecedentId) {
      const precedent = precedents.find(p => p.id === selectedPrecedentId);
      if (precedent) {
        // Update name and category if not already set
        if (!name) setName(precedent.name);
        if (category === 'GENERAL') setCategory(precedent.category || 'GENERAL');
        
        // Set description if available
        if (precedent.description) setDescription(precedent.description);
        
        // Set content if available
        if (precedent.content) {
          setContent(precedent.content);
          setUseCustomContent(false);
          setIsEditing(false);
        }
      }
    }
  }, [selectedPrecedentId, precedents, name, category]);
  
  const handlePrecedentChange = (e) => {
    const id = e.target.value;
    setSelectedPrecedentId(id);
    
    if (!id) {
      setUseCustomContent(true);
      setIsEditing(false);
      setContent('');
    }
  };
  
  const handleEditTemplate = () => {
    setUseCustomContent(true);
    setIsEditing(true);
  };
  
  const handleContentChange = (e) => {
    if (useCustomContent) {
      setContent(e.target.value);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a document name');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter document content');
      return;
    }
    
    try {
      // Convert content to file
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], `${name}.txt`, { type: 'text/plain' });
      
      await uploadDocument({
        matterId,
        folderId,
        file,
        name,
        category,
        description
      });
      
      toast.success('Document created successfully!');
      onSuccess();
    } catch (err) {
      console.error('Document creation failed:', err);
      toast.error('Failed to create document. Please try again.');
    }
  };
  
  if (precedentsLoading) {
    return (
      <Modal title="Create New Document" onClose={onCancel}>
        <div className="p-4 flex justify-center">
          <Loader />
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal
      title="Create New Document"
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {(uploadError || precedentsError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            {uploadError || precedentsError}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Document Name
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
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter a brief description of this document"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Use Precedent Template
          </label>
          <select
            value={selectedPrecedentId}
            onChange={handlePrecedentChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">None (Blank Document)</option>
            {precedents.map(precedent => (
              precedent.content && (
                <option key={precedent.id} value={precedent.id}>
                  {precedent.name}
                </option>
              )
            ))}
          </select>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Document Content
            </label>
            {selectedPrecedentId && !useCustomContent && (
              <button
                type="button"
                onClick={handleEditTemplate}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Edit Template
              </button>
            )}
          </div>
          <textarea
            value={content}
            onChange={handleContentChange}
            rows={12}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono ${
              !useCustomContent ? 'bg-gray-50' : ''
            }`}
            readOnly={!useCustomContent}
            placeholder="Enter document content here or select a precedent template"
          />
          {isEditing && (
            <p className="mt-1 text-xs text-gray-500 italic">
              You are editing a template. Your changes will only apply to this document.
            </p>
          )}
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
            disabled={uploadLoading || !name.trim() || !content.trim()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {uploadLoading ? 'Creating...' : 'Create Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DocumentCreate;