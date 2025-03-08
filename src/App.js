import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

// Components
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/layout/Dashboard';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';
import DocumentList from './components/documents/DocumentList';
import DocumentForm from './components/documents/DocumentForm';
import { checkAuth } from './store/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="/users" />} />
            
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="new" element={<UserForm />} />
              <Route path=":id" element={<UserForm />} />
            </Route>
            
            <Route path="documents">
              <Route index element={<DocumentList />} />
              <Route path="new" element={<DocumentForm />} />
              <Route path=":id" element={<DocumentForm />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;