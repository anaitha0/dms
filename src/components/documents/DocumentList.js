import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterAltIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Components
import DataTable from '../common/DataTable';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import DocumentFilters from './DocumentFilters';

// Actions
import {
  fetchDocuments,
  setSearch,
  setSort,
  setPagination,
  setFilters,
  resetFilters,
  deleteDocument,
} from '../../store/documentSlice';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const documentColumns = [
  {
    id: 'id',
    label: 'ID',
    sortable: true,
    minWidth: 70,
    align: 'left',
  },
  {
    id: 'title',
    label: 'Title',
    sortable: true,
    minWidth: 180,
    align: 'left',
    format: (value, row) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <DescriptionIcon 
          fontSize="small" 
          sx={{ 
            mr: 1, 
            color: (() => {
              switch(row.type) {
                case 'PDF': return '#F40F02';
                case 'DOCX': return '#2B579A';
                case 'XLS': return '#217346';
                case 'JPG': return '#FF9E0F';
                default: return '#888';
              }
            })()
          }} 
        />
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {value}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            {row.type} • {formatBytes(row.size)}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    minWidth: 120,
    align: 'left',
    type: 'status',
  },
  {
    id: 'created_by',
    label: 'Created By',
    sortable: true,
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'created_at',
    label: 'Created Date',
    sortable: true,
    minWidth: 150,
    align: 'left',
    type: 'datetime',
  },
  {
    id: 'tags',
    label: 'Tags',
    sortable: false,
    minWidth: 180,
    align: 'left',
    format: (value) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {Array.isArray(value) && value.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            variant="outlined"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
      </Box>
    ),
  },
];

const DocumentList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list: documents,
    pagination,
    sort,
    filters,
    search,
    isLoading,
  } = useSelector((state) => state.documents);

  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, [pagination.current_page, pagination.per_page, sort.sort_by, sort.order, filters, search]);

  const loadDocuments = () => {
    dispatch(
      fetchDocuments({
        page: pagination.current_page,
        per_page: pagination.per_page,
        sort_by: sort.sort_by,
        order: sort.order,
        search,
        filters,
      })
    );
  };

  const handleSort = (columnId, direction) => {
    dispatch(setSort({ sort_by: columnId, order: direction }));
  };

  const handlePageChange = (page) => {
    dispatch(setPagination({ current_page: page }));
  };

  const handleRowsPerPageChange = (perPage) => {
    dispatch(setPagination({ per_page: perPage, current_page: 1 }));
  };

  const handleSearchChange = (value) => {
    dispatch(setSearch(value));
    dispatch(setPagination({ current_page: 1 }));
  };

  const handleApplyFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(setPagination({ current_page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(setPagination({ current_page: 1 }));
  };

  const handleAddDocument = () => {
    navigate('/documents/new');
  };

  const handleViewDocument = (document) => {
    navigate(`/documents/${document.id}`);
  };

  const handleEditDocument = (document) => {
    navigate(`/documents/${document.id}`);
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteDocument(documentToDelete.id));
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
    loadDocuments();
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
              Document Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View, upload, and manage all your documents in one place
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadDocuments}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterAltIcon />}
              onClick={() => setShowFilters(!showFilters)}
              color={filters.length > 0 ? 'primary' : 'inherit'}
            >
              Filters {filters.length > 0 && `(${filters.length})`}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddDocument}
            >
              Add Document
            </Button>
          </Grid>
        </Grid>
      </Box>

      {showFilters && (
        <DocumentFilters
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onRemoveFilter={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      )}

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title, description, tags..."
          />
        </CardContent>
      </Card>

      {isLoading && documents.length === 0 ? (
        <LoadingSpinner message="Loading documents..." />
      ) : (
        <>
          <DataTable
            columns={documentColumns}
            data={documents}
            isLoading={isLoading}
            sortBy={sort.sort_by}
            sortOrder={sort.order}
            onSort={handleSort}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onDelete={handleDeleteClick}
          />

          <Pagination
            page={pagination.current_page}
            totalPages={pagination.total_pages}
            rowsPerPage={pagination.per_page}
            totalItems={pagination.total_records}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the document "{documentToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default DocumentList;