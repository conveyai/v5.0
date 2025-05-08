import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel',
  confirmColor = 'red',
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;
  
  const confirmClasses = {
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };
  
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-gray-700">
          {message}
        </p>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${confirmClasses[confirmColor]} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;