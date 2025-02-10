import { FetchUserInfoResponse } from "@/lib/server/services/userService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Otp,
  ResetPassword,
} from "../../../interfaces/auth.interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({

    forgotPassword: builder.mutation<void, Pick<FetchUserInfoResponse, "email">>({
      query: (credentials) => ({
        url: "/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPassword>({
      query: (credentials) => ({
        url: "/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyOtp: builder.mutation<FetchUserInfoResponse, Otp>({
      query: (credentials) => ({
        url: "/verify-otp",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyPassword: builder.mutation<void, { password: string }>({
      query: ({ password }) => ({
        url: "/verify-password",
        method: "POST",
        body: { password },
      }),
    }),

    verifyPrivateKeyToken: builder.mutation<{ privateKey: string; combinedSecret?: string },{ recoveryToken: string }>({
      query: ({ recoveryToken }) => ({
        url: "/verify-privatekey-token",
        method: "POST",
        body: { recoveryToken },
      }),
    }),

    sendPrivateKeyRecoveryEmail: builder.query<void, void>({
      query: () => "/send-private-key-recovery-email",
    }),

    updateUserKeysInDatabase: builder.mutation<{ publicKey: string },{ publicKey: string; privateKey: string }>({
      query: ({ publicKey, privateKey }) => ({
        url: "/user/keys",
        method: "PATCH",
        body: { publicKey, privateKey },
      }),
    }),

    updateFcmToken: builder.mutation<{ fcmTokenExists: boolean },{ fcmToken: string }>({
      query: ({ fcmToken }) => ({
        url: "/user/update-fcm-token",
        method: "PATCH",
        body: { fcmToken },
      }),
    }),

    sendOtp: builder.query<void, void>({
      query: () => "/send-otp",
    }),

    verifyOAuthToken: builder.mutation<{ combinedSecret?: string; user: FetchUserInfoResponse },{ token: string }>({
      query: ({ token }) => ({
        url: "/verify-oauth-token",
        method: "POST",
        body: { token },
      }),
    }),

    logout: builder.query<void, void>({
      query: () => "/logout",
    }),

    checkAuth: builder.query<FetchUserInfoResponse | null, void>({
      query: () => "/check-auth",
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
  useLazySendOtpQuery,
  useLazyLogoutQuery,
  useCheckAuthQuery,
  useUpdateUserKeysInDatabaseMutation,
  useVerifyPasswordMutation,
  useVerifyPrivateKeyTokenMutation,
  useUpdateFcmTokenMutation,
  useLazySendPrivateKeyRecoveryEmailQuery,
  useVerifyOAuthTokenMutation,
} = authApi;
