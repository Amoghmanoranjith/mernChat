import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { friendApi } from "@/lib/client/rtk-query/friend.api";
import { requestApi } from "@/lib/client/rtk-query/request.api";
import { updateLoggedInUser } from "@/lib/client/slices/authSlice";
import { useAppDispatch } from "@/lib/client/store/hooks";
import {
  fetchUserChatsResponse,
  fetchUserFriendRequestResponse,
  fetchUserFriendsResponse,
  FetchUserInfoResponse,
} from "@/lib/server/services/userService";
import { useEffect } from "react";

type PropTypes = {
  chats: fetchUserChatsResponse[];
  friends: fetchUserFriendsResponse[];
  friendRequest: fetchUserFriendRequestResponse[];
  user: FetchUserInfoResponse;
};

export const usePopulateStateWithServerSideFetchedData = ({
  chats,
  friendRequest,
  friends,
  user,
}: PropTypes) => {
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateLoggedInUser(user));
    dispatch(chatApi.util.upsertQueryData("getChats", undefined, [...chats]));
    dispatch(friendApi.util.upsertQueryData("getFriends", undefined, [...friends]));
    dispatch(requestApi.util.upsertQueryData("getUserFriendRequests", undefined, [...friendRequest])
    );
  }, [chats, dispatch, friendRequest, friends, user]);
};
