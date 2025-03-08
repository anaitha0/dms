import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const Pagination = ({
  page,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50, 100],
  showRowsPerPage = true,
}) => {
  const theme = useTheme();

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mt: 2,
        py: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ order: { xs: 2, sm: 1 } }}
      >
        {totalItems > 0 ? (
          <>
            Showing{' '}
            <Typography component="span" fontWeight="bold" color="text.primary">
              {Math.min((page - 1) * rowsPerPage + 1, totalItems)}
            </Typography>
            {' - '}
            <Typography component="span" fontWeight="bold" color="text.primary">
              {Math.min(page * rowsPerPage, totalItems)}
            </Typography>
            {' of '}
            <Typography component="span" fontWeight="bold" color="text.primary">
              {totalItems}
            </Typography>
            {' entries'}
          </>
        ) : (
          'No entries found'
        )}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          order: { xs: 1, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
        }}
      >
        {showRowsPerPage && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              id="rows-per-page"
              value={rowsPerPage}
              label="Rows per page"
              onChange={handleRowsPerPageChange}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <MuiPagination
          color="primary"
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          shape="rounded"
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          size="medium"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Pagination;