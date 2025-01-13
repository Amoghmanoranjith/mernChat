import { Message } from "@/interfaces/message.interface";
import { PollOptionListItem } from "./PollOptionListItem";

type PropTypes = {
  options: Message["pollOptions"];
  messageId: string;
  loggedInUserId: string;
  isMutipleAnswers: boolean;
};

export const PollOptionList = ({
  options,
  isMutipleAnswers,
  messageId,
  loggedInUserId,
}: PropTypes) => {
  return (
    <div className="flex flex-col gap-y-3">
      {options?.map((option, index) => (
        <PollOptionListItem
          isMutipleAnswers={isMutipleAnswers}
          totalOptions={options}
          loggedInUserId={loggedInUserId}
          key={index}
          index={index}
          option={option}
          messageId={messageId}
        />
      ))}
    </div>
  );
};
