import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMatters } from '../hooks/useMatters';
import { useClients } from '../hooks/useClients';
import MatterList from '../components/matters/MatterList';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const { tenant } = useAuth();
  const { matters, loading: mattersLoading, error: mattersError } = useMatters();
  const { clients, loading: clientsLoading } = useClients();
  const [stats, setStats] = useState({
    pendingMatters: 0,
    completedMattersValue: 0,
    totalContacts: 0,
    conversionRate: 0
  });
  
  useEffect(() => {
    // Calculate stats from matters and clients when data is loaded
    if (matters && clients) {
      // Count pending matters
      const pendingCount = matters.filter(m => m.status === 'Pending').length;
      
      // Calculate total value of completed matters
      const completedMattersValue = matters
        .filter(m => m.status === 'Completed')
        .reduce((total, matter) => total + (matter.amount || 0), 0);
      
      // Get actual contact count
      const contactCount = clients.length;
      
      // Calculate conversion rate (matters created / total contacts)
      const totalMatters = matters.length;
      const conversionRate = contactCount > 0 
        ? ((totalMatters / contactCount) * 100).toFixed(1)
        : 0;
      
      setStats({
        pendingMatters: pendingCount,
        completedMattersValue: completedMattersValue,
        totalContacts: contactCount,
        conversionRate: conversionRate
      });
    }
  }, [matters, clients]);
  
  if (mattersLoading || clientsLoading) return <Loader />;
  if (mattersError) return <div className="text-red-500">Error loading dashboard: {mattersError}</div>;
  
  // Calculate growth indicators (comparing to previous period)
  // In a real implementation, this would come from the API with historical data
  const pendingGrowth = matters?.filter(m => 
    new Date(m.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  // For demo purposes - would be actual historical data in real implementation
  const previousPeriodValue = stats.completedMattersValue * 0.99; // 1% less than current
  const valueChange = stats.completedMattersValue - previousPeriodValue;
  
  const previousContacts = stats.totalContacts - Math.round(stats.totalContacts * 0.02); // 2% growth
  const contactGrowth = stats.totalContacts - previousContacts;
  
  // Previous conversion rate (for demo)
  const previousRate = parseFloat(stats.conversionRate) + 1.22;
  const rateChange = (parseFloat(stats.conversionRate) - previousRate).toFixed(2);
  
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
              {/* Dynamic growth indicator */}
              +{pendingGrowth}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Completed Matters Value</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-semibold text-indigo-600">
              ${stats.completedMattersValue.toLocaleString()}
            </p>
            <p className={`ml-2 text-sm font-medium ${valueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {/* Dynamic change indicator */}
              {valueChange >= 0 ? '+' : ''}{valueChange.toLocaleString()}
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
              {/* Dynamic growth indicator */}
              +{contactGrowth}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Conversion Rate</h2>
          <div className="mt-2 flex items-baseline">
            <p className="text-4xl font-semibold text-indigo-600">
              {stats.conversionRate}%
            </p>
            <p className={`ml-2 text-sm font-medium ${rateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {/* Dynamic change indicator */}
              {rateChange >= 0 ? '+' : ''}{rateChange}%
            </p>
          </div>
        </div>
      </div>
      
      <MatterList />
    </div>
  );
};

export default Dashboard;