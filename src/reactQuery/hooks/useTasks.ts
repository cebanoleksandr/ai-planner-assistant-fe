import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueries } from '../_types';
import { TasksService } from '../../services/tasks.service';

interface GetTasksParams {
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const useTasks = (params?: GetTasksParams) => {
  return useQuery({
    queryKey: [EQueries.TASKS, params],
    queryFn: () => TasksService.getAll(params),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TasksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.TASKS] });
    },
  });
};

export const useToggleTaskComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TasksService.toggleComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.TASKS] });
    },
  });
};