import type { FC } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BasePopup from './BasePopup';
import { useCreateLifeArea } from '../../reactQuery/hooks/useLifeAreas';
import { useAppDispatch } from '../../storage/hooks';
import { setAlertAC } from '../../storage/alertSlice';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
}

interface IAreaForm {
  name: string;
  color: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Too long'),
  color: yup.string().required('Color is required'),
}).required();

export const CreateAreaPopup: FC<IProps> = ({ isVisible, onClose }) => {
  const createMutation = useCreateLifeArea();
  const dispatch = useAppDispatch();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IAreaForm>({
    resolver: yupResolver(schema) as Resolver<IAreaForm>,
    defaultValues: {
      name: '',
      color: '#4A76A8',
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: IAreaForm) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        handleClose();
        dispatch(setAlertAC({ 
          text: 'Life Area was successfully created!', 
          mode: 'success' 
        }));
      },
      onError: (error) => {
        dispatch(setAlertAC({ 
          text: error?.message || 'Failed to create Life Area.', 
          mode: 'error' 
        }));
      }
    });
  };

  return (
    <BasePopup isVisible={isVisible} onClose={handleClose}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
          Create New Life Area
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Area Name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message || ' '}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography color="text.secondary">Color:</Typography>
          <input
            type="color"
            {...register('color')}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              padding: 0
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Create'}
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
};
