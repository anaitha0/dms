import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SearchBar = ({ value, onChange, placeholder = 'Search...', autoFocus = false }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isFocused, setIsFocused] = useState(autoFocus);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onChange) {
      onChange(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) {
      onChange('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <Box
      component={motion.form}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <motion.div
        initial={false}
        animate={{ width: isFocused ? '100%' : '100%' }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={placeholder}
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClear}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
              },
              transition: 'all 0.3s ease',
              pr: searchTerm ? 0.5 : 1,
            },
          }}
          sx={{
            mb: 0,
          }}
        />
      </motion.div>
    </Box>
  );
};

export default SearchBar;