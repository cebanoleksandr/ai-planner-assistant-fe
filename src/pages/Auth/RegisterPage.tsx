import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Link as MuiLink,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegister } from '../../reactQuery/hooks/useAuth';

const registerSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
}).required();

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterPage = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormData>,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError('');
    registerMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => navigate('/'),
        onError: () => setServerError('Registration failed. This user might already exist.'),
      }
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h1" sx={{ align: "center", fontWeight: "bold" }}>
        Create Account
      </Typography>

      {serverError && <Alert severity="error">{serverError}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          disabled={registerMutation.isPending}
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message || ' '}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          disabled={registerMutation.isPending}
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message || ' '}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          disabled={registerMutation.isPending}
          {...register('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message || ' '}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large"
          fullWidth
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Loading...' : 'Sign Up'}
        </Button>
      </Box>

      <Typography align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <MuiLink component={Link} to="/auth/login" underline="hover">
          Sign in
        </MuiLink>
      </Typography>
    </Paper>
  );
};

export default RegisterPage;
