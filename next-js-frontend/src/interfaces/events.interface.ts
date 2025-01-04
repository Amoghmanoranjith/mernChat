export type Event =
  | "MESSAGE"
  | "JOIN_NEW_CHAT"
  | "NEW_GROUP"
  | "MESSAGE_SEEN"
  | "MESSAGE_DELETE"
  | "GROUP_UPDATE"
  | "USER_TYPING"
  | "UNREAD_MESSAGE"
  | "NEW_FRIEND_REQUEST"
  | "NEW_MEMBER_ADDED"
  | "ONLINE"
  | "OFFLINE"
  | "MESSAGE_EDIT"
  | "DELETE_CHAT"
  | "MEMBER_REMOVED"
  | "VOTE_IN"
  | "VOTE_OUT"
  | "ONLINE_USERS"
  | "CALL_IN_REQUEST"
  | "CALL_IN_ACCEPT"
  | "CALL_IN_REJECT"
  | "CALL_OUT"
  | "SPECTATOR_JOINED"
  | "NEW_REACTION"
  | "DELETE_REACTION";
