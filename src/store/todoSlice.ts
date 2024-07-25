import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../types/todo';
import { fetchTodos, createTodo, deleteTodo, updateTodo } from '../api/todoApi';

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

export const fetchTodosAsync = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetchTodos();
  return response;
});

export const createTodoAsync = createAsyncThunk('todos/createTodo', async (text: string) => {
  const response = await createTodo(text);
  return response;
});

export const deleteTodoAsync = createAsyncThunk('todos/deleteTodo', async (id: number) => {
  await deleteTodo(id);
  return id;
});

export const updateTodoAsync = createAsyncThunk('todos/updateTodo', async ({ id, updatedTodo }: { id: number; updatedTodo: Partial<Todo> }) => {
  const response = await updateTodo(id, updatedTodo);
  return response;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(createTodoAsync.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index >= 0) {
          state.todos[index] = action.payload;
        }
      });
  },
});

export default todoSlice.reducer;
