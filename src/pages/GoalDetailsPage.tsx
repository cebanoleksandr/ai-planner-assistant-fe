import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  type SelectChangeEvent
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  DeleteOutlineOutlined as DeleteIcon,
  EditOutlined as EditIcon,
} from '@mui/icons-material';
import { useGoals, useUpdateGoalStatus } from '../reactQuery/hooks/useGoals';
import { useCreateTask, useToggleTaskComplete, useDeleteTask } from '../reactQuery/hooks/useTasks';
import { useAppDispatch } from '../storage/hooks';
import { setAlertAC } from '../storage/alertSlice';
import { DeleteTaskPopup } from '../components/popups/DeleteTaskPopup';
import { UpdateTaskPopup } from '../components/popups/UpdateTaskPopup';
import type { Task } from '../services/interfaces';

export const GoalDetailsPage = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: goals = [], isLoading } = useGoals();
  const currentGoal = goals.find(g => g.id === goalId);

  const updateStatusMutation = useUpdateGoalStatus();
  const createTaskMutation = useCreateTask();
  const toggleTaskMutation = useToggleTaskComplete();
  const deleteTaskMutation = useDeleteTask();

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [deletePopupState, setDeletePopupState] = useState({
    isVisible: false,
    taskId: '',
    taskTitle: '',
  });

  const [editPopupState, setEditPopupState] = useState({
    isVisible: false,
    taskId: '',
    initialTitle: '',
    initialDescription: '',
    initialDueDate: '',
    initialGoalId: '',
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const newStatus = e.target.value as 'active' | 'completed' | 'paused';
    
    updateStatusMutation.mutate(
      { id: goalId as string, status: newStatus },
      {
        onSuccess: () => {
          dispatch(setAlertAC({ text: `Goal marked as ${newStatus}`, mode: 'success' }));
        },
        onError: (error) => {
          dispatch(setAlertAC({ text: error?.message || 'Failed to update status', mode: 'error' }));
        }
      }
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createTaskMutation.mutate(
      { title: newTaskTitle, goalId: goalId },
      {
        onSuccess: () => {
          setNewTaskTitle('');
        },
        onError: () => {
          dispatch(setAlertAC({ text: 'Failed to add task.', mode: 'error' }));
        }
      }
    );
  };

  const handleToggleTask = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeletePopupState({
      isVisible: true,
      taskId: id,
      taskTitle: title,
    });
  };

  const handleEditClick = (task: Task) => {
    setEditPopupState({
      isVisible: true,
      taskId: task.id,
      initialTitle: task.title,
      initialDescription: task.description || '',
      initialDueDate: task.dueDate || '',
      initialGoalId: currentGoal?.id || '',
    });
  };

  const closeDeletePopup = () => {
    setDeletePopupState(prev => ({ ...prev, isVisible: false }));
  };

  const closeEditPopup = () => {
    setEditPopupState(prev => ({ ...prev, isVisible: false }));
  };

  const handleConfirmDelete = () => {
    deleteTaskMutation.mutate(deletePopupState.taskId, {
      onSuccess: () => {
        closeDeletePopup();
        dispatch(setAlertAC({ text: `Task "${deletePopupState.taskTitle}" was deleted.`, mode: 'info' }));
      },
      onError: (error) => {
        closeDeletePopup();
        dispatch(setAlertAC({ text: error?.message || 'Failed to delete task.', mode: 'error' }));
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentGoal) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Goal not found.</Typography>
        <Button onClick={() => navigate('/areas')} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    );
  }

  const tasks = [...(currentGoal.tasks || [])].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          color="inherit"
          sx={{ mb: 1, color: 'text.secondary' }}
        >
          Back
        </Button>
      </Box>

      <Card elevation={2}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {currentGoal.title}
            </Typography>
            
            <FormControl size="small">
              <Select
                value={currentGoal.status}
                onChange={handleStatusChange}
                disabled={updateStatusMutation.isPending}
                sx={{ 
                  textTransform: 'capitalize', 
                  fontWeight: 'bold',
                  height: 32,
                  color: 
                    currentGoal.status === 'active' ? 'primary.main' :
                    currentGoal.status === 'completed' ? 'success.main' : 'text.secondary',
                  bgcolor: 'action.hover',
                  borderRadius: 4,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <MenuItem value="active" sx={{ fontWeight: 500, color: 'primary.main' }}>Active</MenuItem>
                <MenuItem value="completed" sx={{ fontWeight: 500, color: 'success.main' }}>Completed</MenuItem>
                <MenuItem value="paused" sx={{ fontWeight: 500, color: 'text.secondary' }}>Paused</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', mb: 1 }}>
            <Typography variant="body2">
              <strong>Target Date:</strong> {formatDate(currentGoal.targetDate)}
            </Typography>
            {currentGoal.lifeArea && (
              <Typography variant="body2">
                <strong>Area:</strong> {currentGoal.lifeArea.name}
              </Typography>
            )}
          </Box>

          {currentGoal.description && (
            <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              {currentGoal.description}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedTasks} of {totalTasks} completed
            </Typography>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 6, borderRadius: 3, mb: 3 }} 
          />

          <List sx={{ p: 0, mb: 3 }}>
            {tasks.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No tasks yet. Add one below!
              </Typography>
            ) : (
              tasks.map((task) => (
                <ListItem 
                  key={task.id}
                  disablePadding
                  sx={{ 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    opacity: task.isCompleted ? 0.6 : 1,
                    transition: 'opacity 0.2s'
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleEditClick(task)} 
                      >
                        <EditIcon color="action" />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        onClick={() => handleDeleteClick(task.id, task.title)} 
                        disabled={deleteTaskMutation.isPending && deletePopupState.taskId === task.id}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Checkbox
                      edge="start"
                      checked={task.isCompleted}
                      onChange={() => handleToggleTask(task.id)}
                      disabled={toggleTaskMutation.isPending && toggleTaskMutation.variables === task.id}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    disableTypography
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textDecoration: task.isCompleted ? 'line-through' : 'none',
                          fontWeight: 500
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>

          <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={createTaskMutation.isPending}
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
              sx={{ minWidth: '100px' }}
            >
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>

      <DeleteTaskPopup
        isVisible={deletePopupState.isVisible}
        onClose={closeDeletePopup}
        onConfirm={handleConfirmDelete}
        itemName={deletePopupState.taskTitle}
        isLoading={deleteTaskMutation.isPending}
      />

      <UpdateTaskPopup
        isVisible={editPopupState.isVisible}
        onClose={closeEditPopup}
        taskId={editPopupState.taskId}
        initialTitle={editPopupState.initialTitle}
        initialDescription={editPopupState.initialDescription}
        initialDueDate={editPopupState.initialDueDate}
        initialGoalId={editPopupState.initialGoalId}
      />
    </Box>
  );
};

export default GoalDetailsPage;
