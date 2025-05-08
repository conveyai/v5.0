import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Settings = () => {
  const { tenant, user, loading } = useAuth();
  const [generalForm, setGeneralForm] = useState({
    companyName: tenant?.name || '',
    logoUrl: tenant?.logo_path || '',
    primaryColor: tenant?.primaryColor || '#4F46E5'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    
    if (!tenant) return;
    
    try {
      setSavingGeneral(true);
      setError(null);
      
      const response = await api.put(`/api/tenants/${tenant.id}/settings`, {
        name: generalForm.companyName,
        logo_path: generalForm.logoUrl,
        primaryColor: generalForm.primaryColor
      });
      
      toast.success('Settings updated successfully!');
      
      // Update tenant in local state if needed
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.response?.data?.error || 'Failed to update settings');
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setSavingGeneral(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      setSavingPassword(true);
      setError(null);
      
      await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      toast.success('Password changed successfully!');
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.error || 'Failed to change password');
      toast.error('Failed to change password. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  };
  
  if (loading) return <Loader />;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium">General Settings</h2>
          
          <form onSubmit={handleGeneralSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={generalForm.companyName}
                onChange={(e) => setGeneralForm({ ...generalForm, companyName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="text"
                value={generalForm.logoUrl}
                onChange={(e) => setGeneralForm({ ...generalForm, logoUrl: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="color"
                  value={generalForm.primaryColor}
                  onChange={(e) => setGeneralForm({ ...generalForm, primaryColor: e.target.value })}
                  className="h-8 w-8 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={generalForm.primaryColor}
                  onChange={(e) => setGeneralForm({ ...generalForm, primaryColor: e.target.value })}
                  className="ml-2 block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingGeneral}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {savingGeneral ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium">Change Password</h2>
          
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {savingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;