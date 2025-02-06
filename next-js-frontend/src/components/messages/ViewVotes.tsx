import Image from "next/image";
import { selectVotesData } from "../../lib/client/slices/uiSlice";
import { useAppSelector } from "../../lib/client/store/hooks";

const ViewVotes = () => {
  const votesData = useAppSelector(selectVotesData);

  return (
    <div className="flex flex-col gap-y-8 select-none">
      <h6 className="font-medium text-xl">{votesData?.pollQuestion}</h6>

      <div className="flex flex-col gap-y-6">
        {votesData?.pollOptions?.map(({ option, votes }, index) => (
          <div key={index} className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <div className="flex justify-between">
                <p className="text-base">{option.toString()}</p>
                <p>
                  {votes.length
                    ? votes.length === 1
                      ? "1 vote"
                      : `${votes.length} Votes`
                    : "No votes"}
                </p>
              </div>
              <div className="w-full h-[1px] bg-secondary-darker" />
            </div>

            <div className="flex flex-col gap-y-4 max-h-32 overflow-y-scroll">
              {votes.map(({ _id, avatar, username }) => (
                <div key={_id} className="flex gap-x-2 items-center">
                  <Image
                    width={100}
                    height={100}
                    className="size-6 rounded-full object-cover shrink-0"
                    src={avatar}
                    alt={"user-picture"}
                  />
                  <p>{username}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewVotes;
