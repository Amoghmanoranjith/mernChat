import { FetchUserInfoResponse } from "@/lib/server/services/userService";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type InitialState = {
  loggedInUser: FetchUserInfoResponse | null;
};

const initialState: InitialState = {
  loggedInUser: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    updateLoggedInUser: (
      state,
      action: PayloadAction<FetchUserInfoResponse | null>
    ) => {
      state.loggedInUser = action.payload;
    },
    updateLoggedInUserPublicKey: (
      state,
      action: PayloadAction<Required<Pick<FetchUserInfoResponse, "publicKey">>>
    ) => {
      if (state.loggedInUser)
        state.loggedInUser.publicKey = action.payload.publicKey;
    },
    updateLoggedInUserNotificationStatus: (
      state,
      action: PayloadAction<boolean>
    ) => {
      if (state.loggedInUser)
        state.loggedInUser.notificationsEnabled = action.payload;
    },
    // updateLoggedInUserFcmTokenStatus:(state,action:PayloadAction<string>)=>{
    //     if(state.loggedInUser)
    //         state.loggedInUser.fcmtoke = action.payload
    // },
  },
});

export const selectLoggedInUser = (state: RootState) =>
  state.authSlice.loggedInUser;

export const {
  updateLoggedInUser,
  updateLoggedInUserPublicKey,
  updateLoggedInUserNotificationStatus,
  // updateLoggedInUserFcmTokenStatus,
} = authSlice.actions;

export default authSlice;
