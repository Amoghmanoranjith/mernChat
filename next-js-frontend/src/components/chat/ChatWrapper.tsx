"use client";

import { useFetchInitialMessagesOnChatSelect } from "@/hooks/useMessages/useFetchInitialMessagesOnChatSelect";
import { User } from "@/interfaces/auth.interface";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Friend } from "@/interfaces/friends.interface";
import { FriendRequest } from "@/interfaces/request.interface";
import { chatApi } from "@/services/api/chat.api";
import { friendApi } from "@/services/api/friend.api";
import { requestApi } from "@/services/api/request.api";
import { updateLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppDispatch } from "@/services/redux/store/hooks";
import { useEffect } from "react";

type PropTypes = {
  children: React.ReactNode;
  user: User;
  friends: Friend[];
  chats: ChatWithUnreadMessages[];
  friendRequest: FriendRequest[];
};

export const ChatWrapper = ({
  children,
  chats,
  friendRequest,
  friends,
  user,
}: PropTypes) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateLoggedInUser(user));
    dispatch(chatApi.util.upsertQueryData("getChats", undefined, [...chats]));
    dispatch(
      friendApi.util.upsertQueryData("getFriends", undefined, [...friends])
    );
    dispatch(
      requestApi.util.upsertQueryData("getUserFriendRequests", undefined, [
        ...friendRequest,
      ])
    );
  }, []);

  useFetchInitialMessagesOnChatSelect();
  return children;
};
