import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Message } from "../../interfaces/message.interface";


export const messageApi = createApi({
    reducerPath:'messageApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.BASE_URL}`,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        getMessagesByChatId:builder.query<{messages:Message[],totalPages:number},{_id:string,page:number}>({
            query:({_id,page})=>`/message/${_id}?page=${page}`,
            serializeQueryArgs: ({ endpointName ,queryArgs:{_id}}) => {
              return  `${endpointName}_${_id}`
            },
            merge: (currentCache, newItems) => {
                currentCache.messages.unshift(...newItems.messages)
            },
        })
    })
})

export const {
    useLazyGetMessagesByChatIdQuery
} = messageApi