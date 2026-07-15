import { type FC, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BasePopup from './BasePopup';
import { useUpdateTask } from '../../reactQuery/hooks/useTasks';
import { useGoals } from '../../reactQuery/hooks/useGoals';
import { useAppDispatch } from '../../storage/hooks';
import { setAlertAC } from '../../storage/alertSlice';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  taskId: string;
  initialTitle: string;
  initialDescription?: string;
  initialDueDate?: string;
  initialGoalId: string;
}

interface ITaskForm {
  title: string;
  description?: string;
  dueDate?: string;
  goalId: string;
}

const schema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Too long'),
  description: yup.string(),
  dueDate: yup.string(),
  goalId: yup.string().required('Linked Goal is required'),
}).required();

export const UpdateTaskPopup: FC<IProps> = ({ 
  isVisible, 
  onClose, 
  taskId,
  initialTitle,
  initialDescription,
  initialDueDate,
  initialGoalId
}) => {
  const updateMutation = useUpdateTask();
  const dispatch = useAppDispatch();
  const { data: goals = [] } = useGoals();
  
  const formattedDateTime = initialDueDate ? initialDueDate.slice(0, 16) : '';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ITaskForm>({
    resolver: yupResolver(schema) as Resolver<ITaskForm>,
    defaultValues: {
      title: initialTitle,
      description: initialDescription || '',
      dueDate: formattedDateTime,
      goalId: initialGoalId,
    }
  });

  useEffect(() => {
    if (isVisible) {
      reset({
        title: initialTitle,
        description: initialDescription || '',
        dueDate: formattedDateTime,
        goalId: initialGoalId,
      });
    }
  }, [isVisible, initialTitle, initialDescription, formattedDateTime, initialGoalId, reset]);

  const handleClose = () => {
    reset(); 
    onClose();
  };

  const onSubmit = (data: ITaskForm) => {
    const payload = {
      ...data,
      dueDate: data.dueDate || undefined,
    };

    updateMutation.mutate(
      { id: taskId, payload },
      {
        onSuccess: () => {
          handleClose();
          dispatch(setAlertAC({ text: 'Task was successfully updated!', mode: 'success' }));
        },
        onError: (error) => {
          dispatch(setAlertAC({ 
            text: error?.message || 'Failed to update task.', 
            mode: 'error' 
          }));
        }
      }
    );
  };

  return (
    <BasePopup isVisible={isVisible} onClose={handleClose}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          Edit Task
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <TextField
          label="Task Title"
          fullWidth
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message || ' '}
        />

        <TextField
          label="Description (optional)"
          multiline
          rows={3}
          fullWidth
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message || ' '}
        />

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            label="Due Date"
            type="datetime-local"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate?.message || ' '}
          />

          <FormControl fullWidth error={!!errors.goalId}>
            <InputLabel id="edit-goal-select-label">Linked Goal</InputLabel>
            <Select
              labelId="edit-goal-select-label"
              label="Linked Goal"
              defaultValue={initialGoalId || ''}
              {...register('goalId')}
              MenuProps={{
                sx: { zIndex: 1500 }
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Goal</em>
              </MenuItem>
              {goals.map((goal) => (
                <MenuItem key={goal.id} value={goal.id}>
                  {goal.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.goalId?.message || ' '}</FormHelperText>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
};
