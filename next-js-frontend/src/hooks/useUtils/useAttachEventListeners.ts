import { useDeleteChatListener } from "../useEventListeners/useDeleteChatListener";
import { useDeleteReactionListener } from "../useEventListeners/useDeleteReactionListener";
import { useFriendRequestListener } from "../useEventListeners/useFriendRequestListener";
import { useGroupUpdateEventListener } from "../useEventListeners/useGroupUpdateEventListener";
import { useMemberRemovedListener } from "../useEventListeners/useMemberRemovedListener";
import { useMessageDeleteListener } from "../useEventListeners/useMessageDeleteListener";
import { useMessageEditListener } from "../useEventListeners/useMessageEditListener";
import { useMessageListener } from "../useEventListeners/useMessageListener";
import { useMessageSeenListener } from "../useEventListeners/useMessageSeenListener";
import { useNewChatListener } from "../useEventListeners/useNewChatListener";
import { useNewMemberAddedListener } from "../useEventListeners/useNewMemberAddedListener";
import { useNewReactionListener } from "../useEventListeners/useNewReactionListener";
import { useOfflineListener } from "../useEventListeners/useOfflineListener";
import { useOnlineListener } from "../useEventListeners/useOnlineListener";
import { useOnlineUsersListener } from "../useEventListeners/useOnlineUsersListener";
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
  useOfflineListener();
  useOnlineListener();
  useOnlineUsersListener();
  
  
  // polling
  useVoteInListener();
  useVoteOutListener();
  
  // chats
  useNewChatListener();
  useGroupUpdateEventListener();
  useNewMemberAddedListener();
  useMemberRemovedListener();
  useDeleteChatListener();

  // reactions
  useNewReactionListener();
  useDeleteReactionListener();
  
};
