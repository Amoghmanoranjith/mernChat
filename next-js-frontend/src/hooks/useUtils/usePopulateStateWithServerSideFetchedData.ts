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
  chats: ChatWithUnreadMessages[];
  friends: Friend[];
  friendRequest: FriendRequest[];
  user: User;
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
    dispatch(
      friendApi.util.upsertQueryData("getFriends", undefined, [...friends])
    );
    dispatch(
      requestApi.util.upsertQueryData("getUserFriendRequests", undefined, [
        ...friendRequest,
      ])
    );
  }, []);
};
