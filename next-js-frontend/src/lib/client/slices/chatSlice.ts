import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BasicUserInfo, ChatMember } from "../../../interfaces/chat.interface";
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
    updateSelectedChatMembers: (state, action: PayloadAction<ChatMember[]>) => {
      if (
        state.selectedChatDetails &&
        state.selectedChatDetails.ChatMembers.length
      ) {
        for (const member of action.payload) {
          state.selectedChatDetails.ChatMembers.push({ user: member });
        }
      }
    },
    removeSelectedChatMembers: (
      state,
      action: PayloadAction<fetchUserChatsResponse["id"][]>
    ) => {
      if (
        state.selectedChatDetails &&
        state.selectedChatDetails.ChatMembers.length
      ) {
        state.selectedChatDetails.ChatMembers =
          state.selectedChatDetails.ChatMembers.filter(
            ({ user: { id } }) => !action.payload.includes(id)
          );
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
