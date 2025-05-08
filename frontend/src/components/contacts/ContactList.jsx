import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { formatPhoneNumber } from '../../utils/formatters';
import Loader from '../common/Loader';
import Badge from '../common/Badge';

const ContactList = () => {
  const { clients, loading, error } = useClients();
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (clients) {
      setFilteredClients(
        clients.filter(client => 
          client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone?.includes(searchTerm)
        )
      );
    }
  }, [clients, searchTerm]);
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading contacts: {error.message}</div>;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-medium">All Contacts</h2>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search contacts..."
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Verified
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.phone ? formatPhoneNumber(client.phone) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color={client.client_type === 'INDIVIDUAL' ? 'blue' : 'purple'}>
                    {client.client_type === 'INDIVIDUAL' ? 'Individual' : 
                     client.client_type === 'COMPANY' ? 'Company' : 'Trust'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color={client.identity_verified ? 'green' : 'gray'}>
                    {client.identity_verified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link 
                    to={`/contacts/${client.id}`}
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
            Showing {filteredClients.length} of {clients.length} contacts
          </span>
        </div>
        
        <div className="flex space-x-2">
          {/* Pagination controls would go here */}
        </div>
      </div>
    </div>
  );
};

export default ContactList;