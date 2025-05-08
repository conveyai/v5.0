import React from 'react';
import { Link } from 'react-router-dom';
import NewMatterForm from '../components/matters/NewMatterForm';

const NewMatter = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">New Matter</h1>
        
        <div className="space-x-3">
          <Link
            to="/matters"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>
      
      <NewMatterForm />
    </div>
  );
};

export default NewMatter;