import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUpdateClient, useVerifyClient } from '../../hooks/useClients';
import { formatDate, formatPhoneNumber } from '../../utils/formatters';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';

const ContactDetail = ({ client }) => {
  const navigate = useNavigate();
  const { updateClient, loading: updateLoading } = useUpdateClient();
  const { verifyClient, loading: verifyLoading } = useVerifyClient();
  
  const [editing, setEditing] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email || '',
    phone: client.phone || '',
    address: client.address || '',
    client_type: client.client_type,
    notes: client.notes || '',
    identification_type: client.identification_type || 'DRIVERS_LICENSE',
    identification_number: client.identification_number || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateClient(client.id, formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };
  
  const handleVerify = async () => {
    try {
      await verifyClient(client.id);
      setShowVerifyDialog(false);
    } catch (error) {
      console.error('Failed to verify contact:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{client.name}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Contact Details
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to="/contacts"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Contacts
          </Link>
          
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      
      {editing ? (
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Client Type
                </label>
                <select
                  name="client_type"
                  value={formData.client_type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="COMPANY">Company</option>
                  <option value="TRUST">Trust</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={updateLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.email || '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Phone number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.phone ? formatPhoneNumber(client.phone) : '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.address || '-'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Client type
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Badge color={client.client_type === 'INDIVIDUAL' ? 'blue' : 'purple'}>
                  {client.client_type === 'INDIVIDUAL' ? 'Individual' : 
                   client.client_type === 'COMPANY' ? 'Company' : 'Trust'}
                </Badge>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Identity verification
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Badge color={client.identity_verified ? 'green' : 'gray'}>
                  {client.identity_verified ? 'Verified' : 'Not Verified'}
                </Badge>
                
                {!client.identity_verified && (
                  <button
                    onClick={() => setShowVerifyDialog(true)}
                    className="ml-4 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Verify Now
                  </button>
                )}
              </dd>
            </div>
            
            {client.identity_verified && (
              <>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Identification type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {client.identification_type === 'DRIVERS_LICENSE' ? "Driver's License" : 
                     client.identification_type === 'PASSPORT' ? 'Passport' : 
                     client.identification_type === 'MEDICARE' ? 'Medicare Card' : 
                     client.identification_type}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Identification number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {client.identification_number}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Verified on
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {client.verified_at ? formatDate(client.verified_at) : '-'}
                  </dd>
                </div>
              </>
            )}
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Notes
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {client.notes || '-'}
              </dd>
            </div>
          </dl>
        </div>
      )}
      
      {showVerifyDialog && (
        <ConfirmDialog
          isOpen={showVerifyDialog}
          title="Verify Client Identity"
          message="Have you checked the client's identification documents and confirmed their identity?"
          confirmLabel="Verify Identity"
          confirmColor="green"
          onConfirm={handleVerify}
          onCancel={() => setShowVerifyDialog(false)}
        />
      )}
    </div>
  );
};

export default ContactDetail;