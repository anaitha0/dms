import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Hardcoded credentials for demo purposes
const USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
  { username: 'user', password: 'user123', name: 'Regular User', role: 'user' },
];

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = USERS.find(
        u => u.username === username && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Store token in localStorage (in a real app, this would be a JWT)
      const token = btoa(JSON.stringify({ 
        id: Date.now(), 
        username: user.username,
        name: user.name,
        role: user.role
      }));
      localStorage.setItem('auth_token', token);
      
      return {
        username: user.username,
        name: user.name,
        role: user.role
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('auth_token');
  return null;
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return null;
  }
  
  try {
    const userData = JSON.parse(atob(token));
    return {
      username: userData.username,
      name: userData.name,
      role: userData.role
    };
  } catch (error) {
    localStorage.removeItem('auth_token');
    return null;
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        toast.success('Welcome back!');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        toast.error(action.payload || 'Login failed');
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        toast.info('You have been logged out');
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;