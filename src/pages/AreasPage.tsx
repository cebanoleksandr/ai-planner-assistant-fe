import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Add as AddIcon, DeleteOutlineOutlined as DeleteIcon } from '@mui/icons-material';
import { useDeleteLifeArea, useLifeAreas } from '../reactQuery/hooks/useLifeAreas';
import { useAppDispatch } from '../storage/hooks';
import { setAlertAC } from '../storage/alertSlice';
import { CreateAreaPopup } from '../components/popups/CreateAreaPopup';
import { DeleteAreaPopup } from '../components/popups/DeleteAreaPopup';
import { useNavigate } from 'react-router-dom';

export const AreasPage = () => {
  const { data: areas = [], isLoading } = useLifeAreas();
  const deleteMutation = useDeleteLifeArea();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [deletePopupState, setDeletePopupState] = useState<{
    isVisible: boolean;
    areaId: string;
    areaName: string;
  }>({
    isVisible: false,
    areaId: '',
    areaName: '',
  });

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setDeletePopupState({
      isVisible: true,
      areaId: id,
      areaName: name,
    });
  };

  const closeDeletePopup = () => {
    setDeletePopupState(prev => ({ ...prev, isVisible: false }));
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deletePopupState.areaId, {
      onSuccess: () => {
        closeDeletePopup();
        dispatch(setAlertAC({ 
          text: `Area "${deletePopupState.areaName}" was deleted.`, 
          mode: 'info' 
        }));
      },
      onError: (error) => {
        closeDeletePopup();
        dispatch(setAlertAC({ 
          text: error?.message || 'Failed to delete the area.', 
          mode: 'error' 
        }));
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Life Areas and Goals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your high-level focuses.
          </Typography>
        </Box>
        <Button
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsPopupVisible(true)}
        >
          New Area
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : areas.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography color="text.secondary">
            You don't have any life areas yet. Create one to get started!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {areas.map((area) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={area.id}>
              <Card 
                elevation={2} 
                onClick={() => navigate(`/app/areas/${area.id}`)}
                sx={{ 
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <Box sx={{ height: 8, bgcolor: area.color || 'primary.main', width: '100%' }} />
                
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteClick(e, area.id, area.name)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 8,
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                
                <CardContent sx={{ pt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ pr: 3, fontWeight: "bold" }}>
                    {area.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click to manage goals in this area.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateAreaPopup
        isVisible={isPopupVisible} 
        onClose={() => setIsPopupVisible(false)} 
      />

      <DeleteAreaPopup
        isVisible={deletePopupState.isVisible}
        onClose={closeDeletePopup}
        onConfirm={handleConfirmDelete}
        itemName={deletePopupState.areaName}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default AreasPage;
