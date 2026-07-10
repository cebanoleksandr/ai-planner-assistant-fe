import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  drawerWidth: number;
  currentTitle: string;
  handleDrawerToggle: () => void;
}

export const Header = ({ drawerWidth, currentTitle, handleDrawerToggle }: HeaderProps) => {
  return (
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
      <Toolbar>
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
      </Toolbar>
    </AppBar>
  );
};
