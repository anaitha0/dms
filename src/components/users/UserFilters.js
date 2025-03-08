import React from 'react';
import FilterPanel from '../common/FilterPanel';

const filterFields = [
  { id: 'name', label: 'Name', type: 'string' },
  { id: 'position', label: 'Position', type: 'string' },
  { id: 'department', label: 'Department', type: 'string' },
  { id: 'status', label: 'Status', type: 'status' },
  { id: 'email', label: 'Email', type: 'string' },
  { id: 'hire_date', label: 'Hire Date', type: 'date' },
  { id: 'employee_id', label: 'Employee ID', type: 'string' },
];

const UserFilters = ({ filters, onApplyFilters, onRemoveFilter, onResetFilters }) => {
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

export default UserFilters;