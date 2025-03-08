import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Mock document data
const mockDocuments = Array(50).fill().map((_, index) => ({
  id: index + 1,
  title: `Document ${index + 1}`,
  description: `This is the description for document ${index + 1}`,
  type: ['PDF', 'DOCX', 'XLS', 'TXT', 'JPG'][Math.floor(Math.random() * 5)],
  size: Math.floor(Math.random() * 10000) + 100,
  created_by: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'][Math.floor(Math.random() * 4)],
  created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  updated_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  status: ['Draft', 'Published', 'Archived', 'Under Review'][Math.floor(Math.random() * 4)],
  tags: ['Important', 'Confidential', 'Public', 'Internal', 'External', 'Legal']
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
}));

// Async thunks
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async ({ page = 1, per_page = 10, search = '', sort_by = 'id', order = 'asc', filters = [] }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter documents based on search term
      let filteredDocuments = [...mockDocuments];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.title.toLowerCase().includes(searchLower) || 
          doc.description.toLowerCase().includes(searchLower) ||
          doc.created_by.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply filters
      if (filters.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => {
          return filters.every(filter => {
            const { key, op, value } = filter;
            
            if (!key || !op || value === undefined) return true;
            
            switch (op) {
              case 'eq':
                return doc[key] === value;
              case 'ne':
                return doc[key] !== value;
              case 'contains':
                return String(doc[key]).toLowerCase().includes(String(value).toLowerCase());
              case 'in':
                if (Array.isArray(doc[key])) {
                  return doc[key].includes(value);
                }
                return false;
              default:
                return true;
            }
          });
        });
      }
      
      // Sort documents
      filteredDocuments.sort((a, b) => {
        if (a[sort_by] < b[sort_by]) return order === 'asc' ? -1 : 1;
        if (a[sort_by] > b[sort_by]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      
      // Paginate documents
      const total_records = filteredDocuments.length;
      const total_pages = Math.ceil(total_records / per_page);
      const start_index = (page - 1) * per_page;
      const paginatedDocuments = filteredDocuments.slice(start_index, start_index + per_page);
      
      return {
        data: paginatedDocuments,
        pagination: {
          total_records,
          total_pages,
          current_page: page,
          per_page,
          has_next: page < total_pages,
          has_prev: page > 1
        },
        sort: {
          sort_by,
          order
        },
        filters
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDocument = createAsyncThunk(
  'documents/createDocument',
  async (documentData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: mockDocuments.length + 1,
        ...documentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async (documentData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        ...documentData,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return documentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDocumentById = createAsyncThunk(
  'documents/getDocumentById',
  async (documentId, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const document = mockDocuments.find(doc => doc.id === Number(documentId));
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      return document;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const documentSlice = createSlice({
  name: 'documents',
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
      // Fetch Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.sort = action.payload.sort;
        state.error = null;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Failed to fetch documents');
      })
      
      // Get Document by ID
      .addCase(getDocumentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocumentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selected = action.payload;
        state.error = null;
      })
      .addCase(getDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Document not found');
      })
      
      // Create Document
      .addCase(createDocument.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selected = action.payload;
        toast.success('Document created successfully');
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error('Failed to create document');
      })
      
      // Update Document
      .addCase(updateDocument.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.selected = action.payload;
        toast.success('Document updated successfully');
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error('Failed to update document');
      })
      
      // Delete Document
      .addCase(deleteDocument.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(deleteDocument.fulfilled, (state) => {
        state.isSubmitting = false;
        state.selected = null;
        toast.success('Document deleted successfully');
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
        toast.error('Failed to delete document');
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
} = documentSlice.actions;

export default documentSlice.reducer;