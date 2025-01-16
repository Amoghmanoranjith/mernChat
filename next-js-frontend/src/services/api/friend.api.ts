import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Friend } from "../../interfaces/friends.interface";

export const friendApi = createApi({
    reducerPath:"friendApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/friend`,
        credentials:"include"
    }),

    endpoints:(builder)=>({
        getFriends:builder.query<Friend[],void>({
            query:()=>"/"
        })
    })
})

export const {
    useGetFriendsQuery
} = friendApi