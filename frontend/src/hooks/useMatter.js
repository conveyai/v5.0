import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

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