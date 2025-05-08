// src/hooks/usePrecedents.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export const usePrecedentFolders = (parentFolderId = null) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        const queryParams = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
        const response = await api.get(`/api/precedents/folders${queryParams}`);
        setFolders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching precedent folders:', err);
        setError(err.response?.data?.error || 'Failed to fetch precedent folders');
        toast.error('Failed to fetch precedent folders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFolders();
  }, [parentFolderId]);
  
  const refetch = async () => {
    try {
      setLoading(true);
      const queryParams = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
      const response = await api.get(`/api/precedents/folders${queryParams}`);
      setFolders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching precedent folders:', err);
      setError(err.response?.data?.error || 'Failed to fetch precedent folders');
      toast.error('Failed to fetch precedent folders. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { folders, loading, error, refetch };
};

export const usePrecedents = (folderId = null) => {
  const [precedents, setPrecedents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPrecedents = async () => {
      try {
        setLoading(true);
        const queryParams = folderId ? `?folderId=${folderId}` : '';
        const response = await api.get(`/api/precedents${queryParams}`);
        setPrecedents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching precedents:', err);
        setError(err.response?.data?.error || 'Failed to fetch precedents');
        toast.error('Failed to fetch precedents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrecedents();
  }, [folderId]);
  
  const refetch = async () => {
    try {
      setLoading(true);
      const queryParams = folderId ? `?folderId=${folderId}` : '';
      const response = await api.get(`/api/precedents${queryParams}`);
      setPrecedents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching precedents:', err);
      setError(err.response?.data?.error || 'Failed to fetch precedents');
      toast.error('Failed to fetch precedents. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { precedents, loading, error, refetch };
};

export const usePrecedent = (id) => {
  const [precedent, setPrecedent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPrecedent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/api/precedents/${id}`);
        setPrecedent(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching precedent ${id}:`, err);
        setError(err.response?.data?.error || 'Failed to fetch precedent');
        toast.error('Failed to fetch precedent. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrecedent();
  }, [id]);
  
  return { precedent, loading, error };
};

export const useCreatePrecedentFolder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createFolder = async ({ name, parentFolderId }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/precedents/folders', {
        name,
        parentFolderId
      });
      
      toast.success('Folder created successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating precedent folder:', err);
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

export const useUploadPrecedent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const uploadPrecedent = async ({ folderId, file, name, category, description, content }) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) {
        formData.append('folder_id', folderId);
      }
      formData.append('name', name);
      formData.append('category', category);
      
      if (description) {
        formData.append('description', description);
      }
      
      if (content) {
        formData.append('content', content);
      }
      
      const response = await api.post('/api/precedents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Precedent uploaded successfully!');
      return response.data;
    } catch (err) {
      console.error('Error uploading precedent:', err);
      const errorMessage = err.response?.data?.error || 'Failed to upload precedent';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { uploadPrecedent, loading, error };
};

export const useDeletePrecedent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const deletePrecedent = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/api/precedents/${id}`);
      toast.success('Precedent deleted successfully!');
      return true;
    } catch (err) {
      console.error(`Error deleting precedent ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to delete precedent';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { deletePrecedent, loading, error };
};