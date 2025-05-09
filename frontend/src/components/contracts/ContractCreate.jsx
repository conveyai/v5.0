// Create the file at: frontend/src/components/contracts/ContractCreate.jsx
import React, { useState } from 'react';
import { useCreateContract } from '../../hooks/useContracts';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const ContractCreate = ({ matter, onSuccess, onCancel }) => {
  const [folioIdentifier, setFolioIdentifier] = useState(matter?.folio_identifier || '');
  const { createContract, loading, error } = useCreateContract();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!folioIdentifier) {
      alert('Please enter a folio identifier');
      return;
    }
    
    try {
      await createContract(matter.id, folioIdentifier);
      onSuccess();
    } catch (err) {
      console.error('Contract creation failed:', err);
    }
  };
  
  return (
    <Modal
      title="Create New Contract"
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Folio Identifier
          </label>
          <input
            type="text"
            value={folioIdentifier}
            onChange={(e) => setFolioIdentifier(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 1/SP12345"
          />
          <p className="mt-1 text-xs text-gray-500">
            This will be used to request the contract from Land Registry Services.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || !folioIdentifier.trim()}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <>
                <span className="inline-block mr-2">Creating...</span>
                <Loader size="sm" />
              </>
            ) : (
              'Create Contract'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContractCreate;