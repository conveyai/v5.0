// src/components/matters/NewMatterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../../hooks/useClients';
import { useCreateMatter } from '../../hooks/useMatters';
import Loader from '../common/Loader';

const NewMatterForm = () => {
  const navigate = useNavigate();
  const { clients, loading: clientsLoading } = useClients();
  const { createMatter, loading: createLoading, error } = useCreateMatter();
  
  const [formData, setFormData] = useState({
    matter_type: 'Sale',
    property_address: '',
    property_suburb: '',
    property_state: 'NSW',
    property_postcode: '',
    property_status: 'Pending',
    property_value: '',
    settlement_date: '',
    buyerId: '',
    sellerId: '',
    amount: '',
    deposit_amount: '',
    deposit_paid: '',
    cooling_off_period: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newMatter = await createMatter(formData);
      navigate(`/matters/${newMatter.id}`);
    } catch (error) {
      console.error('Failed to create matter:', error);
    }
  };
  
  if (clientsLoading) return <Loader />;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-medium">Add New Matter</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Matter Type
          </label>
          <select
            name="matter_type"
            value={formData.matter_type}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Sale">Sale</option>
            <option value="Purchase">Purchase</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Settlement Date
          </label>
          <input
            type="date"
            name="settlement_date"
            value={formData.settlement_date}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Property Address
          </label>
          <input
            type="text"
            name="property_address"
            value={formData.property_address}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Suburb
          </label>
          <input
            type="text"
            name="property_suburb"
            value={formData.property_suburb}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Postcode
          </label>
          <input
            type="text"
            name="property_postcode"
            value={formData.property_postcode}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seller Contact
          </label>
          <select
            name="sellerId"
            value={formData.sellerId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchaser Contact
          </label>
          <select
            name="buyerId"
            value={formData.buyerId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sale Price
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deposit Amount
          </label>
          <input
            type="number"
            name="deposit_amount"
            value={formData.deposit_amount}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deposit Paid
          </label>
          <input
            type="number"
            name="deposit_paid"
            value={formData.deposit_paid}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cooling Off Period
          </label>
          <input
            type="text"
            name="cooling_off_period"
            value={formData.cooling_off_period}
            onChange={handleChange}
            placeholder="e.g. 4 weeks"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/matters')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={createLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {createLoading ? 'Saving...' : 'Save Matter'}
        </button>
      </div>
    </form>
  );
};

export default NewMatterForm;