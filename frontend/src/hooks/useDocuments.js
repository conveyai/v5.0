import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export const useMatterDocuments = (matterId, folderId = null) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!matterId) return;
      
      try {
        setLoading(true);
        const queryParams = folderId ? `?folderId=${folderId}` : '';
        const response = await api.get(`/api/matters/${matterId}/documents${queryParams}`);
        setDocuments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err.response?.data?.error || 'Failed to fetch documents');
        toast.error('Failed to fetch documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [matterId, folderId]);
  
  const refetch = async () => {
    if (!matterId) return;
    
    try {
      setLoading(true);
      const queryParams = folderId ? `?folderId=${folderId}` : '';
      const response = await api.get(`/api/matters/${matterId}/documents${queryParams}`);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.error || 'Failed to fetch documents');
      toast.error('Failed to fetch documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { documents, loading, error, refetch };
};

export const useMatterDocumentFolders = (matterId, parentFolderId = null) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFolders = async () => {
      if (!matterId) return;
      
      try {
        setLoading(true);
        const queryParams = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
        const response = await api.get(`/api/matters/${matterId}/document-folders${queryParams}`);
        setFolders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching document folders:', err);
        setError(err.response?.data?.error || 'Failed to fetch document folders');
        toast.error('Failed to fetch document folders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFolders();
  }, [matterId, parentFolderId]);
  
  const refetch = async () => {
    if (!matterId) return;
    
    try {
      setLoading(true);
      const queryParams = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
      const response = await api.get(`/api/matters/${matterId}/document-folders${queryParams}`);
      setFolders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching document folders:', err);
      setError(err.response?.data?.error || 'Failed to fetch document folders');
      toast.error('Failed to fetch document folders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { folders, loading, error, refetch };
};

export const useDocument = (id) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/api/documents/${id}`);
        setDocument(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching document ${id}:`, err);
        setError(err.response?.data?.error || 'Failed to fetch document');
        toast.error('Failed to fetch document. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [id]);
  
  return { document, loading, error };
};

export const useUploadDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const uploadDocument = async ({ matterId, folderId, file, name, category, description }) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('matterId', matterId);
      formData.append('name', name);
      formData.append('category', category);
      
      if (folderId) {
        formData.append('parent_folder_id', folderId);
      }
      
      if (description) {
        formData.append('description', description);
      }
      
      const response = await api.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Document uploaded successfully!');
      return response.data;
    } catch (err) {
      console.error('Error uploading document:', err);
      const errorMessage = err.response?.data?.error || 'Failed to upload document';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { uploadDocument, loading, error };
};

export const useCreateDocumentFolder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createFolder = async ({ matterId, parentFolderId, name }) => {
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        name,
        parentFolderId: parentFolderId || null
      };
      
      const response = await api.post(`/api/matters/${matterId}/document-folders`, payload);
      toast.success('Folder created successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating folder:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create folder';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createFolder, loading, error };
};

export const useDeleteDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const deleteDocument = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/api/documents/${id}`);
      toast.success('Document deleted successfully!');
      return true;
    } catch (err) {
      console.error(`Error deleting document ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to delete document';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { deleteDocument, loading, error };
};