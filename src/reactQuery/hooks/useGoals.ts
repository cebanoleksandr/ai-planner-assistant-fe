import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueries } from '../_types';
import { GoalsService } from '../../services/goals.service';
import type { Goal } from '../../services/interfaces';

interface GetGoalsParams {
  lifeAreaId?: string;
  search?: string;
}

export const useGoals = (params?: GetGoalsParams) => {
  return useQuery({
    queryKey: [EQueries.GOALS, params],
    queryFn: () => GoalsService.getAll(params),
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: GoalsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};

export const useUpdateGoalStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Goal['status'] }) => 
      GoalsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: GoalsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};
