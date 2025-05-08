import React, { useEffect } from 'react';

const Modal = ({ title, children, onClose }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    
    // Cleanup when modal is closed
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
              
              <button 
                type="button"
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <i className="feather-x h-6 w-6"></i>
              </button>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;