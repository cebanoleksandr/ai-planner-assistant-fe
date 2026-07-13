import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTasks, useToggleTaskComplete } from '../reactQuery/hooks/useTasks';
import { useGoals } from '../reactQuery/hooks/useGoals';
import { CreateGoalPopup } from '../components/popups/CreateGoalPopup';
import { CreateTaskPopup } from '../components/popups/CreateTaskPopup';

export const Dashboard = () => {
  const [isGoalPopupVisible, setIsGoalPopupVisible] = useState(false);
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);

  const todayParams = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return {
      startDate: startOfToday.toISOString(),
      endDate: endOfToday.toISOString(),
    };
  }, []);

  const { data: tasks = [], isLoading: isTasksLoading } = useTasks(todayParams);
  const { data: allGoals = [], isLoading: isGoalsLoading } = useGoals();
  
  const activeGoals = useMemo(() => {
    return allGoals.filter(goal => goal.status === 'active');
  }, [allGoals]);

  const toggleTaskMutation = useToggleTaskComplete();

  const handleToggleTask = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const todayProgress = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary"}}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is what's happening today.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={() => setIsGoalPopupVisible(true)}
          >
            New Goal
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setIsTaskPopupVisible(true)}
          >
            New Task
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardHeader 
              title="Today's Agenda" 
              titleTypographyProps={{ fontWeight: 'bold' }}
              action={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mr: 1 }}>
                  {completedTasksCount} of {tasks.length} completed
                </Typography>
              }
            />
            <Divider />
            
            <LinearProgress variant="determinate" value={todayProgress} sx={{ height: 4 }} />

            {isTasksLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : tasks.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No tasks for today.</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {tasks.map((task) => (
                  <ListItem 
                    key={task.id} 
                    disablePadding 
                    sx={{ 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      opacity: task.isCompleted ? 0.6 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <ListItemIcon sx={{ pl: 2 }}>
                      <Checkbox
                        edge="start"
                        checked={task.isCompleted}
                        onChange={() => handleToggleTask(task.id)}
                        disabled={toggleTaskMutation.isPending && toggleTaskMutation.variables === task.id}
                        sx={{
                          color: task.goal?.lifeArea?.color || 'default',
                          '&.Mui-checked': {
                            color: task.goal?.lifeArea?.color || 'primary.main',
                          },
                        }}
                      />
                    </ListItemIcon>
                    
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: task.isCompleted ? 'line-through' : 'none',
                            fontWeight: 500,
                          }}
                        >
                          {task.title}
                        </Typography>
                      }
                      secondary={
                        task.dueDate && (
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(task.dueDate)}
                          </Typography>
                        )
                      }
                    />

                    <Box sx={{ pr: 2 }}>
                      {task.goal?.lifeArea && (
                        <Chip 
                          label={task.goal.lifeArea.name} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: task.goal.lifeArea.color,
                            color: task.goal.lifeArea.color 
                          }}
                        />
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardHeader 
              title="Active Goals" 
              titleTypographyProps={{ fontWeight: 'bold' }} 
            />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {isGoalsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : activeGoals.length === 0 ? (
                <Typography color="text.secondary" align="center">No active goals right now.</Typography>
              ) : (
                activeGoals.map((goal) => (
                  <Box key={goal.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {goal.title}
                      </Typography>
                      
                      <Chip 
                        label={goal.status} 
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>

                    {goal.targetDate && (
                      <Typography variant="caption" color="text.secondary">
                        Target: {formatDate(goal.targetDate)}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CreateGoalPopup
        isVisible={isGoalPopupVisible}
        onClose={() => setIsGoalPopupVisible(false)}
      />

      <CreateTaskPopup
        isVisible={isTaskPopupVisible}
        onClose={() => setIsTaskPopupVisible(false)}
      />
    </Box>
  );
};

export default Dashboard;