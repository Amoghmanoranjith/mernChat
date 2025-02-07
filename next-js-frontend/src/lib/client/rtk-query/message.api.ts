import { Message } from "@/interfaces/message.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


type fetchMessagesResponse = {
    messages:Message[],
    totalPages:number
}

export const messageApi = createApi({

    reducerPath:'messageApi',

    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/message`,
        credentials:'include'
    }),

    endpoints:(builder)=>({

        getMessagesByChatId:builder.query<fetchMessagesResponse,{chatId:string,page:number}>({
            query:({chatId,page})=>`/${chatId}?page=${page}`,
            serializeQueryArgs: ({ endpointName ,queryArgs:{chatId}}) => {
              return  `${endpointName}_${chatId}`
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