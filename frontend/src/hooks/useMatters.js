import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export const useMatters = () => {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMatters = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/matters');
        setMatters(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching matters:', err);
        setError(err.response?.data?.error || 'Failed to fetch matters');
        toast.error('Failed to fetch matters. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatters();
  }, []);
  
  const refetch = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/matters');
      setMatters(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching matters:', err);
      setError(err.response?.data?.error || 'Failed to fetch matters');
      toast.error('Failed to fetch matters. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { matters, loading, error, refetch };
};

export const useMatter = (id) => {
  const [matter, setMatter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMatter = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/api/matters/${id}`);
        setMatter(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching matter ${id}:`, err);
        setError(err.response?.data?.error || 'Failed to fetch matter details');
        toast.error('Failed to fetch matter details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatter();
  }, [id]);
  
  const refetch = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/matters/${id}`);
      setMatter(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching matter ${id}:`, err);
      setError(err.response?.data?.error || 'Failed to fetch matter details');
      toast.error('Failed to fetch matter details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { matter, loading, error, refetch };
};

export const useCreateMatter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createMatter = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/matters', data);
      toast.success('Matter created successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating matter:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create matter';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createMatter, loading, error };
};

export const useUpdateMatter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const updateMatter = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/matters/${id}`, data);
      toast.success('Matter updated successfully!');
      return response.data;
    } catch (err) {
      console.error(`Error updating matter ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to update matter';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { updateMatter, loading, error };
};

export const useArchiveMatter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const archiveMatter = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/matters/${id}/archive`);
      toast.success('Matter archived successfully!');
      return response.data;
    } catch (err) {
      console.error(`Error archiving matter ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to archive matter';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { archiveMatter, loading, error };
};