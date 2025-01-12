import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Message } from "@/interfaces/message.interface";


export const messageApi = createApi({
    reducerPath:'messageApi',
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/message`,
        credentials:'include'
    }),
    endpoints:(builder)=>({
        getMessagesByChatId:builder.query<{messages:Message[],totalPages:number},{chatId:string,page:number}>({
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

/**
 * `serializeQueryArgs` is used to customize the cache key for this query.
 * 
 * ## Problem Without `serializeQueryArgs`
 * By default, RTK Query generates a cache key based on the entire `queryArgs` object. 
 * In this case, if the `queryArgs` object has the same `chatId` for multiple pages 
 * (e.g., `{ chatId: '2', page: 1 }` and `{ chatId: '2', page: 2 }`), the cache key 
 * won't distinguish between the pages. As a result:
 * 
 * - Fetching a new page of messages (e.g., page 2) will overwrite the cached data 
 *   for the previous page (e.g., page 1), because RTK Query thinks both belong 
 *   to the same `chatId` and doesn't account for the `page`.
 * - This causes previous chat messages (e.g., page 1) to be lost in the cache.
 * 
 * ## Solution Using `serializeQueryArgs`
 * By customizing the cache key to include the `page` information, we ensure that:
 * - Each `chatId` and `page` combination has its unique cache entry.
 * - For example:
 *   - Page 1 for `chatId: 2` → Cache key: `getMessagesByChatId_2_1`
 *   - Page 2 for `chatId: 2` → Cache key: `getMessagesByChatId_2_2`
 * 
 * This prevents cache overwriting and ensures that each page of messages for a 
 * particular `chatId` is stored separately.
 */

/*
serializeQueryArgs: ({ endpointName, queryArgs: { chatId, page } }) => {
    return `${endpointName}_${chatId}_${page}`;
*/

/**
 * `merge` is used to combine the new data (from the current request) with the 
 * existing cached data for the same `chatId`.
 * 
 * ## Problem Without `merge`
 * When a new page of messages is fetched (e.g., page 2 for `chatId: 2`), the 
 * default behavior of RTK Query is to replace the entire cache for `chatId: 2` 
 * with the new page's messages. This leads to:
 * 
 * - Losing previously fetched pages of messages (e.g., page 1) for the same chat.
 * - Users not seeing a continuous chat history when paginating.
 * 
 * ## Solution Using `merge`
 * The `merge` function ensures that:
 * - The new page of messages (e.g., page 2) is appended to the existing cache 
 *   for the same `chatId`.
 * - For example:
 *   - Existing cache for `chatId: 2`: `[msg1, msg2, msg3]` (page 1 messages)
 *   - New data (page 2 messages): `[msg4, msg5, msg6]`
 *   - After `merge`: `[msg1, msg2, msg3, msg4, msg5, msg6]`
 * - This ensures that the chat history remains continuous and paginated messages 
 *   are seamlessly appended.
 */