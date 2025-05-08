// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChecklistIcon,
  ArchiveBoxIcon,
  CogIcon,
  LogoutIcon
} from '@heroicons/react/outline';

const Sidebar = ({ open }) => {
  const { user, tenant, logout } = useAuth();

  return (
    <div className={`bg-gray-800 text-white ${open ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center">
        {tenant?.logo_path ? (
          <img 
            src={tenant.logo_path} 
            alt={tenant.name} 
            className="h-8" 
          />
        ) : (
          <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            {tenant?.name?.charAt(0) || 'C'}
          </div>
        )}
        
        {open && (
          <span className="ml-2 text-xl font-semibold">
            {tenant?.name || 'ConveyAI'}
          </span>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-2">
          <NavItem to="/" icon={<HomeIcon className="h-6 w-6" />} label="Dashboard" open={open} />
          <NavItem to="/matters" icon={<DocumentTextIcon className="h-6 w-6" />} label="Matters" open={open} />
          <NavItem to="/contacts" icon={<UserGroupIcon className="h-6 w-6" />} label="Contacts" open={open} />
          <NavItem to="/to-do-lists" icon={<ChecklistIcon className="h-6 w-6" />} label="To-Do Lists" open={open} />
          <NavItem to="/archived-matters" icon={<ArchiveBoxIcon className="h-6 w-6" />} label="Archived Matters" open={open} />
          <NavItem to="/settings" icon={<CogIcon className="h-6 w-6" />} label="Settings" open={open} />
        </ul>
      </nav>
      
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center text-gray-300 hover:text-white w-full"
        >
          <LogoutIcon className="h-6 w-6" />
          {open && <span className="ml-2">Log out</span>}
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, open }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-md ${isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'}`
      }
    >
      {icon}
      {open && <span className="ml-2">{label}</span>}
    </NavLink>
  </li>
);

export default Sidebar;