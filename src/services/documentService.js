import api from './api';

const documentService = {
  getDocuments: async ({ page = 1, per_page = 10, sort_by = 'id', order = 'asc', filters = [] }) => {
    try {
      // Since our backend doesn't have a documents endpoint, we'll use the mockDocuments from our Redux slice
      // In a real app, this would be:
      // return await api.post(`/documents?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}`, filters);
      
      // Instead, we'll just return a Promise that resolves with mock data
      return Promise.resolve();
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch documents';
    }
  },
  
  getDocumentById: async (documentId) => {
    try {
      // In a real app, this would be:
      // return await api.get(`/documents/${documentId}`);
      
      // Instead, we'll just return a Promise that resolves with mock data
      return Promise.resolve();
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch document';
    }
  },
  
  createDocument: async (documentData) => {
    try {
      // In a real app, this would be:
      // return await api.post('/documents', documentData);
      
      // Instead, we'll just return a Promise that resolves with mock data
      return Promise.resolve();
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create document';
    }
  },
  
  updateDocument: async (documentId, documentData) => {
    try {
      // In a real app, this would be:
      // return await api.put(`/documents/${documentId}`, documentData);
      
      // Instead, we'll just return a Promise that resolves with mock data
      return Promise.resolve();
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update document';
    }
  },
  
  deleteDocument: async (documentId) => {
    try {
      // In a real app, this would be:
      // return await api.delete(`/documents/${documentId}`);
      
      // Instead, we'll just return a Promise that resolves with mock data
      return Promise.resolve();
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete document';
    }
  },
};

export default documentService;