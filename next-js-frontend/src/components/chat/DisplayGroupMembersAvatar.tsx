import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import Image from "next/image";

type PropTypes = {
  members: ChatWithUnreadMessages["members"];
};

export const DisplayGroupMembersAvatar = ({ members }: PropTypes) => {
  const top4Members = members.slice(0, 4);
  const remainingMembers = members.length - 4;

  return (
    <div className="flex items-center">
      {top4Members.map((member) => (
        <Image
          className="size-8 rounded-full object-cover shrink-0"
          key={member._id}
          src={member.avatar}
          width={100}
          height={100}
          alt={`${member.username} avatar`}
        />
      ))}
      {remainingMembers > 0 && (
        <p className="w-8 h-8 rounded-full bg-secondary-dark flex justify-center items-center">
          +{remainingMembers}
        </p>
      )}
    </div>
  );
};
