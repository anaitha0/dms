import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  useTheme,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Components
import FormField from '../common/FormField';
import LoadingSpinner from '../common/LoadingSpinner';

// Actions
import { createUser, updateUser } from '../../store/userSlice';

// Form validation schema
const UserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  position: Yup.string().required('Position is required'),
  department: Yup.string().required('Department is required'),
  status: Yup.string().required('Status is required'),
  phone: Yup.string(),
  address: Yup.string(),
  hire_date: Yup.date(),
  employee_id: Yup.string(),
});

const positionOptions = [
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
  { value: 'Lead Developer', label: 'Lead Developer' },
  { value: 'Full Stack Developer', label: 'Full Stack Developer' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Senior Product Manager', label: 'Senior Product Manager' },
  { value: 'Product Owner', label: 'Product Owner' },
  { value: 'Product Director', label: 'Product Director' },
  { value: 'UX Designer', label: 'UX Designer' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
  { value: 'Senior Designer', label: 'Senior Designer' },
  { value: 'Design Lead', label: 'Design Lead' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'Data Engineer', label: 'Data Engineer' },
  { value: 'Analytics Lead', label: 'Analytics Lead' },
];

const departmentOptions = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'HR' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Customer Support', label: 'Customer Support' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'On Leave', label: 'On Leave' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Probation', label: 'Probation' },
  { value: 'Contract', label: 'Contract' },
];

const UserForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { isSubmitting, isLoading } = useSelector((state) => state.users);
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    status: 'Active',
    phone: '',
    address: '',
    hire_date: new Date(),
    employee_id: '',
  });

  useEffect(() => {
    if (isEditing) {
      // In a real app, we'd fetch the user data from the API
      // For now, let's create some mock data for editing
      setUser({
        id: Number(id),
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Engineer',
        department: 'Engineering',
        status: 'Active',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Anytown, CA 94321',
        hire_date: new Date('2021-01-15'),
        employee_id: '100001',
      });
    }
  }, [id, isEditing]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isEditing) {
        await dispatch(updateUser({ id: Number(id), ...values }));
      } else {
        await dispatch(createUser(values));
        resetForm();
      }
      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (isEditing && isLoading) {
    return <LoadingSpinner message="Loading user data..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            Dashboard
          </Link>
          <Link
            color="inherit"
            onClick={() => navigate('/users')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            Users
          </Link>
          <Typography color="textPrimary">
            {isEditing ? 'Edit User' : 'New User'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/users')}
            sx={{ mr: 2, backgroundColor: 'background.paper' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {isEditing ? 'Edit User' : 'Create New User'}
          </Typography>
        </Box>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Formik
            initialValues={user}
            validationSchema={UserSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting: isFormSubmitting }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="name"
                        label="Full Name"
                        component={FormField}
                        required
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="email"
                        label="Email Address"
                        type="email"
                        component={FormField}
                        required
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="phone"
                        label="Phone Number"
                        component={FormField}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="position"
                        label="Position"
                        type="select"
                        component={FormField}
                        options={positionOptions}
                        required
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="department"
                        label="Department"
                        type="select"
                        component={FormField}
                        options={departmentOptions}
                        required
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="status"
                        label="Status"
                        type="select"
                        component={FormField}
                        options={statusOptions}
                        required
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="hire_date"
                        label="Hire Date"
                        type="date"
                        component={FormField}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="employee_id"
                        label="Employee ID"
                        component={FormField}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Address
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="address"
                        label="Address"
                        component={FormField}
                        type="textarea"
                        rows={3}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isFormSubmitting || isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={isFormSubmitting || isSubmitting}
                  >
                    {isEditing ? 'Update' : 'Create'} User
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserForm;