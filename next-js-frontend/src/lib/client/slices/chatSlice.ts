import { BasicUserInfo, fetchUserChatsResponse } from "@/lib/server/services/userService";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type InitialState = {
  selectedChatDetails: fetchUserChatsResponse | null;
};

const initialState: InitialState = {
  selectedChatDetails: null,
};

const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: {
    updateSelectedChatDetails: (
      state,
      action: PayloadAction<fetchUserChatsResponse | null>
    ) => {
      state.selectedChatDetails = action.payload;
    },
    updateUserTyping: (state, action: PayloadAction<BasicUserInfo>) => {
      state.selectedChatDetails?.typingUsers.push(action.payload);
    },
    removeUserTyping: (
      state,
      action: PayloadAction<fetchUserChatsResponse["id"]>
    ) => {
      if (state.selectedChatDetails?.typingUsers.length) {
        state.selectedChatDetails.typingUsers =
          state.selectedChatDetails.typingUsers.filter(
            ({ id }) => id !== action.payload
          );
      }
    },
    updateSelectedChatMembers: (state, action: PayloadAction<{
      user: {
        id: string;
        username: string;
        avatar: string;
        isOnline: boolean;
        publicKey: string | null;
        lastSeen: Date | null;
        verificationBadge: boolean;
      };
      }[]>
    ) => {
      if (state.selectedChatDetails && state.selectedChatDetails.ChatMembers.length) {
        state.selectedChatDetails.ChatMembers.push(...action.payload);
      }
    },
    removeSelectedChatMembers: (state,action: PayloadAction<string[]>) => {
      if (state.selectedChatDetails && state.selectedChatDetails.ChatMembers.length) {
        state.selectedChatDetails.ChatMembers = state.selectedChatDetails.ChatMembers.filter(member => !action.payload.includes(member.user.id));
      }
    },
    updateChatNameOrAvatar: (
      state,
      action: PayloadAction<
        Partial<Pick<fetchUserChatsResponse, "avatar" | "name">>
      >
    ) => {
      if (state.selectedChatDetails) {
        const { name, avatar } = action.payload;
        if (name) state.selectedChatDetails.name = name;
        if (avatar) state.selectedChatDetails.avatar = avatar;
      }
    },
  },
});

// exporting selector
export const selectSelectedChatDetails = (state: RootState) =>
  state.chatSlice.selectedChatDetails;

// exporting actions
export const {
  updateSelectedChatDetails,
  updateUserTyping,
  removeUserTyping,
  updateSelectedChatMembers,
  removeSelectedChatMembers,
  updateChatNameOrAvatar,
} = chatSlice.actions;

export default chatSlice;
