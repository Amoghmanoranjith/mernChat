import {
  selectSelectedChatId,
  updateSelectedChatId,
} from "@/services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { useToggleChatBar } from "../useUI/useToggleChatBar";
import { useMediaQuery } from "../useUtils/useMediaQuery";

export const useChatListItemClick = () => {
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const { toggleChatBar } = useToggleChatBar();

  const isLg = useMediaQuery(1024);

  const handleChatListItemClick = (chatId: string) => {
    if (selectedChatId !== chatId) {
      dispatch(updateSelectedChatId(chatId));
    }
    if (isLg) {
      toggleChatBar();
    }
  };

  return { handleChatListItemClick };
};
