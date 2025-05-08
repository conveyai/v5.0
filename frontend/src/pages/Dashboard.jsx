import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMatters } from '../hooks/useMatters';
import MatterList from '../components/matters/MatterList';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const { tenant } = useAuth();
  const { matters, loading, error } = useMatters();
  const [stats, setStats] = useState({
    pendingMatters: 0,
    completedMatters: 0,
    totalContacts: 0,
    conversionRate: 0
  });
  
  useEffect(() => {
    // Calculate stats from matters
    if (matters) {
      const pendingCount = matters.filter(m => m.status === 'Pending').length;
      const completedCount = matters.filter(m => m.status === 'Completed').length;
      
      setStats({
        pendingMatters: pendingCount,
        completedMatters: completedCount,
        totalContacts: tenant?.contactCount || 16703,
        conversionRate: tenant?.conversionRate || 12.8
      });
    }
  }, [matters, tenant]);
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading dashboard: {error}</div>;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="space-x-3">
          <Link
            to="/matters/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            New Matter
          </Link>
          
          <Link
            to="/contacts/new"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            New Client
          </Link>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Pool Compliance
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Pending Matters</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-semibold text-indigo-600">
              {stats.pendingMatters}
            </p>
            <p className="ml-2 text-sm font-medium text-green-600">
              {/* Growth indicator - This would come from real data */}
              +2,031
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Completed Matters</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-semibold text-indigo-600">
              ${(221324.50).toLocaleString()}
            </p>
            <p className="ml-2 text-sm font-medium text-red-600">
              {/* Change indicator - This would come from real data */}
              -$2,201
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Total Contacts</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-semibold text-indigo-600">
              {stats.totalContacts.toLocaleString()}
            </p>
            <p className="ml-2 text-sm font-medium text-green-600">
              {/* Growth indicator - This would come from real data */}
              +3,392
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Conversion Rate</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-semibold text-indigo-600">
              {stats.conversionRate}%
            </p>
            <p className="ml-2 text-sm font-medium text-red-600">
              {/* Change indicator - This would come from real data */}
              -1.22%
            </p>
          </div>
        </div>
      </div>
      
      <MatterList />
    </div>
  );
};

export default Dashboard;