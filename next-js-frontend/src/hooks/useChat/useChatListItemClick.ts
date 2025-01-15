import { useGetChatsQuery } from "@/services/api/chat.api";
import {
  selectSelectedChatDetails,
  updateSelectedChatDetails,
} from "@/services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { useToggleChatBar } from "../useUI/useToggleChatBar";
import { useMediaQuery } from "../useUtils/useMediaQuery";

export const useChatListItemClick = () => {
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id;
  const { toggleChatBar } = useToggleChatBar();
  const { data: chats } = useGetChatsQuery();

  const isLg = useMediaQuery(1024);

  const handleChatListItemClick = (chatId: string) => {
    if (selectedChatId !== chatId && chats && chats.length) {
      const selectedChatByUser = chats.find((chat) => chat._id === chatId);
      if (selectedChatByUser) {
        dispatch(updateSelectedChatDetails(selectedChatByUser));
      }
    }
    if (isLg) {
      toggleChatBar();
    }
  };

  return { handleChatListItemClick };
};
