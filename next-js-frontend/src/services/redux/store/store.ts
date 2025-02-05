import { configureStore } from "@reduxjs/toolkit";
import { attachmentApi } from "@/services/api/attachment.api";
import { authApi } from "@/services/api/auth.api";
import { chatApi } from "@/services/api/chat.api";
import { friendApi } from "@/services/api/friend.api";
import { messageApi } from "@/services/api/message.api";
import { requestApi } from "@/services/api/request.api";
import { userApi } from "@/services/api/user.api";
import authSlice from "../slices/authSlice";
import chatSlice from "../slices/chatSlice";
import uiSlice from "../slices/uiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [chatSlice.name]: chatSlice.reducer,
      [uiSlice.name]: uiSlice.reducer,

      [authApi.reducerPath]: authApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [messageApi.reducerPath]: messageApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [requestApi.reducerPath]: requestApi.reducer,
      [friendApi.reducerPath]: friendApi.reducer,
      [attachmentApi.reducerPath]: attachmentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck:false})
        .concat(authApi.middleware)
        .concat(chatApi.middleware)
        .concat(messageApi.middleware)
        .concat(userApi.middleware)
        .concat(requestApi.middleware)
        .concat(friendApi.middleware)
        .concat(attachmentApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
