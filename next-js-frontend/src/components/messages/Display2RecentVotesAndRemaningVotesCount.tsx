import { PollOption } from "@/interfaces/message.interface";
import { motion } from "framer-motion";
import Image from "next/image";

type PropTypes = {
  option: PollOption;
};

export const Display2RecentVotesAndRemaningVotesCount = ({
  option,
}: PropTypes) => {
  const remaningVotes = option.votes.length - 2;

  return (
    <div className="flex items-center">
      {option.votes.slice(0, 2).map(({ avatar, _id, username }) => (
        <motion.span
          key={_id}
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Image src={avatar} width={6} height={6} alt={username} />
        </motion.span>
      ))}
      {remaningVotes > 0 && (
        <p className="w-8 h-8 rounded-full bg-secondary flex justify-center items-center">
          +{remaningVotes}
        </p>
      )}
    </div>
  );
};
