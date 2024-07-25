
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { fetchTodosAsync, createTodoAsync, deleteTodoAsync, updateTodoAsync } from './store/todoSlice';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import './styles/App.css';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);

  useEffect(() => {
    dispatch(fetchTodosAsync());
  }, [dispatch]);

  const handleAddTodo = (text: string) => {
    dispatch(createTodoAsync(text));
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodoAsync(id));
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      dispatch(updateTodoAsync({ id, updatedTodo: { completed: !todo.completed } }));
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading todos</div>; // Display the error message
  }

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <AddTodoForm onAdd={handleAddTodo} />
      <TodoList todos={todos} onDelete={handleDeleteTodo} onToggle={handleToggleTodo} />
    </div>
  );
};

export default App;
