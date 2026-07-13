import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  LinearProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  DeleteOutlineOutlined as DeleteIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material';
import { useLifeAreas } from '../reactQuery/hooks/useLifeAreas';
import { useGoals, useDeleteGoal } from '../reactQuery/hooks/useGoals';
import { useAppDispatch } from '../storage/hooks';
import { setAlertAC } from '../storage/alertSlice';
import { CreateGoalPopup } from '../components/popups/CreateGoalPopup';
import { DeleteGoalPopup } from '../components/popups/DeleteGoalPopup';

export const AreaDetailsPage = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: areas = [], isLoading: isAreasLoading } = useLifeAreas();
  const { data: goals = [], isLoading: isGoalsLoading } = useGoals({ lifeAreaId: areaId });
  const deleteMutation = useDeleteGoal();

  const currentArea = areas.find(a => a.id === areaId);

  const [tabValue, setTabValue] = useState<'active' | 'completed' | 'paused'>('active');
  const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);
  const [deletePopupState, setDeletePopupState] = useState({
    isVisible: false,
    goalId: '',
    goalTitle: '',
  });

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => goal.status === tabValue);
  }, [goals, tabValue]);

  const handleDeleteClick = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setDeletePopupState({
      isVisible: true,
      goalId: id,
      goalTitle: title,
    });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deletePopupState.goalId, {
      onSuccess: () => {
        setDeletePopupState(prev => ({ ...prev, isVisible: false }));
        dispatch(setAlertAC({ text: `Goal "${deletePopupState.goalTitle}" deleted.`, mode: 'info' }));
      },
      onError: (error) => {
        setDeletePopupState(prev => ({ ...prev, isVisible: false }));
        dispatch(setAlertAC({ text: error?.message || 'Failed to delete goal.', mode: 'error' }));
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  if (isAreasLoading || isGoalsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentArea) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Area not found.</Typography>
        <Button onClick={() => navigate('/areas')} sx={{ mt: 2 }}>Back to Areas</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/areas')}
          color="inherit"
          sx={{ mb: 1, color: 'text.secondary' }}
        >
          Back to Areas
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: currentArea.color || 'primary.main', textTransform: 'uppercase' }}
          >
            {currentArea.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your goals in this area.
          </Typography>
        </Box>
        <Button
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setIsCreatePopupVisible(true)}
        >
          New Goal
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Active" value="active" />
          <Tab label="Completed" value="completed" />
          <Tab label="Paused" value="paused" />
        </Tabs>
      </Box>

      {filteredGoals.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography color="text.secondary">
            No {tabValue} goals found in this area.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredGoals.map((goal) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={goal.id}>
              <Card 
                elevation={2} 
                onClick={() => navigate(`/app/goals/${goal.id}`)}
                sx={{ 
                  height: '100%', 
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  }
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteClick(e, goal.id, goal.title)}
                  disabled={deleteMutation.isPending && deleteMutation.variables === goal.id}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 8,
                    color: 'text.secondary',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                
                <CardContent sx={{ pt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ pr: 3, fontWeight: "bold" }}>
                    {goal.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Target Date:</strong> {formatDate(goal.targetDate)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Status:</strong>
                      </Typography>
                      <Chip 
                        label={goal.status} 
                        size="small"
                        color={
                          goal.status === 'active' ? 'primary' :
                          goal.status === 'completed' ? 'success' : 'default'
                        }
                        sx={{ height: 20, fontSize: '0.7rem', textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {(() => {
                    const totalTasks = goal.tasks?.length || 0;
                    const completedTasks = goal.tasks?.filter(t => t.isCompleted).length || 0;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            📝 Tasks: {completedTasks} / {totalTasks}
                          </Typography>
                          {totalTasks > 0 && (
                            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: "500" }}>
                              {progress}%
                            </Typography>
                          )}
                        </Box>
                        
                        <LinearProgress
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: progress === 100 ? 'success.main' : 'primary.main'
                            }
                          }} 
                        />
                      </Box>
                    );
                  })()}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <CreateGoalPopup
        isVisible={isCreatePopupVisible} 
        onClose={() => setIsCreatePopupVisible(false)}
        defaultAreaId={areaId}
      />

      <DeleteGoalPopup
        isVisible={deletePopupState.isVisible}
        onClose={() => setDeletePopupState(prev => ({ ...prev, isVisible: false }))}
        onConfirm={handleConfirmDelete}
        itemName={deletePopupState.goalTitle}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default AreaDetailsPage;
