import type { FC } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BasePopup from './BasePopup';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}

export const DeleteAreaPopup: FC<IProps> = ({ 
  isVisible, 
  onClose, 
  onConfirm, 
  itemName,
  isLoading 
}) => {
  return (
    <BasePopup isVisible={isVisible} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: { xs: '280px', sm: '350px' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            Delete Area
          </Typography>
          <IconButton onClick={onClose} disabled={isLoading} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            onClick={onClose} 
            color="inherit" 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="contained" 
            color="error" 
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
};
