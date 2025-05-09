// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tenant } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const layoutStyle = tenant?.backgroundImage ? {
    backgroundImage: `url(${tenant.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {};

return (
    <div className="flex h-screen" style={layoutStyle}>
      {/* Add a semi-transparent overlay if using a background image */}
      {tenant?.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
      )}
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} tenant={tenant} />
        
        <main className="flex-1 overflow-y-auto p-4 bg-white bg-opacity-95">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;