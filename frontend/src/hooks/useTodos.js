import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/todos');
        setTodos(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError(err.response?.data?.error || 'Failed to fetch todos');
        toast.error('Failed to fetch todo list. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodos();
  }, []);
  
  const refetch = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/todos');
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(err.response?.data?.error || 'Failed to fetch todos');
      toast.error('Failed to fetch todo list. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { todos, loading, error, refetch };
};

export const useMatterTodos = (matterId) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTodos = async () => {
      if (!matterId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/api/todos/matter/${matterId}`);
        setTodos(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching todos for matter ${matterId}:`, err);
        setError(err.response?.data?.error || 'Failed to fetch todos for this matter');
        toast.error('Failed to fetch todos for this matter. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodos();
  }, [matterId]);
  
  const refetch = async () => {
    if (!matterId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/todos/matter/${matterId}`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching todos for matter ${matterId}:`, err);
      setError(err.response?.data?.error || 'Failed to fetch todos for this matter');
      toast.error('Failed to fetch todos for this matter. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return { todos, loading, error, refetch };
};

export const useCreateTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createTodo = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/todos', data);
      toast.success('Todo added successfully!');
      return response.data;
    } catch (err) {
      console.error('Error creating todo:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create todo';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createTodo, loading, error };
};

export const useUpdateTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const updateTodo = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/todos/${id}`, data);
      toast.success('Todo updated successfully!');
      return response.data;
    } catch (err) {
      console.error(`Error updating todo ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to update todo';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { updateTodo, loading, error };
};

export const useCompleteTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const completeTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/todos/${id}/complete`);
      toast.success('Todo marked as completed!');
      return response.data;
    } catch (err) {
      console.error(`Error completing todo ${id}:`, err);
      const errorMessage = err.response?.data?.error || 'Failed to complete todo';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { completeTodo, loading, error };
};