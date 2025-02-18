import { useIncomingCallListener } from "../useCalls/useIncomingCallListener";
import { useDeleteChatListener } from "../useEventListeners/useDeleteChatListener";
import { useDeleteReactionListener } from "../useEventListeners/useDeleteReactionListener";
import { useFriendRequestListener } from "../useEventListeners/useFriendRequestListener";
import { useGroupChatUpdateEventListener } from "../useEventListeners/useGroupChatUpdateEventListener";
import { useMemberRemovedListener } from "../useEventListeners/useMemberRemovedListener";
import { useMessageDeleteListener } from "../useEventListeners/useMessageDeleteListener";
import { useMessageEditListener } from "../useEventListeners/useMessageEditListener";
import { useMessageListener } from "../useEventListeners/useMessageListener";
import { useMessageSeenListener } from "../useEventListeners/useMessageSeenListener";
import { useNewChatListener } from "../useEventListeners/useNewChatListener";
import { useNewMemberAddedListener } from "../useEventListeners/useNewMemberAddedListener";
import { useNewReactionListener } from "../useEventListeners/useNewReactionListener";
import { useOfflineUserListener } from "../useEventListeners/useOfflineUserListener";
import { useOnlineUserListener } from "../useEventListeners/useOnlineUserListener";
import { useOnlineUsersListListener } from "../useEventListeners/useOnlineUsersListListener";
import { useTypingListener } from "../useEventListeners/useTypingListener";
import { useUnreadMessageListener } from "../useEventListeners/useUnreadMessageListener";
import { useVoteInListener } from "../useEventListeners/useVoteInListener";
import { useVoteOutListener } from "../useEventListeners/useVoteOutListener";

export const useAttachEventListeners = () => {

  // friend request
  useFriendRequestListener();

  // messages
  useMessageListener();
  useMessageSeenListener();
  useUnreadMessageListener();
  useMessageEditListener();
  useMessageDeleteListener();
  useTypingListener();

  
  // user status
  useOfflineUserListener();
  useOnlineUserListener();
  useOnlineUsersListListener();
  
  
  // polling
  useVoteInListener();
  useVoteOutListener();
  
  // chats
  useNewChatListener();
  useGroupChatUpdateEventListener();
  useNewMemberAddedListener();
  useMemberRemovedListener();
  useDeleteChatListener();

  // reactions
  useNewReactionListener();
  useDeleteReactionListener();

  // calls
  useIncomingCallListener();
};
