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
import ContractCreate from '../contracts/ContractCreate';
import Modal from '../common/Modal';


const MatterDetail = () => {
  const { id } = useParams();
  const { matter, loading, error } = useMatter(id);
  const [activeTab, setActiveTab] = useState('fileNotes');
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactType, setContactType] = useState('');
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading matter: {error.message}</div>;
  if (!matter) return <div>Matter not found</div>;
  
  const handleShowContact = (type) => {
    if (type === 'vendor' && matter.seller) {
      setSelectedContact(matter.seller);
      setContactType('Vendor');
      setShowContactModal(true);
    } else if (type === 'purchaser' && matter.buyer) {
      setSelectedContact(matter.buyer);
      setContactType('Purchaser');
      setShowContactModal(true);
    } else {
      // Handle case when contact doesn't exist
      toast.warning(`No ${type === 'vendor' ? 'vendor' : 'purchaser'} associated with this matter.`);
    }
  };

  const tabs = [
    { id: 'fileNotes', label: 'File Notes' },
    { id: 'correspondence', label: 'Correspondence' },
    { id: 'documents', label: 'Documents' },
    { id: 'contract', label: 'Contract' },
    { id: 'todoList', label: 'To-Do List' }
  ];
  
  // Filter contracts
  const contracts = matter.documents?.filter(doc => doc.category === 'CONTRACT') || [];
  
  // Handle contract creation success
  const handleContractSuccess = () => {
    setShowContractModal(false);
    refetch(); // Refresh matter data to show new contract
  };
  
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
        <button 
          className="border rounded-md p-3 text-center hover:bg-gray-50"
          onClick={() => handleShowContact('vendor')}
        >
          Vendor
        </button>
        
        <button 
          className="border rounded-md p-3 text-center hover:bg-gray-50"
          onClick={() => handleShowContact('purchaser')}
        >
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
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => setShowContractModal(true)}
              >
                New Contract
              </button>
              
              <div className="space-y-2">
                {contracts.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {contracts.map(contract => (
                      <li key={contract.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{contract.name}</p>
                            <p className="text-sm text-gray-500">{contract.description}</p>
                            <p className="text-xs text-gray-400">
                              Created: {formatDate(contract.uploaded_at)}
                            </p>
                          </div>
                          <a 
                            href={contract.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200"
                          >
                            View
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No contracts yet.</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'todoList' && (
            <TodoList matterId={matter.id} todos={matter.todos} />
          )}
        </div>
      </div>
      {/* Contract creation modal */}
      {showContractModal && (
        <ContractCreate
          matter={matter}
          onSuccess={handleContractSuccess}
          onCancel={() => setShowContractModal(false)}
        />
      )}

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <Modal 
          title={`${contactType} Details: ${selectedContact.name}`}
          onClose={() => setShowContactModal(false)}
        >
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <div className="mt-1 text-sm text-gray-900">{selectedContact.name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 text-sm text-gray-900">{selectedContact.email || '-'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone number</label>
                <div className="mt-1 text-sm text-gray-900">{selectedContact.phone || '-'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 text-sm text-gray-900">{selectedContact.address || '-'}</div>
              </div>
              
              {selectedContact.identity_verified !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Identity verification</label>
                  <div className="mt-1 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedContact.identity_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedContact.identity_verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Link
                  to={`/contacts/${selectedContact.id}`}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Complete Profile
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
    </div>
  );
};

export default MatterDetail;