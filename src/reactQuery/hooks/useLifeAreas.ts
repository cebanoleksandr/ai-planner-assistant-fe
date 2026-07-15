import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EQueries } from '../_types';
import { LifeAreasService } from '../../services/life-areas.service';

export const useLifeAreas = () => {
  return useQuery({
    queryKey: [EQueries.LIFE_AREAS],
    queryFn: LifeAreasService.getAll,
  });
};

export const useCreateLifeArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: LifeAreasService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.LIFE_AREAS] });
    },
  });
};

export const useUpdateLifeArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; color?: string } }) => 
      LifeAreasService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.LIFE_AREAS] });
    },
  });
};

export const useDeleteLifeArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: LifeAreasService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.LIFE_AREAS] });
    },
  });
};
