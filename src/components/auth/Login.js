import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, clearError } from '../../store/authSlice';

// Validation schema
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      // Clear error when component unmounts
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(login(values));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 600,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Document Management System
            </Typography>

            <Typography variant="h6" sx={{ mb: 3 }}>
              Sign In to Your Account
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ width: '100%', mb: 3 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form style={{ width: '100%' }}>
                  <Field name="username">
                    {({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        margin="normal"
                        label="Username"
                        variant="outlined"
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        disabled={isLoading}
                        sx={{ mb: 2 }}
                      />
                    )}
                  </Field>

                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        margin="normal"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        disabled={isLoading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePassword}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                      />
                    )}
                  </Field>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.5s ease',
                      },
                      '&:hover::after': {
                        transform: 'translateX(100%)',
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Demo Credentials:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Username: admin | Password: admin123
                    </Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;