type PropTypes = {
  optionIndex:number;
  totalOptions: number;
  optionIndexToVotesMap: Record<number, {
    id: string;
    username: string;
    avatar: string;
}[]>
};

export const PollVotePercentageBar = ({optionIndex,totalOptions,optionIndexToVotesMap}: PropTypes) => {

  const votesInThisOption = optionIndexToVotesMap[optionIndex]?.length;

  const calculateVotePercentage = () => {
    const percentage = (votesInThisOption/totalOptions) * 100;
    return Math.round(percentage);
  };

  return (
    <div
      style={{ width: `${Math.min(calculateVotePercentage(), 100)}%` }}
      className={`h-2 bg-green-500 self-start transition-all rounded-2xl`}
    />
  );
};
