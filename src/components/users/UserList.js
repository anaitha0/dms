import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
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
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Components
import DataTable from '../common/DataTable';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import UserFilters from './UserFilters';

// Actions
import {
  fetchUsers,
  setSearch,
  setSort,
  setPagination,
  setFilters,
  resetFilters,
  deleteUser,
} from '../../store/userSlice';

const userColumns = [
  {
    id: 'id',
    label: 'ID',
    sortable: true,
    minWidth: 70,
    align: 'left',
  },
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'position',
    label: 'Position',
    sortable: true,
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'department',
    label: 'Department',
    sortable: true,
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'email',
    label: 'Email',
    sortable: true,
    minWidth: 180,
    align: 'left',
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
    id: 'hire_date',
    label: 'Hire Date',
    sortable: true,
    minWidth: 120,
    align: 'left',
    type: 'date',
  },
];

const UserList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list: users,
    pagination,
    sort,
    filters,
    search,
    isLoading,
  } = useSelector((state) => state.users);

  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [pagination.current_page, pagination.per_page, sort.sort_by, sort.order, filters, search]);

  const loadUsers = () => {
    dispatch(
      fetchUsers({
        page: pagination.current_page,
        per_page: pagination.per_page,
        sort_by: sort.sort_by,
        order: sort.order,
        filters: [...filters, ...(search ? [{ key: 'name', op: 'contains', value: search }] : [])],
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

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteUser(userToDelete.id));
    setDeleteDialogOpen(false);
    setUserToDelete(null);
    loadUsers();
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
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
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage system users, their roles and permissions
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
              onClick={loadUsers}
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
              onClick={handleAddUser}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </Box>

      {showFilters && (
        <UserFilters
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
            placeholder="Search by name, email, position..."
          />
        </CardContent>
      </Card>

      {isLoading && users.length === 0 ? (
        <LoadingSpinner message="Loading users..." />
      ) : (
        <>
          <DataTable
            columns={userColumns}
            data={users}
            isLoading={isLoading}
            sortBy={sort.sort_by}
            sortOrder={sort.order}
            onSort={handleSort}
            onEdit={handleEditUser}
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
            Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
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

export default UserList;