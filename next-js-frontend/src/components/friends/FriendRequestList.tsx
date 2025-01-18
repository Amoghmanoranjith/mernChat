import { FriendRequest } from "@/interfaces/request.interface"
import { FriendRequestItem } from "./FriendRequestItem";

type PropTypes = {
    users:FriendRequest[];
    friendRequestHandler:(requestId: FriendRequest['_id'], action: "accept" | "reject") => void
}
export const FriendRequestList = ({users,friendRequestHandler}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map(user=>(
                <FriendRequestItem key={user._id} user={user} friendRequestHandler={friendRequestHandler} />
            ))
        }
    </div>
  )
}
