import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '../../services/chat.service';
import { EQueries } from '../_types';

export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ChatService.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQueries.TASKS] });
      queryClient.invalidateQueries({ queryKey: [EQueries.GOALS] });
    },
  });
};
