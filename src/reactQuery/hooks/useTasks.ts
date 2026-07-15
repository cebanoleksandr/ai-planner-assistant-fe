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
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};

export const useToggleTaskComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TasksService.toggleComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.TASKS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      payload 
    }: { 
      id: string; 
      payload: { title?: string; description?: string; dueDate?: string; goalId?: string } 
    }) => TasksService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.TASKS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TasksService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.TASKS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] }); 
    },
  });
};