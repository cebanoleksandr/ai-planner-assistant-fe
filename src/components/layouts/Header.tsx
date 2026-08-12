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
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, px: { xs: 1.5, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: { xs: 1, sm: 2 }, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {currentTitle}
            </Typography>
          </Box>

          {!isLoading && user && (
            <Box sx={{ flexShrink: 0 }}>
              <Button
                onClick={handleMenuOpen}
                color="inherit"
                startIcon={<AccountCircle />}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                  minWidth: 0,
                  px: { xs: 1, sm: 2 },
                  '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: 'none', sm: 'inline' },
                    maxWidth: 180,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </Box>
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
