import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/clients');
        setClients(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err.response?.data?.error || 'Failed to fetch clients');
        toast.error('Failed to fetch clients. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  const refetch = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/clients');
      setClients(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.response?.data?.error || 'Failed to fetch clients');
      toast.error('Failed to fetch clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { clients, loading, error, refetch };
};

export const useClient = (id) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/api/clients/${id}`);
        setClient(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching client ${id}:`, err);
        setError(err.response?.data?.error || 'Failed to fetch client details');
        toast.error('Failed to fetch client details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [id]);
  
  const refetch = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/clients/${id}`);
      setClient(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching client ${id}:`, err);
      setError(err.response?.data?.error || 'Failed to fetch client details');
      toast.error('Failed to fetch client details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { client, loading, error, refetch };
};

export const useCreateClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createClient = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/clients', data);
      toast.success('Contact created successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating client:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create contact';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createClient, loading, error };
};

export const useUpdateClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const updateClient = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/clients/${id}`, data);
      toast.success('Contact updated successfully!');
      return response.data;
    } catch (err) {
      console.error(`Error updating client ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to update contact';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { updateClient, loading, error };
};

export const useVerifyClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const verifyClient = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/clients/${id}/verify`);
      toast.success('Contact verification successful!');
      return response.data;
    } catch (err) {
      console.error(`Error verifying client ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to verify contact';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { verifyClient, loading, error };
};