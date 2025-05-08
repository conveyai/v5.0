import React, { useState } from 'react';
import { useTodos, useCreateTodo, useCompleteTodo } from '../hooks/useTodos';
import TodoList from '../components/todos/TodoList';
import Loader from '../components/common/Loader';

const TodoLists = () => {
  const { todos, loading, error, refetch } = useTodos();
  const [showCompleted, setShowCompleted] = useState(false);
  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading to-do lists: {error}</div>;
  
  const filteredTodos = showCompleted 
    ? todos
    : todos.filter(todo => !todo.completed);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">To-Do Lists</h1>
        
        <div className="flex items-center">
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={() => setShowCompleted(!showCompleted)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Show completed</span>
          </label>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <TodoList todos={filteredTodos} refetch={refetch} />
      </div>
    </div>
  );
};

export default TodoLists;