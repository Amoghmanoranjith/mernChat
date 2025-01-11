import { useDeleteReaction } from "@/hooks/useMessages/useDeleteReaction";
import { ChatMember } from "@/interfaces/chat.interface";
import Image from "next/image";

type PropTypes = {
    reaction: {
        user: Pick<ChatMember, "_id" | "username" | "avatar">;
        emoji: string;
    };
    loggedInUserId: string;
    chatId: string;
    messageId: string;
};

export const MessageReactionListItem = ({
    reaction,
    loggedInUserId,
    chatId,
    messageId,
}: PropTypes) => {
    const myReaction = reaction.user._id === loggedInUserId;
    const { deleteReaction } = useDeleteReaction();
    const handleReactionClick = () => {
        if (reaction.user._id === loggedInUserId) {
            deleteReaction({ chatId, messageId });
        }
    };

    return (
        <div
            onClick={handleReactionClick}
            key={reaction.user?._id}
            className={`flex items-center justify-between ${myReaction ? "cursor-pointer" : ""
                }`}
        >
            <div className="flex items-center gap-x-3">
                <Image
                    className="rounded-full size-10"
                    src={reaction?.user?.avatar}
                    alt={reaction?.user?.username}
                />
                <div className="flex flex-col">
                    <p>{reaction.user?.username}</p>
                    {myReaction && <p className="text-sm">Tap to remove</p>}
                </div>
            </div>
            <span className="text-xl">{reaction.emoji}</span>
        </div>
    );
};
