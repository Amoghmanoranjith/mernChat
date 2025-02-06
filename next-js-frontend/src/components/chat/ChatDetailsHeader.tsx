import { DEFAULT_AVATAR } from "@/constants";
import { User } from "@/interfaces/auth.interface";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { getChatAvatar, getChatName } from "@/lib/shared/helpers";
import Image from "next/image";
import { useToggleChatUpdateForm } from "../../hooks/useUI/useToggleChatUpdateForm";
import { EndToEndEncryptedText } from "../ui/EndToEndEncryptedText";
import { EditIcon } from "../ui/icons/EditIcon";

type PropTypes = {
  chat: ChatWithUnreadMessages;
  loggedInUser: User;
};

export const ChatDetailsHeader = ({ chat, loggedInUser }: PropTypes) => {
  const toggleChatUpdateForm = useToggleChatUpdateForm();

  const isAdmin = chat.isGroupChat && chat.admin === loggedInUser._id;
  const avatar = getChatAvatar(chat, loggedInUser._id);
  const chatName = getChatName(chat, loggedInUser._id);

  return (
    <>
      <div className="flex items-center gap-x-2">
        <h5 className="font-medium text-xl text-fluid-h5">Chat Details</h5>
        {isAdmin && (
          <button onClick={toggleChatUpdateForm}>
            <EditIcon />
          </button>
        )}
      </div>

      <div className="relative">
        <Image
          alt="chat avatar"
          className="size-20 object-cover rounded-full"
          src={avatar || DEFAULT_AVATAR}
          width={100}
          height={100}
        />
      </div>

      <div className="flex flex-col justify-center items-center">
        <h4 className="text-lg font-medium">{chatName}</h4>
        {chat.isGroupChat && (
          <p className="text-secondary-darker">{chat.members.length} members</p>
        )}
        {!chat.isGroupChat && <EndToEndEncryptedText />}
      </div>
    </>
  );
};
