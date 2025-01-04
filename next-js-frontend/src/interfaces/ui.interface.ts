import { Message } from "./message.interface";

// it tracks the UI state of the application
// for example, if the user is in dark mode or not
// or if the user has opened the new group chat form or not

export interface UIState {
  isDarkMode: boolean;
  navMenu: boolean;
  newgroupChatForm: boolean;
  addMemberForm: boolean;
  addFriendForm: boolean;
  friendRequestForm: boolean;
  profileForm: boolean;
  removeMemberForm: boolean;
  gifForm: boolean;
  attachments: Array<string>;
  chatBar: boolean;
  chatDetailsBar: boolean;
  pollForm: boolean;
  viewVotes: boolean;
  votesData: Pick<Message, "pollQuestion" | "pollOptions"> | null;
  chatUpdateForm: boolean;
  activeJoinedChat: string | null;
  recoverPrivateKeyForm: boolean;
  settingsForm: boolean;
  notificationPermissionForm: boolean;
}
