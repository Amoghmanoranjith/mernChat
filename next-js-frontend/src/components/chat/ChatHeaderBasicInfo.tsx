export const ChatHeaderBasicInfo = () => {
  return (
    <div className="flex items-center gap-x-1">
      <h4 className="font-medium text-4xl max-sm:text-2xl">
        {displayChatName}
      </h4>
      {displayVerfiicationBadgeOnNonGroupChatsIfOtherPersonHaveIt()}
    </div>
  );
};
