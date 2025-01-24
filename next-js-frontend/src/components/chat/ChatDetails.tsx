'use client';
import { useFetchAttachments } from "@/hooks/useAttachment/useFetchAttachments";
import { useToggleChatDetailsBar } from "@/hooks/useUI/useToggleChatDetailsBar";
import { User } from "@/interfaces/auth.interface";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { ChevronRightIcon } from "../ui/icons/ChevronRightIcon";
import { AddMemberSection } from "./AddMemberSection";
import { ChatDetailsHeader } from "./ChatDetailsHeader";
import { DisplayGroupMembersAvatar } from "./DisplayGroupMembersAvatar";
import { RemoveMemberSection } from "./RemoveMemberSection";
import { SharedMedia } from "./SharedMedia";


type PropTypes = {
    selectedChatDetails:ChatWithUnreadMessages
    loggedInUser:User
}

export const ChatDetails = ({selectedChatDetails,loggedInUser}:PropTypes) => {

  const {toggleChatDetailsBar} = useToggleChatDetailsBar();
  const {sharedMedia} = useFetchAttachments()

  const isAdmin = selectedChatDetails.isGroupChat && selectedChatDetails.admin === loggedInUser._id;
  const isGroupChat = selectedChatDetails.isGroupChat;

  return (
    
    <div className="flex flex-col justify-center items-center gap-y-7 text-text relative">
        
        <button onClick={toggleChatDetailsBar} className="absolute left-0 top-1 hidden max-2xl:block">
          <ChevronRightIcon/>
        </button>

        <div className="flex flex-col gap-y-4 items-center">
            <ChatDetailsHeader
              chat={selectedChatDetails}
              loggedInUser={loggedInUser}
            />
        </div>

        <div className="flex flex-col gap-y-6 w-full">
            
            <div className="flex flex-col gap-y-4">
                <div className="flex justify-between items-center">
                    <DisplayGroupMembersAvatar members={selectedChatDetails.members}/>
                    {isGroupChat && <span>See all</span>}
                </div>
                {
                  isGroupChat && isAdmin && 
                  <>
                  <AddMemberSection/>
                  <RemoveMemberSection/>
                  </>
                }
            </div>

            <SharedMedia
              attachments={sharedMedia?.attachments}
              selectedChatId={selectedChatDetails._id}
            /> 
                       
        </div>

    </div>
  )
}
