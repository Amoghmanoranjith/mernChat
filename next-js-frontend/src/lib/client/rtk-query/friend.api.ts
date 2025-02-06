import { fetchUserFriendsResponse } from "@/lib/server/services/userService";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendApi = createApi({
    reducerPath:"friendApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/friend`,
        credentials:"include"
    }),

    endpoints:(builder)=>({
        getFriends:builder.query<fetchUserFriendsResponse[],void>({
            query:()=>"/"
        })
    })
})

export const {
    useGetFriendsQuery
} = friendApi