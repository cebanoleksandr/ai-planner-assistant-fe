import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../../services/auth.service';

export const useLogin = () => {
  return useMutation({
    mutationFn: AuthService.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: AuthService.register,
  });
};
