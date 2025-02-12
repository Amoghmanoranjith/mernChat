import { friendApi } from "@/lib/client/rtk-query/friend.api";
import { requestApi } from "@/lib/client/rtk-query/request.api";
import { updateLoggedInUser } from "@/lib/client/slices/authSlice";
import { setChats } from "@/lib/client/slices/chatSlice";
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

  console.log('chat at hydrate client state hook level',chats);

  useEffect(() => {
    dispatch(updateLoggedInUser(user));
    dispatch(setChats(chats));
    dispatch(friendApi.util.upsertQueryData("getFriends", undefined, [...friends]));
    dispatch(requestApi.util.upsertQueryData("getUserFriendRequests", undefined, [...friendRequest])
    );
  }, [chats, dispatch, friendRequest, friends, user]);
};
