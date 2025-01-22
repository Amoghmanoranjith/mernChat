import { useCallInRejectListener } from "./useCallInRejectListener"
import { useCallInRequestListener } from "./useCallInRequestListener"
import { useCallOutListener } from "./useCallOutListener"
import { useCallInAcceptListener } from "./useCallinAcceptListener"
import { useDeleteChatListener } from "./useDeleteChatListener"
import { useDeleteReactionListener } from "./useDeleteReactionListener"
import { useFriendRequestListener } from "./useFriendRequestListener"
import { useGroupUpdateEventListener } from "./useGroupUpdateEventListener"
import { useJoinNewChatListener } from "./useJoinNewChatListener"
import { useMemberRemovedListener } from "./useMemberRemovedListener"
import { useMessageDeleteListener } from "./useMessageDeleteListener"
import { useMessageEditListener } from "./useMessageEditListener"
import { useMessageListener } from "./useUpdateUnreadMessagesAsSeenOnChatSelect"
import { useMessageSeenListener } from "./useMessageSeenListener"
import { useNewGroupListener } from "./useNewGroupListener"
import { useNewMemberAddedListener } from "./useNewMemberAddedListener"
import { useNewReactionListener } from "./useNewReactionListener"
import { useOfflineListener } from "./useOfflineListener"
import { useOnlineListener } from "./useOnlineListener"
import { useOnlineUsersListener } from "./useOnlineUsersListener"
import { useSpectatorJoinedListener } from "./useSpectatorJoinedListener"
import { useTypingListener } from "./useTypingListener"
import { useUnreadMessageListener } from "./useUnreadMessageListener"
import { useVoteInListener } from "./useVoteInListener"
import { useVoteOutListener } from "./useVoteOutListener"

export const useAttachListeners = () => {
    
    useFriendRequestListener()
    useMessageListener()
    useMessageSeenListener()
    useNewGroupListener()
    useUnreadMessageListener()
    useOfflineListener()
    useOnlineListener()
    useTypingListener()
    useNewMemberAddedListener()
    useMessageEditListener()
    useDeleteChatListener()
    useMemberRemovedListener()
    useVoteInListener()
    useVoteOutListener()
    useOnlineUsersListener()
    useCallInRequestListener()
    useCallInAcceptListener()
    useCallInRejectListener()
    useCallOutListener()
    useSpectatorJoinedListener()
    useMessageDeleteListener()
    useGroupUpdateEventListener()
    useJoinNewChatListener()
    useNewReactionListener()
    useDeleteReactionListener()
}
