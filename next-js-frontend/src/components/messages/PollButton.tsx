import { useHandleVoteClick } from "@/hooks/useMessages/useHandleVoteClick";
import { PollOption } from "@/interfaces/message.interface";
import { haveUserVotedThisOption } from "@/utils/helpers";
import { motion } from "framer-motion";
import { DefaultPollOptionDot } from "../ui/DefaultPollOptionDot";
import { FilledGreenDot } from "../ui/FilledGreenDot";

type PropTypes = {
  option: PollOption;
  messageId: string;
  loggedInUserId: string;
  isMultipleAnswers: boolean;
  index: number;
  totalOptions: PollOption[];
};

export const PollButton = ({
  option,
  messageId,
  loggedInUserId,
  isMultipleAnswers,
  index,
  totalOptions,
}: PropTypes) => {
  const voted = haveUserVotedThisOption(option, loggedInUserId);

  const { handleVoteClick } = useHandleVoteClick({
    index,
    isMultipleAnswers,
    loggedInUserId,
    messageId,
    option,
    totalOptions,
  });

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleVoteClick}
    >
      {voted ? <FilledGreenDot /> : <DefaultPollOptionDot />}
    </motion.button>
  );
};
