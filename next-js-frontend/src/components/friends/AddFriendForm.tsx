import { searchUser } from "@/actions/user.actions";
import { useDebounce } from "@/hooks/useUtils/useDebounce";
import { useGetUserFriendRequestsQuery } from "@/lib/client/rtk-query/request.api";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useSendFriendRequest } from "../../hooks/useFriend/useSendFriendRequest";
import { selectLoggedInUser } from "../../lib/client/slices/authSlice";
import { useAppSelector } from "../../lib/client/store/hooks";
import { UserList } from "./UserList";

const AddFriendForm = () => {

  const [state,searchUserAction] = useActionState(searchUser,undefined);

  const [inputVal, setInputVal] = useState<string>("");
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id;

  const { data: friends } = useGetUserFriendRequestsQuery();

  const { sendFriendRequest } = useSendFriendRequest();

  const debouncedInputVal = useDebounce(inputVal, 600);

  useEffect(() => {
    if (debouncedInputVal) {
      startTransition(()=>{
        searchUserAction({username:debouncedInputVal})
      })
    }
  }, [debouncedInputVal]);

  const hanldeSendFriendRequest = (receiverId: string) => {
    sendFriendRequest({ receiverId });
  };

  return (
    <div className="flex flex-col gap-y-4 min-h-72 max-h-96 overflow-y-auto">
      <input
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        className="p-3 rounded text-text bg-background w-full border-none outline-none"
        type="text"
        placeholder="Search username"
      />

      <div>
        {(state?.data && friends && loggedInUserId) ? (
          <UserList
            users={state.data}
            friends={friends}
            loggedInUserId={loggedInUserId}
            sendFriendRequest={hanldeSendFriendRequest}
          />
        ) 
        :(
          !inputVal?.trim() &&
          !state?.data?.length && (
            <p className="text-center mt-16">Go on try the speed!</p>
          )
        )}
      </div>
    </div>
  );
};

export default AddFriendForm;
