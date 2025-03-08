import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Components
import FormField from '../common/FormField';
import LoadingSpinner from '../common/LoadingSpinner';

// Actions
import { createDocument, updateDocument, getDocumentById } from '../../store/documentSlice';

// Form validation schema
const DocumentSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  type: Yup.string().required('Document type is required'),
  status: Yup.string().required('Status is required'),
  tags: Yup.array().of(Yup.string()),
});

const documentTypeOptions = [
  { value: 'PDF', label: 'PDF' },
  { value: 'DOCX', label: 'Word Document' },
  { value: 'XLS', label: 'Excel Spreadsheet' },
  { value: 'TXT', label: 'Text File' },
  { value: 'JPG', label: 'Image' },
];

const statusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Archived', label: 'Archived' },
  { value: 'Under Review', label: 'Under Review' },
];

const DocumentForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { selected: document, isSubmitting, isLoading } = useSelector((state) => state.documents);
  
  const [newTag, setNewTag] = useState('');
  const [file, setFile] = useState(null);

  const initialValues = {
    title: '',
    description: '',
    type: 'PDF',
    status: 'Draft',
    tags: [],
  };

  useEffect(() => {
    if (isEditing && id) {
      dispatch(getDocumentById(Number(id)));
    }
  }, [dispatch, id, isEditing]);

  const handleAddTag = (push) => {
    if (newTag.trim()) {
      push(newTag.trim());
      setNewTag('');
    }
  };

  const handleRemoveTag = (remove, index) => {
    remove(index);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // In a real app, we would handle file upload here
      const documentData = {
        ...values,
        size: file ? file.size : (document ? document.size : 1024),
        created_by: 'Admin User',
      };
      
      if (isEditing) {
        await dispatch(updateDocument({ id: Number(id), ...documentData }));
      } else {
        await dispatch(createDocument(documentData));
        resetForm();
        setFile(null);
      }
      navigate('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/documents');
  };

  if (isEditing && isLoading) {
    return <LoadingSpinner message="Loading document data..." />;
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
            onClick={() => navigate('/documents')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            Documents
          </Link>
          <Typography color="textPrimary">
            {isEditing ? 'Edit Document' : 'New Document'}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/documents')}
            sx={{ mr: 2, backgroundColor: 'background.paper' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {isEditing ? 'Edit Document' : 'Upload New Document'}
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
            initialValues={isEditing && document ? document : initialValues}
            validationSchema={DocumentSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, isSubmitting: isFormSubmitting, setFieldValue }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Document Information
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="title"
                        label="Document Title"
                        component={FormField}
                        required
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="description"
                        label="Description"
                        component={FormField}
                        type="textarea"
                        rows={4}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Field
                        name="type"
                        label="Document Type"
                        type="select"
                        component={FormField}
                        options={documentTypeOptions}
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
                      <Typography variant="subtitle1" gutterBottom>
                        Tags
                      </Typography>
                      <FieldArray name="tags">
                        {({ push, remove }) => (
                          <>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                              <TextField
                                fullWidth
                                label="Add Tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag(push);
                                  }
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton 
                                        edge="end" 
                                        onClick={() => handleAddTag(push)}
                                        disabled={!newTag.trim()}
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {values.tags.map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  onDelete={() => handleRemoveTag(remove, index)}
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                              {values.tags.length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                  No tags added yet
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}
                      </FieldArray>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                      Document File
                    </Typography>
                    
                    <Paper
                      elevation={0}
                      sx={{
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'background.default',
                      }}
                    >
                      <input
                        accept="*/*"
                        id="document-file-upload"
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="document-file-upload">
                        <Box sx={{ mb: 2 }}>
                          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                        </Box>
                        <Typography variant="body1" gutterBottom>
                          {file ? file.name : (isEditing ? 'Replace current file' : 'Click to upload')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Supported formats: PDF, DOCX, XLS, TXT, JPG'}
                        </Typography>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          sx={{ mt: 2 }}
                        >
                          {file ? 'Change File' : 'Upload File'}
                        </Button>
                      </label>
                    </Paper>
                    
                    {isEditing && !file && document && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Current File:
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={`${document.type}`}
                            color="primary"
                            size="small"
                          />
                          <Typography variant="body2">
                            {(document.size / 1024).toFixed(2)} KB
                          </Typography>
                        </Stack>
                      </Box>
                    )}
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
                    {isEditing ? 'Update' : 'Create'} Document
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

export default DocumentForm;