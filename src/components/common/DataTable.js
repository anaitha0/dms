import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  Typography,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const DataTable = ({
  columns,
  data,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  selectable = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
}) => {
  const theme = useTheme();
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const handleSort = (columnId) => {
    const newSortOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(columnId, newSortOrder);
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  const renderCellContent = (column, row) => {
    const value = row[column.id];
    
    if (column.format) {
      return column.format(value, row);
    }
    
    if (column.type === 'datetime' && value) {
      try {
        return format(new Date(value), 'MMM dd, yyyy HH:mm');
      } catch (error) {
        return value;
      }
    }

    if (column.type === 'date' && value) {
      try {
        return format(new Date(value), 'MMM dd, yyyy');
      } catch (error) {
        return value;
      }
    }
    
    if (column.type === 'status') {
      return (
        <Chip
          label={value}
          size="small"
          sx={{
            backgroundColor: (() => {
              switch (value?.toLowerCase?.()) {
                case 'active':
                case 'published':
                  return `${theme.palette.success.main}20`;
                case 'inactive':
                case 'archived':
                  return `${theme.palette.text.disabled}20`;
                case 'on leave':
                case 'under review':
                  return `${theme.palette.warning.main}20`;
                case 'remote':
                case 'draft':
                  return `${theme.palette.info.main}20`;
                default:
                  return `${theme.palette.grey[500]}20`;
              }
            })(),
            color: (() => {
              switch (value?.toLowerCase?.()) {
                case 'active':
                case 'published':
                  return theme.palette.success.main;
                case 'inactive':
                case 'archived':
                  return theme.palette.text.disabled;
                case 'on leave':
                case 'under review':
                  return theme.palette.warning.main;
                case 'remote':
                case 'draft':
                  return theme.palette.info.main;
                default:
                  return theme.palette.grey[700];
              }
            })(),
            fontWeight: 500,
          }}
        />
      );
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value !== undefined && value !== null ? value : '—';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <TableContainer sx={{ maxHeight: 650 }}>
        <Table stickyHeader aria-label="data table" size="medium">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
                    checked={data.length > 0 && selectedItems.length === data.length}
                    onChange={onSelectAll}
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>
              )}
              
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    backgroundColor: theme.palette.background.paper,
                    fontWeight: 600,
                    py: 2,
                  }}
                  sortDirection={sortBy === column.id ? sortOrder : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              
              {(onView || onEdit || onDelete) && (
                <TableCell
                  align="right"
                  sx={{
                    minWidth: 100,
                    backgroundColor: theme.palette.background.paper,
                    fontWeight: 600,
                    py: 2,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            <AnimatePresence>
              {isLoading ? (
                // Loading skeletons
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Skeleton variant="rectangular" width={20} height={20} />
                      </TableCell>
                    )}
                    
                    {columns.map((column, colIndex) => (
                      <TableCell key={`skeleton-cell-${colIndex}`}>
                        <Skeleton variant="text" width={colIndex === 0 ? 150 : 100} />
                      </TableCell>
                    ))}
                    
                    {(onView || onEdit || onDelete) && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Skeleton variant="circular" width={30} height={30} />
                          <Skeleton variant="circular" width={30} height={30} />
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data.length > 0 ? (
                data.map((row) => {
                  const isItemSelected = selectable && isSelected(row.id);
                  const isRowHovered = hoveredRowId === row.id;
                  
                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ backgroundColor: isItemSelected ? `${theme.palette.primary.main}08` : 'inherit' }}
                      onMouseEnter={() => setHoveredRowId(row.id)}
                      onMouseLeave={() => setHoveredRowId(null)}
                      component={TableRow}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={() => onSelectItem(row.id)}
                            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                          />
                        </TableCell>
                      )}
                      
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}
                      
                      {(onView || onEdit || onDelete) && (
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: 1,
                              opacity: isRowHovered ? 1 : 0.5,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            {onView && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => onView(row)}
                                  sx={{ color: theme.palette.info.main }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {onEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(row)}
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            {onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(row)}
                                  sx={{ color: theme.palette.error.main }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </motion.tr>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length + (selectable ? 1 : 0) + ((onView || onEdit || onDelete) ? 1 : 0)
                    }
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No data found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try changing your filters or search query
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;