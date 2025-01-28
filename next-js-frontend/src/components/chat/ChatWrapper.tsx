"use client";

import { useCheckUserPrivateKeyInIndexedDB } from "@/hooks/useAuth/useCheckUserPrivateKeyInIndexedDB";
import { useUpdateUnreadMessagesAsSeenOnChatSelect } from "@/hooks/useChat/useUpdateUnreadChatAsSeen";
import { useClearExtraPreviousMessagesOnChatChange } from "@/hooks/useMessages/useClearExtraPreviousMessagesOnChatChange";
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

  // client side state hydration
  usePopulateStateWithServerSideFetchedData({chats,friendRequest,friends,user});

  // chats
  useUpdateUnreadMessagesAsSeenOnChatSelect();

  // all socket event listners
  useAttachEventListeners();

  // security
  useCheckUserPrivateKeyInIndexedDB({loggedInUser:user});

  // messages
  useClearExtraPreviousMessagesOnChatChange();


  return children;
};
