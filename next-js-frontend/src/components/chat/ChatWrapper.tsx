"use client";

import { useUpdateUnreadChatAsSeen } from "@/hooks/useChat/useUpdateUnreadChatAsSeen";
import { useAttachEventListeners } from "@/hooks/useUtils/useAttachEventListeners";
import { usePopulateStateWithServerSideFetchedData } from "@/hooks/useUtils/usePopulateStateWithServerSideFetchedData";
import { User } from "@/interfaces/auth.interface";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Friend } from "@/interfaces/friends.interface";
import { FriendRequest } from "@/interfaces/request.interface";

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

  usePopulateStateWithServerSideFetchedData({chats,friendRequest,friends,user});
  useUpdateUnreadChatAsSeen();
  useAttachEventListeners();


  return children;
};
