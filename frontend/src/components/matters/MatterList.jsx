// src/components/matters/MatterList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMatters } from '../../hooks/useMatters';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Loader from '../common/Loader';

const MatterList = () => {
  const { matters, loading, error } = useMatters();
  const [filteredMatters, setFilteredMatters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (matters) {
      setFilteredMatters(
        matters.filter(matter => 
          matter.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matter.buyer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matter.seller?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [matters, searchTerm]);
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading matters: {error.message}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-medium">Recent Open Matters</h2>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search matters..."
            className="border rounded-md px-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Matter Number
    </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Settlement Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
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
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMatters.map(matter => (
              <tr key={matter.id}>
              <td className="px-6 py-4 whitespace-nowrap">
        {matter.matter_number}
      </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matter.matter_type === 'Sale' ? matter.seller?.name : matter.buyer?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matter.settlement_date ? formatDate(matter.settlement_date) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {matter.matter_type === 'Sale' 
                    ? matter.seller?.phone 
                    : matter.buyer?.phone}
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
      
      <div className="px-6 py-4 flex items-center justify-between border-t">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Showing {filteredMatters.length} of {matters.length} matters
          </span>
        </div>
        
        <div className="flex space-x-2">
          {/* Pagination controls would go here */}
        </div>
      </div>
    </div>
  );
};

export default MatterList;