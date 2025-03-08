import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  RadioGroup,
  Radio,
  Chip,
  Box,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FormField = ({
  field,
  form,
  label,
  type = 'text',
  fullWidth = true,
  required = false,
  options = [],
  multiple = false,
  rows = 4,
  ...props
}) => {
  const theme = useTheme();
  const { name } = field;
  const { touched, errors, setFieldValue } = form;
  const errorMessage = touched[name] && errors[name];
  const hasError = Boolean(errorMessage);

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <FormControl 
            fullWidth={fullWidth} 
            error={hasError} 
            required={required}
            variant="outlined"
          >
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
              {...field}
              {...props}
              labelId={`${name}-label`}
              id={name}
              label={label}
              multiple={multiple}
              input={<OutlinedInput label={label} />}
              renderValue={multiple ? (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const option = options.find(opt => opt.value === value);
                    return (
                      <Chip 
                        key={value} 
                        label={option ? option.label : value} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              ) : undefined}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl 
            fullWidth={fullWidth} 
            error={hasError} 
            required={required}
            component="fieldset" 
            variant="standard"
          >
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={
                        multiple
                          ? Array.isArray(field.value) && field.value.includes(option.value)
                          : field.value === option.value
                      }
                      onChange={(e) => {
                        if (multiple) {
                          const newValue = e.target.checked
                            ? [...(field.value || []), option.value]
                            : (field.value || []).filter((v) => v !== option.value);
                          setFieldValue(name, newValue);
                        } else {
                          setFieldValue(name, e.target.checked ? option.value : '');
                        }
                      }}
                      name={name}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl 
            fullWidth={fullWidth} 
            error={hasError} 
            required={required}
            component="fieldset" 
            variant="standard"
          >
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
              {...field}
              row
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={label}
              value={field.value || null}
              onChange={(date) => {
                setFieldValue(name, date);
              }}
              slotProps={{
                textField: {
                  fullWidth,
                  error: hasError,
                  helperText: errorMessage,
                  required,
                  ...props,
                },
              }}
            />
          </LocalizationProvider>
        );

      case 'textarea':
        return (
          <TextField
            {...field}
            {...props}
            label={label}
            error={hasError}
            helperText={errorMessage}
            fullWidth={fullWidth}
            required={required}
            multiline
            rows={rows}
            variant="outlined"
          />
        );

      default:
        return (
          <TextField
            {...field}
            {...props}
            type={type}
            label={label}
            error={hasError}
            helperText={errorMessage}
            fullWidth={fullWidth}
            required={required}
            variant="outlined"
            InputLabelProps={{
              shrink: type === 'date' || type === 'datetime-local',
            }}
          />
        );
    }
  };

  return renderField();
};

export default FormField;