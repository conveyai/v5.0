// src/components/matters/MatterDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMatter } from '../../hooks/useMatter';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Loader from '../common/Loader';
import TabNav from '../common/TabNav';
import DocumentList from '../documents/DocumentList';
import TodoList from '../todos/TodoList';
import ContactDetail from '../contacts/ContactDetail';

const MatterDetail = () => {
  const { id } = useParams();
  const { matter, loading, error } = useMatter(id);
  const [activeTab, setActiveTab] = useState('fileNotes');
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading matter: {error.message}</div>;
  if (!matter) return <div>Matter not found</div>;
  
  const tabs = [
    { id: 'fileNotes', label: 'File Notes' },
    { id: 'correspondence', label: 'Correspondence' },
    { id: 'documents', label: 'Documents' },
    { id: 'contract', label: 'Contract' },
    { id: 'todoList', label: 'To-Do List' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-medium">
            {matter.matter_number}: {matter.matter_type === 'Sale' 
          ? `${matter.seller?.name} sale of` 
          : `${matter.buyer?.name} purchase of`} {matter.property_address}
          </h2>
          
          <div className="flex space-x-2">
            <Link
              to="/matters"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm hover:bg-gray-50"
            >
              Back to Matters
            </Link>
          </div>
        </div>
        
        {matter.critical_alerts?.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="font-medium text-red-800">Critical Alerts</h3>
            <ul className="mt-2 list-disc list-inside text-red-700">
              {matter.critical_alerts.map((alert, index) => (
                <li key={index}>
                  {alert.alert_type}: {alert.alert_description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
        <div className="border rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700">Sale Price</label>
          <div className="mt-1 text-lg">{formatCurrency(matter.amount)}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700">Deposit</label>
          <div className="mt-1 text-lg">{matter.deposit_amount ? `${(matter.deposit_amount / matter.amount * 100).toFixed(0)}%` : '-'}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700">Deposit Paid</label>
          <div className="mt-1 text-lg">{formatCurrency(matter.deposit_paid)}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700">Cooling Off Period</label>
          <div className="mt-1 text-lg">{matter.cooling_off_period || '-'}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700">Settlement Date</label>
          <div className="mt-1 text-lg">{matter.settlement_date ? formatDate(matter.settlement_date) : '-'}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
        <button className="border rounded-md p-3 text-center hover:bg-gray-50">
          Vendor
        </button>
        
        <button className="border rounded-md p-3 text-center hover:bg-gray-50">
          Purchaser
        </button>
        
        <button className="border rounded-md p-3 text-center hover:bg-gray-50">
          Conveyancer
        </button>
        
        <button className="border rounded-md p-3 text-center hover:bg-gray-50">
          Agent
        </button>
      </div>
      
      <div className="p-4">
        <TabNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        
        <div className="mt-4">
          {activeTab === 'fileNotes' && (
            <div className="bg-gray-50 p-4 rounded-md min-h-[400px]">
              {/* File notes content */}
              <p className="text-gray-500 italic">No file notes yet.</p>
            </div>
          )}
          
          {activeTab === 'correspondence' && (
            <div className="space-y-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                New Email
              </button>
              
              <div className="space-y-2">
                {/* Correspondence list */}
                <p className="text-gray-500 italic">No correspondence yet.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <DocumentList matterId={matter.id} />
          )}
          
          {activeTab === 'contract' && (
            <div className="space-y-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                New Contract
              </button>
              
              <div className="space-y-2">
                {/* Contract list */}
                <p className="text-gray-500 italic">No contracts yet.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'todoList' && (
            <TodoList matterId={matter.id} todos={matter.todos} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MatterDetail;