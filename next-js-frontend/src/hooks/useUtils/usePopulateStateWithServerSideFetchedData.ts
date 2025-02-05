import { fetchUserChatsResponse, fetchUserFriendRequestResponse, fetchUserFriendsResponse, FetchUserInfoResponse } from "@/lib/server/services/userService";
import { chatApi } from "@/services/api/chat.api";
import { friendApi } from "@/services/api/friend.api";
import { requestApi } from "@/services/api/request.api";
import { updateLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppDispatch } from "@/services/redux/store/hooks";
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
    dispatch(requestApi.util.upsertQueryData("getUserFriendRequests", undefined, [...friendRequest]));
  }, [chats, dispatch, friendRequest, friends, user]);
};
