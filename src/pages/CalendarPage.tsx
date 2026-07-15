import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Calendar, 
  dateFnsLocalizer, 
  type Event as BigCalendarEvent,
  type View,
  Views 
} from 'react-big-calendar';
import dragAndDropImport from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks, useUpdateTask } from '../reactQuery/hooks/useTasks';
import { useGoals, useUpdateGoal } from '../reactQuery/hooks/useGoals';
import { useAppDispatch } from '../storage/hooks';
import { setAlertAC } from '../storage/alertSlice';
import { UpdateTaskPopup } from '../components/popups/UpdateTaskPopup';
import { CreateTaskPopup } from '../components/popups/CreateTaskPopup'; 
import { CreateGoalPopup } from '../components/popups/CreateGoalPopup'; 
import type { Goal, Task } from '../services/interfaces';

const withDragAndDrop = typeof dragAndDropImport === 'function' 
  ? dragAndDropImport 
  : (dragAndDropImport as { default: typeof dragAndDropImport }).default;

const DnDCalendar = withDragAndDrop(Calendar);

interface TaskCalendarEvent extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task';
  allDay?: boolean;
  originalData: Task;
}

interface GoalCalendarEvent extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'goal';
  allDay?: boolean;
  originalData: Goal;
}

type CalendarEvent = TaskCalendarEvent | GoalCalendarEvent;

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const CalendarPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
  const { data: goals = [], isLoading: isLoadingGoals } = useGoals();

  const updateTaskMutation = useUpdateTask();
  const updateGoalMutation = useUpdateGoal();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date | null>(null);
  const [isChoiceDialogOpen, setIsChoiceDialogOpen] = useState(false);
  const [isCreateTaskVisible, setIsCreateTaskVisible] = useState(false);
  const [isCreateGoalVisible, setIsCreateGoalVisible] = useState(false);

  const events: CalendarEvent[] = useMemo(() => {
    const taskEvents: TaskCalendarEvent[] = tasks.map((task) => {
      const startDate = new Date(task.dueDate || task.createdAt);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 

      return {
        id: task.id,
        title: task.title,
        start: startDate,
        end: endDate,
        type: 'task',
        originalData: task,
      };
    });

    const goalEvents: GoalCalendarEvent[] = goals
      .filter((goal) => goal.targetDate) 
      .map((goal) => {
        const startDate = new Date(goal.targetDate!);
        const endDate = new Date(startDate);
        
        return {
          id: goal.id,
          title: `🎯 ${goal.title}`,
          start: startDate,
          end: endDate,
          allDay: true,
          type: 'goal',
          originalData: goal,
        };
      });

    return [...taskEvents, ...goalEvents];
  }, [tasks, goals]);

  const eventStyleGetter = (rawEvent: object) => {
    const event = rawEvent as CalendarEvent;
    let backgroundColor = event.type === 'goal' ? '#9c27b0' : '#1976d2'; 
    if (event.type === 'task' && event.originalData.isCompleted) {
      backgroundColor = '#2e7d32'; 
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      }
    };
  };

  const handleSelectEvent = (rawEvent: object) => {
    const event = rawEvent as CalendarEvent;
    if (event.type === 'task') {
      setSelectedTask(event.originalData);
    } else if (event.type === 'goal') {
      navigate(`/app/goals/${event.id}`);
    }
  };

  const handleNavigate = (newDate: Date) => setCurrentDate(newDate);
  const handleViewChange = (newView: View) => setCurrentView(newView);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedSlotDate(slotInfo.start);
    setIsChoiceDialogOpen(true);
  };

  const onEventDrop = (args: { event: object; start: string | Date; end: string | Date; isAllDay?: boolean }) => {
    const event = args.event as CalendarEvent;
    const newDate = new Date(args.start);
    const offset = newDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(newDate.getTime() - offset).toISOString();

    if (event.type === 'task') {
      updateTaskMutation.mutate(
        { id: event.id, payload: { dueDate: localISOTime.slice(0, 16) } },
        {
          onSuccess: () => dispatch(setAlertAC({ text: 'Task date updated', mode: 'success' })),
          onError: () => dispatch(setAlertAC({ text: 'Failed to update task date', mode: 'error' }))
        }
      );
    } else if (event.type === 'goal') {
      updateGoalMutation.mutate(
        { id: event.id, payload: { targetDate: localISOTime.split('T')[0] } },
        {
          onSuccess: () => dispatch(setAlertAC({ text: 'Goal deadline updated', mode: 'success' })),
          onError: () => dispatch(setAlertAC({ text: 'Failed to update goal deadline', mode: 'error' }))
        }
      );
    }
  };

  const openCreateTask = () => {
    setIsChoiceDialogOpen(false);
    setIsCreateTaskVisible(true);
  };

  const openCreateGoal = () => {
    setIsChoiceDialogOpen(false);
    setIsCreateGoalVisible(true);
  };

  if (isLoadingTasks || isLoadingGoals) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getDefaultDateTime = () => {
    if (!selectedSlotDate) return '';
    const date = new Date(selectedSlotDate);
    if (currentView === Views.MONTH) {
      date.setHours(12, 0, 0, 0); 
    }
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: 'calc(100vh - 100px)' }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Schedule your tasks and track goal deadlines.
        </Typography>
      </Box>

      <Card 
        elevation={2} 
        sx={{ 
          flexGrow: 1, 
          p: 2,
          '& .rbc-addons-dnd-drag-preview': {
            opacity: '0.8 !important',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.2) !important',
            transform: 'scale(1.02)',
            transition: 'opacity 0.1s ease',
            borderRadius: '4px',
          },
          '& .rbc-addons-dnd-dragged-event': {
            opacity: '0.3 !important',
          }
        }}
      >
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor={(event: object) => (event as CalendarEvent).start}
          endAccessor={(event: object) => (event as CalendarEvent).end}
          allDayAccessor={(event: object) => (event as CalendarEvent).allDay}
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          date={currentDate}
          view={currentView}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onEventDrop={onEventDrop} 
          resizable={false} 
        />
      </Card>

      <AnimatePresence>
        {isChoiceDialogOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChoiceDialogOpen(false)}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 4,
                minWidth: 320,
                maxWidth: '90%',
                textAlign: 'center',
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                Create New Event
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Selected date: {selectedSlotDate ? format(selectedSlotDate, 'MMMM d, yyyy') : ''}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  onClick={openCreateGoal} 
                  sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                  🎯 New Goal
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={openCreateTask} 
                  sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                  ✓ New Task
                </Button>
              </Box>
            </Card>
          </Box>
        )}
      </AnimatePresence>

      <UpdateTaskPopup
        isVisible={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskId={selectedTask?.id || ''}
        initialTitle={selectedTask?.title || ''}
        initialDescription={selectedTask?.description}
        initialDueDate={selectedTask?.dueDate}
        initialGoalId={selectedTask?.goal?.id || ''}
      />

      <CreateTaskPopup
        isVisible={isCreateTaskVisible}
        onClose={() => setIsCreateTaskVisible(false)}
        initialDueDate={selectedSlotDate ? getDefaultDateTime().slice(0, 16) : undefined} 
      />

      <CreateGoalPopup
        isVisible={isCreateGoalVisible}
        onClose={() => setIsCreateGoalVisible(false)}
        initialTargetDate={selectedSlotDate ? getDefaultDateTime().split('T')[0] : undefined}
      />
    </Box>
  );
};

export default CalendarPage;
