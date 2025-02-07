import { useViewVotesClick } from "@/hooks/useMessages/useViewVotesClick";
import { User } from "@/interfaces/auth.interface";
import { Message } from "@/interfaces/message.interface";
import { selectLoggedInUser } from "../../lib/client/slices/authSlice";
import { useAppSelector } from "../../lib/client/store/hooks";
import { PollOptionList } from "./PollOptionList";

type PropTypes = {
  messageId: string;
  question: string;
  options: Message["pollOptions"];
  isMutipleAnswers: boolean;
};

export const PollCard = ({
  question,
  options,
  isMutipleAnswers,
  messageId,
}: PropTypes) => {
  const loggedInUser = useAppSelector(selectLoggedInUser) as User;
  const { handleViewVotesClick } = useViewVotesClick({
    pollQuestion: question,
    pollOptions: options,
  });

  return (
    <div className="flex flex-col gap-y-4 min-w-56">
      <h6 className="text-lg font-medium">{question}</h6>
      <PollOptionList
        isMutipleAnswers={isMutipleAnswers}
        loggedInUserId={loggedInUser.id}
        messageId={messageId}
        options={options}
      />
      <button onClick={handleViewVotesClick} className="text-center">
        View votes
      </button>
    </div>
  );
};
