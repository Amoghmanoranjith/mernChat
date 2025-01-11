import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { TypingIndicatorAnimation } from "../ui/TypingIndicatorAnimation";
import { TypingUserList } from "./TypingUserList";

type PropTypes = {
  users: ChatWithUnreadMessages["userTyping"];
  isGroupChat: boolean;
};

export const TypingIndicatorWithUserList = ({
  users,
  isGroupChat,
}: PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3 self-start">
      {users.length > 0 && (
        <div className="w-24 max-xl:w-20">
          <TypingIndicatorAnimation />
        </div>
      )}
      {isGroupChat && <TypingUserList users={users} />}
    </div>
  );
};
