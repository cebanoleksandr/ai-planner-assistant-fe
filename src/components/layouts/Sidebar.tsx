import { 
  Box, 
  Drawer, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
} from '@mui/material'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import { menuItems } from '../../constants/menuItems'; 

interface SidebarProps { 
  drawerWidth: number; 
  mobileOpen: boolean; 
  handleDrawerToggle: () => void; 
} 

export const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }: SidebarProps) => { 
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const isItemActive = (itemPath: string) => {
    if (itemPath === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/';
    }
    return location.pathname.startsWith(itemPath);
  };

  const drawerContent = ( 
    <div> 
      <Toolbar> 
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}> 
          AI Planner 
        </Typography> 
      </Toolbar> 
      <List> 
        {menuItems.map((item) => {
          const isActive = isItemActive(item.path);

          return (
            <ListItem key={item.text} disablePadding> 
              <ListItemButton 
                selected={isActive} 
                onClick={() => { 
                  navigate(item.path);
                  if (mobileOpen) handleDrawerToggle();  
                }} 
              > 
                <ListItemIcon 
                  sx={{ color: isActive ? 'primary.main' : 'inherit' }} 
                > 
                  {item.icon} 
                </ListItemIcon> 
                <ListItemText 
                  disableTypography 
                  primary={ 
                    <Typography 
                      sx={{ 
                        fontWeight: isActive ? 'bold' : 'normal', 
                      }} 
                    > 
                      {item.text} 
                    </Typography> 
                  } 
                /> 
              </ListItemButton> 
            </ListItem> 
          );
        })} 
      </List> 
    </div> 
  ); 

  return ( 
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}> 
      <Drawer 
        variant="temporary" 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
        ModalProps={{ keepMounted: true }} 
        sx={{ 
          display: { xs: 'block', sm: 'none' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, 
        }} 
      > 
        {drawerContent} 
      </Drawer> 
       
      <Drawer 
        variant="permanent" 
        sx={{ 
          display: { xs: 'none', sm: 'block' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, 
        }} 
        open 
      > 
        {drawerContent} 
      </Drawer> 
    </Box> 
  ); 
};
