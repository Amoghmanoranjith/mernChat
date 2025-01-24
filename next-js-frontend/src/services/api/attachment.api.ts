import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Attachment } from "../../interfaces/attachment.interface";

export const attachmentApi = createApi({
    reducerPath:"attachmentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/attachment`,
        credentials:"include"
    }),

    endpoints:(builder)=>({

        sendAttachments:builder.mutation<void,{chatId:string,attachments:Blob[]}>({
            query:({chatId,attachments})=>{
                const formData = new FormData()
                formData.append("chatId",chatId)
                for (const attachment of attachments) formData.append("attachments[]", attachment);
                return {
                    method:"POST",
                    url:"/",
                    body:formData,
                } 
            }
        }),
        fetchAttachments:builder.query<Attachment,{chatId:string,page:number}>({ 
            query:({chatId,page})=>`/${chatId}?page=${page}`,
            serializeQueryArgs:({endpointName,queryArgs:{chatId}})=>{
                return `${endpointName}_${chatId}`
            },
            merge: (currentCache, newItems) => {
                currentCache.attachments.push(...newItems.attachments)
                currentCache.totalPages=newItems.totalPages
            },
        })
    })
})

export const {
    useSendAttachmentsMutation,
    useLazyFetchAttachmentsQuery,
} = attachmentApi