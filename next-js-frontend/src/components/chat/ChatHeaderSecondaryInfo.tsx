export const ChatHeaderSecondaryInfo = () => {
  return (
    <div className="flex items-center gap-x-2">
      {ifNonGroupChatAndOtherPersonIsNotActiveThenShowLastSeen()}
      {ifGroupChatShowTotalMembers()}
      {renderOnlineStatus()}
    </div>
  );
};
