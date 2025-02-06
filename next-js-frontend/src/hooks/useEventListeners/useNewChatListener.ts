import { Event } from "@/interfaces/events.interface";
import { Friend } from "@/interfaces/friends.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { getOtherMemberOfPrivateChat } from "@/lib/shared/helpers";
import { useSocketEvent } from "../useSocket/useSocketEvent";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";

export const useNewChatListener = () => {
  const dispatch = useAppDispatch();
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id;

  useSocketEvent(Event.NEW_CHAT, (newChat: fetchUserChatsResponse) => {
    console.log("new chat event received");
    if (loggedInUserId && !newChat.isGroupChat) {
      const member = getOtherMemberOfPrivateChat(newChat, loggedInUserId);

      if (member) {
        dispatch(
          friendApi.util.updateQueryData("getFriends", undefined, (draft) => {
            const newFriend: Friend = {
              _id: member._id,
              avatar: member.avatar,
              createdAt: JSON.stringify(new Date()),
              isActive: true,
              username: member.username,
              lastSeen: member.lastSeen,
              publicKey: member.publicKey,
              verificationBadge: member.verificationBadge,
            };

            draft.push(newFriend);
          })
        );
      }
    }

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.push(newChat);
      })
    );
  });
};
