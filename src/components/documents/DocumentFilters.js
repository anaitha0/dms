import React from 'react';
import FilterPanel from '../common/FilterPanel';

const filterFields = [
  { id: 'title', label: 'Title', type: 'string' },
  { id: 'description', label: 'Description', type: 'string' },
  { id: 'type', label: 'File Type', type: 'string' },
  { id: 'status', label: 'Status', type: 'status' },
  { id: 'created_by', label: 'Created By', type: 'string' },
  { id: 'created_at', label: 'Created Date', type: 'date' },
  { id: 'updated_at', label: 'Updated Date', type: 'date' },
  { id: 'tags', label: 'Tags', type: 'array' },
];

const DocumentFilters = ({ filters, onApplyFilters, onRemoveFilter, onResetFilters }) => {
  return (
    <FilterPanel
      filters={filters}
      onApplyFilters={onApplyFilters}
      onRemoveFilter={onRemoveFilter}
      onResetFilters={onResetFilters}
      filterFields={filterFields}
    />
  );
};

export default DocumentFilters;