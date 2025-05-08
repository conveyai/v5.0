import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCreateTodo, useUpdateTodo, useCompleteTodo } from '../../hooks/useTodos';
import { formatDate } from '../../utils/formatters';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

const TodoList = ({ todos, matterId, refetch }) => {
  const { createTodo, loading: createLoading } = useCreateTodo();
  const { updateTodo, loading: updateLoading } = useUpdateTodo();
  const { completeTodo, loading: completeLoading } = useCompleteTodo();
  
  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    matterId: matterId || '',
    dueDate: '',
    priority: 'MEDIUM'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    
    try {
      await createTodo({
        ...newTodo,
        matterId: matterId || newTodo.matterId
      });
      
      // Reset form
      setNewTodo({
        title: '',
        description: '',
        matterId: matterId || '',
        dueDate: '',
        priority: 'MEDIUM'
      });
      
      setShowAddTodoModal(false);
      
      // Refresh todo list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };
  
  const handleCompleteTodo = async (id) => {
    try {
      await completeTodo(id);
      
      // Refresh todo list
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to complete todo:', error);
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'red';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">To-Do List</h3>
        
        <button
          onClick={() => setShowAddTodoModal(true)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
        >
          Add Todo
        </button>
      </div>
      
      {todos?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No tasks yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {todos?.map(todo => (
            <li key={todo.id} className="py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={todo.status === 'COMPLETED'}
                    onChange={() => !todo.status === 'COMPLETED' && handleCompleteTodo(todo.id)}
                    disabled={todo.status === 'COMPLETED' || completeLoading}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${todo.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {todo.title}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      <Badge color={getPriorityColor(todo.priority)}>
                        {todo.priority.charAt(0) + todo.priority.slice(1).toLowerCase()}
                      </Badge>
                      
                      {todo.matterId && (
                        <Link
                          to={`/matters/${todo.matterId}`}
                          className="text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          View Matter
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {todo.description && (
                    <p className={`mt-1 text-sm ${todo.status === 'COMPLETED' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="mt-1 flex items-center">
                    {todo.dueDate && (
                      <span className={`text-xs ${todo.status === 'COMPLETED' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Due: {formatDate(todo.dueDate)}
                      </span>
                    )}
                    
                    {todo.assignedTo && (
                      <span className="ml-2 text-xs text-gray-500">
                        Assigned to: {todo.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {showAddTodoModal && (
        <Modal
          title="Add New Todo"
          onClose={() => setShowAddTodoModal(false)}
        >
          <form onSubmit={handleCreateTodo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newTodo.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={newTodo.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            {!matterId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Matter (Optional)
                </label>
                <input
                  type="text"
                  name="matterId"
                  value={newTodo.matterId}
                  onChange={handleInputChange}
                  placeholder="Enter matter ID"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date (Optional)
              </label>
              <input
                type="date"
                name="dueDate"
                value={newTodo.dueDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                name="priority"
                value={newTodo.priority}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddTodoModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={createLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {createLoading ? 'Adding...' : 'Add Todo'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TodoList;