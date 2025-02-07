import { Friend } from "@/interfaces/friends.interface"
import { fetchUserChatsResponse } from "@/lib/server/services/userService"
import { ChatMembers } from "@prisma/client"
import { MemberCard } from "./MemberCard"

type PropTypes = {
    selectable:boolean
    existingMembers?:fetchUserChatsResponse['ChatMembers'] | []
    members:ChatMembers[] | Friend[]
    selectedMembers:Array<string>
    toggleSelection: (memberId: string) => void
}

export const MemberList = ({members,selectedMembers,selectable,existingMembers,toggleSelection}:PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
        {
            members.map(member=>(
                <MemberCard
                  isMemberAlready={existingMembers?existingMembers?.map(member=>member.user.id).includes(member):false}
                  selectable={selectable}
                  key={member}
                  member={member}
                  isSelected={selectedMembers.includes(member.user)}
                  toggleSelection={toggleSelection}
                />
            ))
        }        
    </div>
  )
}
