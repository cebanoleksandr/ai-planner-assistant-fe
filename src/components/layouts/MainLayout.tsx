import { useState } from 'react';
import { Box, Toolbar, Fab, CssBaseline } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { menuItems } from '../../constants/menuItems';

const DRAWER_WIDTH = 240;

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const currentTitle = menuItems.find((item) => item.path === location.pathname)?.text || 'AI Planner';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      <Header
        drawerWidth={DRAWER_WIDTH} 
        currentTitle={currentTitle} 
        handleDrawerToggle={handleDrawerToggle} 
      />

      <Sidebar
        drawerWidth={DRAWER_WIDTH} 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Outlet /> 
      </Box>

      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
        onClick={() => console.log('Відкрити чат')}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};
