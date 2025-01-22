import { ChatMember } from "@/interfaces/chat.interface"
import Image from "next/image"

type PropTypes = {
    isMemberAlready:boolean
    selectable:boolean
    member:ChatMember
    isSelected?:boolean
    toggleSelection:(memberId: string) => void
}

export const MemberCard = ({member,isSelected=false,isMemberAlready,selectable,toggleSelection}:PropTypes) => {
  return (
    <div onClick={()=>isMemberAlready?"":selectable?toggleSelection(member._id):""} className={`flex justify-between rounded-md cursor-pointer ${isSelected?"bg-primary hover:bg-primary-dark":'hover:bg-secondary-darker'} p-2 shadow-sm`}>
        
        <div className="flex gap-x-2 items-center">
          <Image src={member.avatar} height={100} width={100} className="size-7" alt={member.username}/>
          <p>{member.username}</p>
        </div>
        
        {
          isMemberAlready && 
          <p>Member</p>
        }
    </div>
  )
}
