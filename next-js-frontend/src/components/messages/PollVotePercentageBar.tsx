import { PollOption } from "@/interfaces/message.interface";

type PropTypes = {
  option: PollOption;
  totalOptions: PollOption[];
};

export const PollVotePercentageBar = ({ option, totalOptions }: PropTypes) => {
  const calculateVotePercentage = () => {
    const percentage = (option.votes.length / totalOptions.length) * 100;
    return Math.round(percentage);
  };

  return (
    <div
      style={{ width: `${Math.min(calculateVotePercentage(), 100)}%` }}
      className={`h-2 bg-green-500 self-start transition-all rounded-2xl`}
    />
  );
};
