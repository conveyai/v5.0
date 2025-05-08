import React from 'react';
import { Link } from 'react-router-dom';

const RegisterFirm = ({ onPrevious, onSubmit, formData, setFormData, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us about your firm
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-1/2 border-b pb-2 text-gray-400">Account Details</div>
        <div className="w-1/2 border-b-2 border-indigo-600 pb-2">Firm Information</div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="mb-4">
            <label htmlFor="firm-name" className="block text-sm font-medium text-gray-700 mb-1">
              Firm Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firm-name"
              name="firmName"
              type="text"
              required
              value={formData.firmName}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="XYZ Conveyancing Pty Ltd"
            />
          </div>
          
          <div>
            <label htmlFor="firm-domain" className="block text-sm font-medium text-gray-700 mb-1">
              Firm Domain <span className="text-red-500">*</span>
            </label>
            <input
              id="firm-domain"
              name="firmDomain"
              type="text"
              required
              value={formData.firmDomain}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="yourfirm.com.au"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            This domain will be used to identify your firm when logging in.
          </p>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            type="button"
            onClick={onPrevious}
            className="w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Creating..." : "Complete Registration"}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <p className="text-sm">
            Already have an account? 
            <Link to="/login" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterFirm;