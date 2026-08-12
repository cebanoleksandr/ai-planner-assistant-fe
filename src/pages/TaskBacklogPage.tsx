import { useMemo, useState } from 'react';
import { 
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, 
  List, ListItem, ListItemText, Checkbox, LinearProgress, IconButton,
  TextField, InputAdornment, FormControlLabel, Switch, Paper, Button, Drawer, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SearchIcon from '@mui/icons-material/Search';
import { CheckCircleOutlineOutlined as CheckCircleOutlineOutlined } from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';

import { useTasks, useToggleTaskComplete, useUpdateTask, useOptimizeTasks } from '../reactQuery/hooks/useTasks';
import { useGoals } from '../reactQuery/hooks/useGoals';
import { UpdateTaskPopup } from '../components/popups/UpdateTaskPopup';
import type { Task } from '../services/interfaces';

const TaskBacklogPage = () => {
  const { data: tasks = [] } = useTasks();
  const { data: goals = [] } = useGoals();
  const updateTaskMutation = useUpdateTask();
  const toggleCompleteMutation = useToggleTaskComplete();
  const optimizeTasksMutation = useOptimizeTasks();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [optimizedTasks, setOptimizedTasks] = useState<Task[]>([]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    updateTaskMutation.mutate({
      id: draggableId,
      payload: { goalId: destination.droppableId }
    });
  };

  const handleCompleteAll = async (tasksToComplete: Task[]) => {
    const incompleteTasks = tasksToComplete.filter(t => !t.isCompleted);
    await Promise.all(incompleteTasks.map(task => toggleCompleteMutation.mutateAsync(task.id)));
  };

  const handleOptimize = () => {
    setAiDrawerOpen(true);
    setAiInsights("AI is analyzing your workload, deadlines, and goal progress...");
    setOptimizedTasks([]);
    
    optimizeTasksMutation.mutate(undefined, {
      onSuccess: (data) => {
        setAiInsights(data?.message || "Tasks successfully optimized by AI!");
        setOptimizedTasks(data?.optimizedTasks || []);
      },
      onError: () => {
        setAiInsights("Failed to optimize tasks. Please try again later.");
        setOptimizedTasks([]);
      }
    });
  };

  const groupedTasks = useMemo(() => {
    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompleted = showCompleted || !task.isCompleted;
      return matchesSearch && matchesCompleted;
    });

    return goals.map(goal => ({
      goal,
      tasks: filteredTasks.filter(task => task.goal?.id === goal.id)
    })).filter(group => group.tasks.length > 0 || !searchQuery);
  }, [tasks, goals, searchQuery, showCompleted]);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>Task Backlog</Typography>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }
          }}
          sx={{ flexGrow: 1, width: '100%' }}
        />
        <FormControlLabel
          control={<Switch checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />}
          label="Show Completed"
        />
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleOptimize}
          disabled={optimizeTasksMutation.isPending}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {optimizeTasksMutation.isPending ? 'Optimizing...' : 'Optimize by AI'}
        </Button>
      </Paper>

      <DragDropContext onDragEnd={handleDragEnd}>
        {groupedTasks.map(({ goal, tasks: goalTasks }) => {
          const allDone = goalTasks.length > 0 && goalTasks.every(t => t.isCompleted);

          return (
            <Accordion key={goal.id} defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ width: '100%', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{goal.title}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={goalTasks.length > 0 ? (goalTasks.filter(t => t.isCompleted).length / goalTasks.length) * 100 : 0} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }} 
                    />
                  </Box>

                  {!allDone && goalTasks.length > 0 && (
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); handleCompleteAll(goalTasks); }}
                      color="primary"
                      title="Complete all tasks"
                    >
                      <CheckCircleOutlineOutlined />
                    </IconButton>
                  )}
                </Box>
              </AccordionSummary>
              
              <Droppable droppableId={goal.id}>
                {(provided) => (
                  <AccordionDetails ref={provided.innerRef} {...provided.droppableProps}>
                    <List>
                      {goalTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <ListItem 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{ bgcolor: snapshot.isDragging ? 'action.hover' : 'transparent', borderRadius: 1 }}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => setSelectedTask(task)}>
                                  <EditIcon />
                                </IconButton>
                              }
                            >
                              <Box {...provided.dragHandleProps} sx={{ display: 'flex', alignItems: 'center', mr: 1, cursor: 'grab' }}>
                                <DragIndicatorIcon color="action" />
                              </Box>

                              <Checkbox 
                                checked={task.isCompleted} 
                                onChange={() => toggleCompleteMutation.mutate(task.id)}
                              />
                              <ListItemText 
                                primary={task.title} 
                                sx={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}
                              />
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  </AccordionDetails>
                )}
              </Droppable>
            </Accordion>
          );
        })}
      </DragDropContext>

      <Drawer anchor="right" open={isAiDrawerOpen} onClose={() => setAiDrawerOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 380 }, maxWidth: '100vw', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon color="secondary" /> AI Insights
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="body1" sx={{ mb: 3 }}>{aiInsights}</Typography>

          {optimizedTasks.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Suggested Task Order & Priority:
              </Typography>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, pb: 2 }}>
                {optimizedTasks.map((task) => (
                  <Paper key={task.id} variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{task.title}</Typography>
                      {task.priority && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            px: 1, py: 0.2, borderRadius: 1, fontWeight: 'bold',
                            bgcolor: task.priority === 'High' ? 'error.light' : task.priority === 'Medium' ? 'warning.light' : 'success.light',
                            color: 'white'
                          }}
                        >
                          {task.priority}
                        </Typography>
                      )}
                    </Box>
                    {task.description && (
                      <Typography variant="caption" color="text.secondary">
                        {task.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <UpdateTaskPopup
        isVisible={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskId={selectedTask?.id || ''}
        initialTitle={selectedTask?.title || ''}
        initialDescription={selectedTask?.description}
        initialDueDate={selectedTask?.dueDate}
        initialGoalId={selectedTask?.goal?.id || ''}
      />
    </Box>
  );
};

export default TaskBacklogPage;
