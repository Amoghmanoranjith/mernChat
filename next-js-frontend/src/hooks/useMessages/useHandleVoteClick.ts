import { PollOption } from "@/interfaces/message.interface";
import { haveUserVotedThisOption } from "@/lib/shared/helpers";
import { useVoteIn } from "./useVoteIn";
import { useVoteOut } from "./useVoteOut";

type PropTypes = {
  messageId: string;
  loggedInUserId: string;
  isMultipleAnswers: boolean;
  index: number;
  option: PollOption;
  totalOptions: PollOption[];
};

export const useHandleVoteClick = ({
  index,
  isMultipleAnswers,
  loggedInUserId,
  messageId,
  option,
  totalOptions,
}: PropTypes) => {
  const { handleVoteIn } = useVoteIn();
  const { handleVoteOut } = useVoteOut();

  const voted = haveUserVotedThisOption(option, loggedInUserId);

  const handleVoteClick = () => {
    if (voted) {
      // if already voted then clicking it again means voting out
      handleVoteOut({ messageId, optionIndex: index });
    } else {
      // if not voted already, then it means voting for the first time
      // but there exists two cases
      // 1. single answer poll
      // 2. multiple answer poll

      // if multiple answer poll, then we can directly vote in to the current option

      if (!isMultipleAnswers) {
        // if single answer poll, then we need to check if user has voted any option or not
        // if yes, then we need to find that option and vote out from that option and vote in to the current option

        // in this loop
        // we are checking every option for the user's vote
        // and if we find any then we vote out from that option
        for (let i = 0; i < totalOptions.length; i++) {
          const currentOption = totalOptions[i];
          const previousVoteIndex = currentOption.votes.findIndex(
            (vote) => vote._id === loggedInUserId
          );
          if (previousVoteIndex !== -1) {
            handleVoteOut({ messageId, optionIndex: i });
            break;
          }
        }
      }
      // and vote in remains the same for both cases
      handleVoteIn({ messageId, optionIndex: index });
    }
  };

  return { handleVoteClick };
};
