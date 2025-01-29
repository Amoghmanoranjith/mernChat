import { useGetFriendsQuery } from "@/services/api/friend.api"
import { useEffect, useState } from "react"
import { useSendFriendRequest } from "../../hooks/useFriend/useSendFriendRequest"
import { useSearchUser } from "../../hooks/useSearch/useSearchUser"
import { selectLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { UserListSkeleton } from "../ui/skeleton/UserListSkeleton"
import { UserList } from "./UserList"

const AddFriendForm = () => {

    const [inputVal,setInputVal] = useState<string>("")
    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id

    const {data:friends} = useGetFriendsQuery()

    const {sendFriendRequest} = useSendFriendRequest()
    const {searchUser,searchResults,isFetching} = useSearchUser()


    useEffect(()=>{
        let timeoutId:NodeJS.Timeout

        if(inputVal?.trim().length){
            timeoutId = setTimeout(()=>{
                searchUser(inputVal.trim())
            },600)
        }

        return () => {
            clearInterval(timeoutId)
        }

    },[inputVal, searchUser])

    const hanldeSendFriendRequest = (receiverId:string)=>{
        sendFriendRequest({receiverId})
    }

  return (
    <div className="flex flex-col gap-y-4 min-h-72 max-h-96 overflow-y-auto">

        <input value={inputVal} onChange={e=>setInputVal(e.target.value)} className="p-3 rounded text-text bg-background w-full border-none outline-none" type="text" placeholder="Search username"/>
        
        <div className="">
            {
                (!isFetching && searchResults && searchResults.length>0 && friends && loggedInUserId) ?
                <UserList 
                 users={searchResults} 
                 friends={friends}
                 loggedInUserId={loggedInUserId}
                 sendFriendRequest={hanldeSendFriendRequest}
                />
                :
                isFetching ?
                <UserListSkeleton count={4}/>
                :
                !inputVal?.trim() && !searchResults?.length &&
                <p className="text-center mt-16">Go on try the speed!</p>
            }
        </div>
        
    </div>
  )
}

export default AddFriendForm;
