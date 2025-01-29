import { ChatWithUnreadMessages } from "@/interfaces/chat.interface"
import Image from "next/image"

type PropTypes = {
    members:ChatWithUnreadMessages['seenBy']
}

export const SeenByList = ({members}:PropTypes) => {
  return (
    <div className="flex item-center flex-wrap self-end gap-x-1">
      {
        members.map(member=>(
          <Image 
            key={member._id}
            src={member.avatar} 
            height={100} 
            width={100}
            className="size-7" 
            alt={member.username}
           />
        ))
      }
    </div>
  )
}
