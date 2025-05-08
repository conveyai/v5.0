import React from 'react';
import { Link } from 'react-router-dom';
import MatterList from '../components/matters/MatterList';

const Matters = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Matters</h1>
        
        <div className="space-x-3">
          <Link
            to="/matters/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            New Matter
          </Link>
        </div>
      </div>
      
      <MatterList />
    </div>
  );
};

export default Matters;