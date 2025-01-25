import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Event } from "@/interfaces/events.interface";
import { Friend } from "@/interfaces/friends.interface";
import { chatApi } from "@/services/api/chat.api";
import { friendApi } from "@/services/api/friend.api";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { getOtherMemberOfPrivateChat } from "@/utils/helpers";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useNewGroupListener = () => {
  const dispatch = useAppDispatch();
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id;

  useSocketEvent(Event.NEW_GROUP, (newChat:ChatWithUnreadMessages) => {

    console.log(newChat);

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
        newChat.createdAt = JSON.stringify(newChat.createdAt);
        draft.push(newChat);
      })
    );

  });
};
