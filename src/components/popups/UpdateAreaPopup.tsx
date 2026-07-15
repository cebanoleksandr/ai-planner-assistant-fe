import { type FC, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BasePopup from './BasePopup';
import { useUpdateLifeArea } from '../../reactQuery/hooks/useLifeAreas';
import { useAppDispatch } from '../../storage/hooks';
import { setAlertAC } from '../../storage/alertSlice';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  areaId: string;
  initialName: string;
  initialColor?: string;
}

interface IAreaForm {
  name: string;
  color?: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Too long'),
  color: yup.string(),
}).required();

export const UpdateAreaPopup: FC<IProps> = ({ 
  isVisible, 
  onClose, 
  areaId, 
  initialName, 
  initialColor 
}) => {
  const updateMutation = useUpdateLifeArea();
  const dispatch = useAppDispatch();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IAreaForm>({
    resolver: yupResolver(schema) as Resolver<IAreaForm>,
    defaultValues: {
      name: initialName,
      color: initialColor || '#1976d2',
    }
  });

  useEffect(() => {
    if (isVisible) {
      reset({
        name: initialName,
        color: initialColor || '#1976d2',
      });
    }
  }, [isVisible, initialName, initialColor, reset]);

  const handleClose = () => {
    reset(); 
    onClose();
  };

  const onSubmit = (data: IAreaForm) => {
    updateMutation.mutate(
      { id: areaId, payload: data },
      {
        onSuccess: () => {
          handleClose();
          dispatch(setAlertAC({ text: 'Area was successfully updated!', mode: 'success' }));
        },
        onError: (error) => {
          dispatch(setAlertAC({ 
            text: error?.message || 'Failed to update area.', 
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
          Edit Life Area
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <TextField
          label="Area Name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message || ' '}
        />

        <TextField
          label="Color (Hex)"
          type="color"
          fullWidth
          {...register('color')}
          error={!!errors.color}
          helperText={errors.color?.message || ' '}
          sx={{
            '& input': { height: 40, cursor: 'pointer', padding: 1 }
          }}
        />
        
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
