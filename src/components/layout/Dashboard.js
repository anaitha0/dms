import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './Header';
import Sidebar from './Sidebar';
import PageContainer from './PageContainer';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: isMobile ? -280 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              position: isMobile ? 'fixed' : 'relative',
              zIndex: 1200,
              height: '100vh',
            }}
          >
            <Sidebar onClose={isMobile ? handleToggleSidebar : undefined} />
          </motion.div>
        )}
      </AnimatePresence>

      <Box
        component={motion.div}
        layout
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: isMobile ? 0 : (sidebarOpen ? 0 : -280),
          width: isMobile ? '100%' : (sidebarOpen ? 'calc(100% - 280px)' : '100%'),
        }}
      >
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
        <PageContainer>
          <AnimatePresence mode="wait">
            <motion.div
              key="outlet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </PageContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;