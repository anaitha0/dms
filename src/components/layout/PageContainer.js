import React from 'react';
import { Box, Container, useTheme } from '@mui/material';

const PageContainer = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: theme.spacing(3),
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
        minHeight: (theme) => `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 2, pb: 8 }}>
        {children}
      </Container>
    </Box>
  );
};

export default PageContainer;