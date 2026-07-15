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
import { useUpdateGoal } from '../../reactQuery/hooks/useGoals';
import { useLifeAreas } from '../../reactQuery/hooks/useLifeAreas';
import { useAppDispatch } from '../../storage/hooks';
import { setAlertAC } from '../../storage/alertSlice';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  goalId: string;
  initialTitle: string;
  initialDescription?: string;
  initialTargetDate?: string;
  initialLifeAreaId: string;
}

interface IGoalForm {
  title: string;
  description?: string;
  targetDate?: string;
  lifeAreaId: string;
}

const schema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Too long'),
  description: yup.string(),
  targetDate: yup.string(),
  lifeAreaId: yup.string().required('Life Area is required'),
}).required();

export const UpdateGoalPopup: FC<IProps> = ({ 
  isVisible, 
  onClose, 
  goalId,
  initialTitle,
  initialDescription,
  initialTargetDate,
  initialLifeAreaId
}) => {
  const updateMutation = useUpdateGoal();
  const dispatch = useAppDispatch();
  const { data: areas = [] } = useLifeAreas();
  
  const formattedDate = initialTargetDate ? initialTargetDate.split('T')[0] : '';

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IGoalForm>({
    resolver: yupResolver(schema) as Resolver<IGoalForm>,
    defaultValues: {
      title: initialTitle,
      description: initialDescription || '',
      targetDate: formattedDate,
      lifeAreaId: initialLifeAreaId,
    }
  });

  useEffect(() => {
    if (isVisible) {
      reset({
        title: initialTitle,
        description: initialDescription || '',
        targetDate: formattedDate,
        lifeAreaId: initialLifeAreaId,
      });
    }
  }, [isVisible, initialTitle, initialDescription, formattedDate, initialLifeAreaId, reset]);

  const handleClose = () => {
    reset(); 
    onClose();
  };

  const onSubmit = (data: IGoalForm) => {
    const payload = {
      ...data,
      targetDate: data.targetDate || undefined,
    };

    updateMutation.mutate(
      { id: goalId, payload },
      {
        onSuccess: () => {
          handleClose();
          dispatch(setAlertAC({ text: 'Goal was successfully updated!', mode: 'success' }));
        },
        onError: (error) => {
          dispatch(setAlertAC({ 
            text: error?.message || 'Failed to update goal.', 
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
          Edit Goal
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <TextField
          label="Goal Title"
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
            label="Target Date"
            type="date"
            fullWidth
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('targetDate')}
            error={!!errors.targetDate}
            helperText={errors.targetDate?.message || ' '}
          />

          <FormControl fullWidth error={!!errors.lifeAreaId}>
            <InputLabel id="edit-life-area-select-label">Life Area</InputLabel>
            <Select
              labelId="edit-life-area-select-label"
              label="Life Area"
              defaultValue={initialLifeAreaId || ''}
              {...register('lifeAreaId')}
              MenuProps={{
                sx: { zIndex: 1500 }
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Life Area</em>
              </MenuItem>
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.lifeAreaId?.message || ' '}</FormHelperText>
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
