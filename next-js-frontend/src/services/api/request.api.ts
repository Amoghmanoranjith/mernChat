import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FriendRequest } from '../../interfaces/request.interface'
import { setFriendRequestForm } from '../redux/slices/uiSlice'
import { fetchUserFriendRequestResponse } from '@/lib/server/services/userService'

export const requestApi = createApi({
    reducerPath:"requestApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/request`,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        sendFriendRequest:builder.mutation<void,{receiverId:string}>({
            query:({receiverId})=>({
                url:"/",
                method:"POST",
                body:{receiver:receiverId}
            })
        }),
        getUserFriendRequests:builder.query<fetchUserFriendRequestResponse[],void>({
            query:()=>"/"
        }),
        handleFriendRequest:builder.mutation<FriendRequest['_id'],{requestId:FriendRequest['_id'],action: "accept" | "reject"}>({
            query:({requestId,action})=>({
                url:`/${requestId}`,
                method:"DELETE",
                body:{action},
            }),
            async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                  const { data: handledRequestId } = await queryFulfilled
                  dispatch(
                    requestApi.util.updateQueryData('getUserFriendRequests', undefined , (draft) => {
                      const friendRequestIndexToBeRemoved = draft.findIndex(draft=>draft.id===handledRequestId)
                      if(draft.length===1) dispatch(setFriendRequestForm(false))
                      if(friendRequestIndexToBeRemoved!==-1) draft.splice(friendRequestIndexToBeRemoved,1)
                    })
                  )
                } catch(error) {
                    console.log(error);
                }
              },
        })

    })
})

export const {
    useSendFriendRequestMutation,
    useGetUserFriendRequestsQuery,
    useHandleFriendRequestMutation,
} = requestApi