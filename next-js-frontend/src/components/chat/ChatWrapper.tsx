"use client";

import { useCheckUserPrivateKeyInIndexedDB } from "@/hooks/useAuth/useCheckUserPrivateKeyInIndexedDB";
import { useFetchAuthToken } from "@/hooks/useAuth/useFetchAuthToken";
import { useUpdateUnreadMessagesAsSeenOnChatSelect } from "@/hooks/useChat/useUpdateUnreadChatAsSeen";
import { useClearExtraPreviousMessagesOnChatChange } from "@/hooks/useMessages/useClearExtraPreviousMessagesOnChatChange";
import { useAttachEventListeners } from "@/hooks/useUtils/useAttachEventListeners";
import { usePopulateStateWithServerSideFetchedData } from "@/hooks/useUtils/usePopulateStateWithServerSideFetchedData";
import { fetchUserChatsResponse, fetchUserFriendRequestResponse, fetchUserFriendsResponse, FetchUserInfoResponse } from "@/lib/server/services/userService";


type PropTypes = {
  children: React.ReactNode;
  user: FetchUserInfoResponse;
  friends: fetchUserFriendsResponse[];
  chats: fetchUserChatsResponse[];
  friendRequest: fetchUserFriendRequestResponse[];
};

export const ChatWrapper = ({children,chats,friendRequest,friends,user}: PropTypes) => {

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

  // fetch the auth token and set in state
  // so that rtk query can this token to make requests to backend
  useFetchAuthToken();

  return children;
};
