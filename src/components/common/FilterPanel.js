import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  FilterAltOff as FilterAltOffIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const FILTER_OPERATORS = [
  { value: 'eq', label: 'Equals', valueType: 'any' },
  { value: 'ne', label: 'Not Equals', valueType: 'any' },
  { value: 'gt', label: 'Greater Than', valueType: 'number' },
  { value: 'lt', label: 'Less Than', valueType: 'number' },
  { value: 'ge', label: 'Greater Than or Equal', valueType: 'number' },
  { value: 'le', label: 'Less Than or Equal', valueType: 'number' },
  { value: 'contains', label: 'Contains', valueType: 'string' },
  { value: 'startswith', label: 'Starts With', valueType: 'string' },
  { value: 'endswith', label: 'Ends With', valueType: 'string' },
  { value: 'in', label: 'In List', valueType: 'array' },
];

const FilterPanel = ({
  filters = [],
  onApplyFilters,
  onRemoveFilter,
  onResetFilters,
  filterFields = [],
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newFilter, setNewFilter] = useState({
    key: '',
    op: 'eq',
    value: '',
  });

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleFilterChange = (field, value) => {
    setNewFilter((prev) => ({ ...prev, [field]: value }));

    // Reset value if changing the field or operator
    if (field === 'key' || field === 'op') {
      setNewFilter((prev) => ({ ...prev, value: '' }));
    }
  };

  const handleAddFilter = () => {
    if (newFilter.key && newFilter.op) {
      onApplyFilters([...filters, newFilter]);
      setNewFilter({ key: '', op: 'eq', value: '' });
    }
  };

  const handleRemoveFilter = (index) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    onRemoveFilter(updatedFilters);
  };

  const getFieldType = (fieldId) => {
    const field = filterFields.find((f) => f.id === fieldId);
    return field ? field.type : 'string';
  };

  const getFieldLabel = (fieldId) => {
    const field = filterFields.find((f) => f.id === fieldId);
    return field ? field.label : fieldId;
  };

  const getOperatorLabel = (operatorValue) => {
    const operator = FILTER_OPERATORS.find((op) => op.value === operatorValue);
    return operator ? operator.label : operatorValue;
  };

  const getCompatibleOperators = (fieldId) => {
    const fieldType = getFieldType(fieldId);
    
    if (!fieldType) return FILTER_OPERATORS;
    
    switch (fieldType) {
      case 'number':
      case 'date':
      case 'datetime':
        return FILTER_OPERATORS.filter((op) => 
          ['eq', 'ne', 'gt', 'lt', 'ge', 'le'].includes(op.value)
        );
      case 'boolean':
        return FILTER_OPERATORS.filter((op) => 
          ['eq', 'ne'].includes(op.value)
        );
      case 'array':
        return FILTER_OPERATORS.filter((op) => 
          ['contains', 'in'].includes(op.value)
        );
      case 'status':
      case 'string':
      default:
        return FILTER_OPERATORS.filter((op) => 
          ['eq', 'ne', 'contains', 'startswith', 'endswith'].includes(op.value)
        );
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={handleToggleExpand}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight={500}>
              Filters
            </Typography>
            
            {filters.length > 0 && (
              <Chip
                size="small"
                label={filters.length}
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand();
            }}
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2}>
                {/* Applied filters */}
                {filters.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Applied Filters:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {filters.map((filter, index) => (
                        <Chip
                          key={index}
                          label={`${getFieldLabel(filter.key)} ${getOperatorLabel(filter.op)} ${filter.value}`}
                          onDelete={() => handleRemoveFilter(index)}
                          sx={{ my: 0.5 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      
                      <Chip
                        label="Clear All"
                        onDelete={onResetFilters}
                        onClick={onResetFilters}
                        deleteIcon={<FilterAltOffIcon />}
                        sx={{ my: 0.5 }}
                      />
                    </Stack>
                  </Box>
                )}
                
                {/* New filter form */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Add New Filter:
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
                      <InputLabel id="filter-field-label">Field</InputLabel>
                      <Select
                        labelId="filter-field-label"
                        value={newFilter.key}
                        label="Field"
                        onChange={(e) => handleFilterChange('key', e.target.value)}
                      >
                        {filterFields.map((field) => (
                          <MenuItem key={field.id} value={field.id}>
                            {field.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl
                      size="small"
                      sx={{ minWidth: 200, flexGrow: 1 }}
                      disabled={!newFilter.key}
                    >
                      <InputLabel id="filter-operator-label">Operator</InputLabel>
                      <Select
                        labelId="filter-operator-label"
                        value={newFilter.op}
                        label="Operator"
                        onChange={(e) => handleFilterChange('op', e.target.value)}
                      >
                        {getCompatibleOperators(newFilter.key).map((op) => (
                          <MenuItem key={op.value} value={op.value}>
                            {op.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <TextField
                      label="Value"
                      size="small"
                      value={newFilter.value}
                      onChange={(e) => handleFilterChange('value', e.target.value)}
                      disabled={!newFilter.key || !newFilter.op}
                      sx={{ flexGrow: 1 }}
                    />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddFilter}
                      disabled={!newFilter.key || !newFilter.op || newFilter.value === ''}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;