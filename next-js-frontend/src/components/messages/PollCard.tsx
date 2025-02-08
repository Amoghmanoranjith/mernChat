import { useViewVotesClick } from "@/hooks/useMessages/useViewVotesClick";
import { Message } from "@/interfaces/message.interface";
import { PollOptionList } from "./PollOptionList";

type PropTypes = {
  pollData: NonNullable<Message["poll"]>;
  messageId:string
};

export const PollCard = ({ pollData, messageId}: PropTypes) => {

  // [optionIndex]:[votes[]]
  // i.e [optionIndex] : [{id,username,avatar},{id,username,avatar}...]
  const optionIndexToVotesMap:Record<number,{id:string,username:string,avatar:string}[]> = {};
  pollData?.votes?.forEach(({user,optionIndex})=>{
    if(optionIndexToVotesMap[optionIndex]){
      optionIndexToVotesMap[optionIndex].push(user)
    }
    else{
      optionIndexToVotesMap[optionIndex] = [user]
    }
  });

  const { handleViewVotesClick } = useViewVotesClick({optionIndexToVotesMap,options:pollData.options});

  return (
    <div className="flex flex-col gap-y-4 min-w-56">
      <h6 className="text-lg font-medium">{pollData.question}</h6>
      <PollOptionList
        messageId={messageId}
        options={pollData.options}
        isMultipleAnswers={pollData.multipleAnswers}
        optionIndexToVotesMap={optionIndexToVotesMap}
      />
      <span className="bg-white w-full h-[1px]"/>
      <button onClick={e=>{e.preventDefault(); e.stopPropagation(); handleViewVotesClick()}} className="text-center">
        View votes
      </button>
    </div>
  );
};
