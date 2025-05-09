// frontend/src/hooks/useContracts.js
import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export const useCreateContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createContract = async (matterId, folioIdentifier) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/contracts', {
        matterId,
        folioIdentifier
      });
      
      toast.success('Contract created successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating contract:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create contract';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createContract, loading, error };
};