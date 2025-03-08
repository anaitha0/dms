import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import userService from '../services/userService';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await userService.getUsers(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real app, this would make a POST call
      // Since we have a mock backend, we'll simulate creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: Date.now(),
        ...userData
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real app, this would make a PUT call
      // Since we have a mock backend, we'll simulate update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      // In a real app, this would make a DELETE call
      // Since we have a mock backend, we'll simulate deletion
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    pagination: {
      total_records: 0,
      total_pages: 0,
      current_page: 1,
      per_page: 10,
      has_next: false,
      has_prev: false,
    },
    sort: {
      sort_by: 'id',
      order: 'asc',
    },
    filters: [],
    search: '',
    selected: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = [];
      state.search = '';
    },
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.sort = action.payload.sort;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Failed to fetch users');
      })
      
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        toast.success('User created successfully');
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error('Failed to create user');
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        toast.success('User updated successfully');
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error('Failed to update user');
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        toast.success('User deleted successfully');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error('Failed to delete user');
      });
  },
});

export const {
  setSearch,
  setSort,
  setFilters,
  setPagination,
  resetFilters,
  clearSelected,
} = userSlice.actions;

export default userSlice.reducer;