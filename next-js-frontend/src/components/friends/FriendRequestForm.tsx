import { useGetUserFriendRequestsQuery } from "@/lib/client/rtk-query/request.api";
import { useAcceptOrRejectFriendRequest } from "../../hooks/userRequest/useAcceptOrRejectFriendRequest";
import { FriendRequestList } from "./FriendRequestList";
import { FriendRequest } from "@/interfaces/request.interface";

const FriendRequestForm = () => {
  const { data: friendRequests } = useGetUserFriendRequestsQuery();
  const { handleFriendRequest } = useAcceptOrRejectFriendRequest();

  const friendRequestHandler = (
    requestId: FriendRequest["_id"],
    action: "accept" | "reject"
  ) => {
    handleFriendRequest({ requestId, action });
  };

  return (
    <div>
      {friendRequests ? (
        <FriendRequestList
          users={friendRequests}
          friendRequestHandler={friendRequestHandler}
        />
      ) : (
        <p>There are no friend requests</p>
      )}
    </div>
  );
};

export default FriendRequestForm;
