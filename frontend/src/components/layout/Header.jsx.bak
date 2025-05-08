// src/components/layout/Header.jsx
import React from 'react';
import { MenuIcon, BellIcon, UserCircleIcon } from '@heroicons/react/outline';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ toggleSidebar, tenant }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm flex items-center justify-between p-4">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4">
          <MenuIcon className="h-6 w-6 text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            ConveyAI
          </h1>
          <p className="text-sm text-gray-500">Real-time conveyancing</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-600" />
          <span className="ml-2 text-gray-700">{user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;