import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Matters from './pages/Matters';
import MatterDetail from './pages/MatterDetail';
import NewMatter from './pages/NewMatter';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import NewContact from './pages/NewContact';
import TodoLists from './pages/TodoLists';
import ArchivedMatters from './pages/ArchivedMatters';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Auth component
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/matters" element={<Matters />} />
            <Route path="/matters/new" element={<NewMatter />} />
            <Route path="/matters/:id" element={<MatterDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/new" element={<NewContact />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
            <Route path="/to-do-lists" element={<TodoLists />} />
            <Route path="/archived-matters" element={<ArchivedMatters />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;