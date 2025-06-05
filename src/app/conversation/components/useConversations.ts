import { useQuery } from '@tanstack/react-query';
import { NEXT_PUBLIC_LOCAL } from '../../helper/constant';
import { ConversationProps } from './typeConversation';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/all-conversation`);
      if (!res.ok) throw new Error('Lỗi khi tải bài viết');
      const data: ConversationProps = await res.json();
      return data
    },
  });
};
