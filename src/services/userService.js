import api from './api';

const userService = {
  getUsers: async ({ page = 1, per_page = 10, sort_by = 'id', order = 'asc', filters = [] }) => {
    try {
      return await api.post(`/users?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}`, filters);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },
  
  getUserById: async (userId) => {
    try {
      return await api.get(`/users/${userId}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user';
    }
  },
  
  createUser: async (userData) => {
    try {
      return await api.post('/users', userData);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create user';
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      return await api.put(`/users/${userId}`, userData);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user';
    }
  },
  
  deleteUser: async (userId) => {
    try {
      return await api.delete(`/users/${userId}`);
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  },
};

export default userService;