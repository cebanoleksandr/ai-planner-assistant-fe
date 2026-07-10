import { useQuery } from '@tanstack/react-query';
import { EQueries } from '../_types';
import { UsersService } from '../../services/users.service';

export const useMe = () => {
  return useQuery({
    queryKey: [EQueries.ME],
    queryFn: UsersService.getMe,
    staleTime: 5 * 60 * 1000,
  });
};