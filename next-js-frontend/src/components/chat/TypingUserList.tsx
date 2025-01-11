import { ChatWithUnreadMessages } from "@/interfaces/chat.interface"
import { TypingCard } from "../ui/TypingCard"

type PropTypes = {
    users:ChatWithUnreadMessages['userTyping']
}

export const TypingUserList = ({users}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
        {
            users.map(user=>(
              <TypingCard key={user._id} avatar={user.avatar} username={user.username}/>
            ))
        }
    </div>
  )
}
