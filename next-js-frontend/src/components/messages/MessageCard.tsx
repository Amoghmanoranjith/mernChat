import { useCloseReactionsMenuWhenZeroReactions } from '@/hooks/useMessages/useCloseReactionsMenuWhenZeroReactions';
import { useDoubleClickReactionFeature } from '@/hooks/useMessages/useDoubleClickReactionFeature';
import { useEmojiClickReactionFeature } from '@/hooks/useMessages/useEmojiClickReactionFeature';
import { useHandleOutsideClick } from '@/hooks/useUtils/useHandleOutsideClick';
import type { ChatWithUnreadMessages } from '@/interfaces/chat.interface';
import type { Message } from '@/interfaces/message.interface';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from "react";
import { ContextMenu } from "../shared/ContextMenu";
import { MessageReactionList } from './MessageReactionList';
import { MessageReactions } from './MessageReactions';
import { RenderAppropriateMessage } from "./RenderAppropriateMessage";

type PropTypes = {
    editMessageId: string | undefined,
    message: Message,
    loggedInUserId: string
    selectedChatDetails: ChatWithUnreadMessages,
    reactionMenuMessageId: string | undefined
    openContextMenuMessageId: string | undefined
    setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpenContextMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
    setReactionMenuMessageId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const MessageCard = ({ message, openContextMenuMessageId, reactionMenuMessageId, selectedChatDetails, loggedInUserId, editMessageId, setReactionMenuMessageId, setOpenContextMenuMessageId, setEditMessageId }: PropTypes) => {

    const reactionsRef = useRef<HTMLDivElement>(null)
    const contextMenuRef = useRef<HTMLDivElement>(null)

    useHandleOutsideClick(reactionsRef, () => setReactionMenuMessageId(undefined))
    useHandleOutsideClick(contextMenuRef, () => setOpenContextMenuMessageId(undefined))
    useCloseReactionsMenuWhenZeroReactions(message, setReactionMenuMessageId)

    const handleContextMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()
        setOpenContextMenuMessageId(openContextMenuMessageId ? undefined : message._id);
    }

    const {handleEmojiClick}=useEmojiClickReactionFeature({chatId: selectedChatDetails._id, loggedInUserId, messageId: message._id, message, setOpenContextMenuMessageId})
    const {handleDoubleClick}=useDoubleClickReactionFeature({ chatId: selectedChatDetails._id, loggedInUserId, messageId: message._id, reactions: message.reactions });



    const myMessage = message.sender._id === loggedInUserId;
    const isContextMenuOpen = openContextMenuMessageId === message._id;

    return (
        <motion.div initial={{ x: -2 }} animate={{ x: 0 }} className={`flex gap-x-2 ${myMessage ? "self-end" : ""} text-text relative `} onContextMenu={e => handleContextMenuClick(e)}>

            {
                isContextMenuOpen &&
                <ContextMenu
                    messageId={message._id}
                    setEditMessageId={setEditMessageId}
                    setOpenContextMenuMessageId={setOpenContextMenuMessageId}
                    onEmojiClick={handleEmojiClick}
                />
            }
            {
                !myMessage &&
                <Image
                    className="aspect-square object-cover w-12 self-end rounded-full max-lg:w-10 max-sm:w-8"
                    src={message.sender.avatar}
                    alt={`${message.sender.username}-profile-pic`}
                    width={100}
                    height={100}
                />
            }

            <div className='flex flex-col'>

                <motion.div whileTap={{ scale: 0.950 }} onDoubleClick={handleDoubleClick} className={`${myMessage ? "bg-primary text-white" : "bg-secondary-dark"} ${isContextMenuOpen ? "border-2 border-double border-spacing-4 border-" : null} max-w-96 min-w-10 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center max-md:max-w-80 max-sm:max-w-64`}>

                    <RenderAppropriateMessage
                        editMessageId={editMessageId}
                        loggedInUserId={loggedInUserId}
                        selectedChatDetails={selectedChatDetails}
                        message={message}
                        setEditMessageId={setEditMessageId}
                        setOpenContextMenuMessageId={setOpenContextMenuMessageId}
                    />

                    <div className='flex items-center ml-auto gap-x-1 flex-nowrap shrink-0'>
                        {
                            message?.isEdited &&
                            <p className="text-secondary font-medim text-sm max-sm:text-xs">Edited</p>
                        }
                        <p className={`text-xs ${myMessage ? 'text-gray-200' : "text-secondary-darker"}`}>{format(message.createdAt, 'h:mm a').toLowerCase()}</p>
                    </div>

                </motion.div>
                {
                    message?.reactions && message.reactions?.length > 0 &&
                    <MessageReactions message={message} setReactionMenuMessageId={setReactionMenuMessageId} />
                }
                {
                    reactionMenuMessageId === message._id && message.reactions?.length > 0 &&
                    <MessageReactionList loggedInUserId={loggedInUserId} message={message} selectedChatDetails={selectedChatDetails} />
                }
            </div>


        </motion.div>
    )
}
