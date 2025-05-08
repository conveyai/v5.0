import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get current user profile
        const response = await api.get('/api/auth/me');
        
        setUser(response.data.user);
        setTenant(response.data.tenant);
        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('tenantDomain');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password, tenantDomain) => {
    try {
      setError(null);
      
      const response = await api.post('/api/auth/login', {
        email,
        password,
        tenantDomain
      });
      
      const { token, user, tenant } = response.data;
      
      // Save token and tenant domain to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('tenantDomain', tenant.domain);
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set domain header for tenant validation
      api.defaults.headers.common['x-tenant-domain'] = tenant.domain;
      
      setUser(user);
      setTenant(tenant);
      
      return { user, tenant };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantDomain');
    setUser(null);
    setTenant(null);
    delete api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['x-tenant-domain'];
    navigate('/login');
  };
  
  const forgotPassword = async (email, tenantDomain) => {
    try {
      setError(null);
      
      await api.post('/api/auth/forgot-password', {
        email,
        tenantDomain
      });
      
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Forgot password request failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send password reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      
      await api.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      
      toast.success('Password reset successful. You can now log in with your new password.');
      navigate('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const value = {
    user,
    tenant,
    loading,
    error,
    login,
    logout,
    forgotPassword,
    resetPassword
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};