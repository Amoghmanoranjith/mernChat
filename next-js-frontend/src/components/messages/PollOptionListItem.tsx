import { PollOption } from "@/interfaces/message.interface";
import { Display2RecentVotesAndRemaningVotesCount } from "./Display2RecentVotesAndRemaningVotesCount";
import { PollButton } from "./PollButton";
import { PollVotePercentageBar } from "./PollVotePercentageBar";

type PropTypes = {
  index: number;
  option: PollOption;
  totalOptions: PollOption[];
  messageId: string;
  loggedInUserId: string;
  isMutipleAnswers: boolean;
};

export const PollOptionListItem = ({
  option,
  isMutipleAnswers,
  index,
  messageId,
  loggedInUserId,
  totalOptions,
}: PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2 justify-center">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-2">
          <PollButton
            index={index}
            isMultipleAnswers={isMutipleAnswers}
            loggedInUserId={loggedInUserId}
            messageId={messageId}
            option={option}
            totalOptions={totalOptions}
          />
          <p className="break-words">{option.option}</p>
        </div>
        <Display2RecentVotesAndRemaningVotesCount option={option} />
      </div>
      <PollVotePercentageBar totalOptions={totalOptions} option={option} />
    </div>
  );
};
