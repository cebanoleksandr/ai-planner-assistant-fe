import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Button,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  AccountCircle, 
  Logout as LogoutIcon 
} from '@mui/icons-material'; 
import { AuthService } from '../../services/auth.service';
import { useMe } from '../../reactQuery/hooks/useUsers';
import LogoutPopup from '../popups/LogoutPopup';

interface HeaderProps {
  drawerWidth: number;
  currentTitle: string;
  handleDrawerToggle: () => void;
}

export const Header = ({ drawerWidth, currentTitle, handleDrawerToggle }: HeaderProps) => {
  const { data: user, isLoading } = useMe();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutOptionClick = () => {
    handleMenuClose();
    setIsLogoutPopupVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutPopupVisible(false);
    AuthService.logout();
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {currentTitle}
            </Typography>
          </Box>

          {!isLoading && user && (
            <Box>
              <Button
                onClick={handleMenuOpen}
                color="inherit"
                startIcon={<AccountCircle />}
                sx={{ 
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {user.email}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: { mt: 1, minWidth: 150 }
                  }
                }}
              >
                <MenuItem onClick={handleLogoutOptionClick} sx={{ color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <LogoutPopup
        isVisible={isLogoutPopupVisible}
        onClose={() => setIsLogoutPopupVisible(false)}
        onLogout={handleConfirmLogout}
      />
    </>
  );
};
