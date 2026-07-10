import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CssBaseline />
      <Container maxWidth="xs">
        <Outlet />
      </Container>
    </Box>
  );
};
