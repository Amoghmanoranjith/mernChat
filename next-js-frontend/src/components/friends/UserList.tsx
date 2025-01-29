import { Friend } from "@/interfaces/friends.interface"
import { UserItem } from "./UserItem"
import { User } from "@/interfaces/auth.interface"

type PropTypes = {
    users:Array<Pick<User , "_id" | 'name' | "username" | 'avatar'>>
    friends:Friend[]
    loggedInUserId: string
    sendFriendRequest:(receiverId:string)=>void
}
export const UserList = ({users,friends,loggedInUserId,sendFriendRequest}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
        {
            users.map((user,index)=>(
                <UserItem 
                  key={index} 
                  user={user} 
                  loggedInUserId={loggedInUserId}
                  isFriendAlready={friends.some(friend=>friend._id===user._id)}
                  sendFriendRequest={sendFriendRequest} 
                />
            ))
        }
    </div>
  )
}
