import React from 'react';
import { Link } from 'react-router-dom';
import { useMatters } from '../hooks/useMatters';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate } from '../utils/formatters';

const ArchivedMatters = () => {
  const { matters, loading, error } = useMatters();
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading archived matters: {error}</div>;
  
  const archivedMatters = matters ? matters.filter(matter => matter.archived_at) : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Archived Matters</h1>
      </div>
      
      {archivedMatters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No archived matters found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matter Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archived Date
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {archivedMatters.map(matter => (
                <tr key={matter.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {matter.matter_type === 'Sale' ? matter.seller?.name : matter.buyer?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {matter.property_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {matter.matter_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {matter.property_value ? formatCurrency(matter.property_value) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(matter.archived_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                      to={`/matters/${matter.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArchivedMatters;