// src/components/precedents/PrecedentLibrary.jsx
import React, { useState, useEffect } from 'react';
import { usePrecedentFolders, usePrecedents } from '../../hooks/usePrecedents';
import PrecedentUpload from './PrecedentUpload';
import FolderCreate from './PrecedentFolderCreate';
import Loader from '../common/Loader';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { 
  FolderIcon, 
  DocumentIcon, 
  ChevronUpIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const PrecedentLibrary = () => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([{ id: null, name: 'Root' }]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  
  const { 
    folders, 
    loading: foldersLoading, 
    error: foldersError,
    refetch: refetchFolders
  } = usePrecedentFolders(currentFolderId);
  
  const {
    precedents,
    loading: precedentsLoading,
    error: precedentsError,
    refetch: refetchPrecedents
  } = usePrecedents(currentFolderId);
  
  const navigateToFolder = (folder) => {
    setCurrentFolderId(folder.id);
    setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }]);
  };
  
  const navigateUp = (index) => {
    const newPath = folderPath.slice(0, index + 1);
    setFolderPath(newPath);
    setCurrentFolderId(newPath[newPath.length - 1].id);
  };
  
  const handleUploadSuccess = () => {
    refetchPrecedents();
    setShowUploadModal(false);
  };
  
  const handleCreateFolderSuccess = () => {
    refetchFolders();
    setShowCreateFolderModal(false);
  };
  
  if (foldersLoading || precedentsLoading) return <Loader />;
  if (foldersError || precedentsError) return <div className="text-red-500">Error loading precedent library</div>;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {folderPath.map((folder, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <button
                onClick={() => navigateUp(index)}
                className="hover:text-indigo-600"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            New Folder
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
          >
            Upload Precedent
          </button>
        </div>
      </div>
      
      {folders.length === 0 && precedents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No precedents or folders in this location.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden border border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {folders.map(folder => (
                <tr key={folder.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigateToFolder(folder)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FolderIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-2">{folder.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Folder
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(folder.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                      {/* Edit and Delete actions would go here */}
                    </div>
                  </td>
                </tr>
              ))}
              
              {precedents.map(precedent => (
                <tr key={precedent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-blue-400" />
                      <span className="ml-2">{precedent.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {precedent.file_type || 'Document'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {precedent.file_size ? formatFileSize(precedent.file_size) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(precedent.uploaded_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-400 hover:text-blue-500">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showUploadModal && (
        <PrecedentUpload
          folderId={currentFolderId}
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUploadModal(false)}
        />
      )}
      
      {showCreateFolderModal && (
        <FolderCreate
          parentFolderId={currentFolderId}
          onSuccess={handleCreateFolderSuccess}
          onCancel={() => setShowCreateFolderModal(false)}
        />
      )}
    </div>
  );
};

export default PrecedentLibrary;