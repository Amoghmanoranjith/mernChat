import { useDeleteMessage } from "@/hooks/useMessages/useDeleteMessage"
import { selectLoggedInUser } from "@/services/redux/slices/authSlice"
import { useAppSelector } from "@/services/redux/store/hooks"
import { EmojiClickData } from "emoji-picker-react"
import { motion } from "framer-motion"
import { EmojiPickerForm } from "../emoji/EmojiPickerForm"
import { DeleteIcon } from "../ui/icons/DeleteIcon"
import { EditIcon } from "../ui/icons/EditIcon"
import { ContextMenuForm } from "../contextMenu/ContextMenuForm"


type PropTypes = {
    onEmojiClick:(e: EmojiClickData) => void | null
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    messageId:string
}

export const ContextMenu = ({setOpenContextMenuMessageId,setEditMessageId,onEmojiClick,messageId}:PropTypes)=>{
    
    const {deleteMessage} = useDeleteMessage();
    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id;

    const contextOptions = [
        {
            name:"Edit",
            icon:<EditIcon/>,
            handlerFunc:()=> {
                setOpenContextMenuMessageId(undefined)
                setEditMessageId(messageId)
            }
        },
        {
            name:"Unsend",
            icon:<DeleteIcon/>,
            handlerFunc:()=>deleteMessage({messageId})
        }
    ]
    
    const myMessage = loggedInUserId === messageId;

    return (
        <motion.div variants={{hide:{opacity:0},show:{opacity:1}}} initial='hide' animate="show" className={`flex flex-col gap-y-2 absolute ${myMessage?'right-0':"left-0"} z-10`}>
                
                {/* it is basically shows emojis for reacting to messages, when we right click on a message or tap and hold on it */}
                <div>
                    <EmojiPickerForm
                        onEmojiClick={onEmojiClick}
                        reactionsDefaultOpen={true}
                    />
                </div>
                
                {
                    myMessage && 
                    <div className={`flex flex-col bg-secondary-dark text-text p-2 rounded-2xl shadow-2xl min-w-32 self-end`}>
                        <ContextMenuForm contextOptions={contextOptions}/>
                    </div>
                }
                
        </motion.div>
    )
}
