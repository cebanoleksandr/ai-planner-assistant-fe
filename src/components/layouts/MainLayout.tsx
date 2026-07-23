import { useState } from 'react';
import { Box, Toolbar, Fab, CssBaseline, Tooltip } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { menuItems } from '../../constants/menuItems';
import CustomAlert from '../UI/CustomAlert';
import { ChatWidget } from '../business/chat/ChatWidget';

const DRAWER_WIDTH = 240;

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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

      <ChatWidget open={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Tooltip title="Ask AI" placement="left">
        <Fab
          color="primary"
          aria-label="chat"
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1200,
          }}
          onClick={() => setIsChatOpen((prev) => !prev)}
        >
          <ChatIcon />
        </Fab>
      </Tooltip>

      <CustomAlert />
    </Box>
  );
};
