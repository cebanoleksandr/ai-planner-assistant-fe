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
import { useLogin } from '../../reactQuery/hooks/useAuth';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as Resolver<LoginFormData>,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError('');
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => navigate('/'),
        onError: () => setServerError('Invalid email or password'),
      }
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h1" sx={{ align: "center", fontWeight: "bold" }}>
        Sign In
      </Typography>

      <Box sx={{ minHeight: 48 }}>
        {serverError && <Alert severity="error">{serverError}</Alert>}
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          disabled={loginMutation.isPending}
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message || ' '} 
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          disabled={loginMutation.isPending}
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message || ' '}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large"
          fullWidth
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Loading...' : 'Sign In'}
        </Button>
      </Box>

      <Typography align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <MuiLink component={Link} to="/auth/register" underline="hover">
          Sign up
        </MuiLink>
      </Typography>
    </Paper>
  );
};

export default LoginPage;
