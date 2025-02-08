import { useDebounce } from "@/hooks/useUtils/useDebounce";
import { useGetUserFriendRequestsQuery } from "@/lib/client/rtk-query/request.api";
import { useEffect, useState } from "react";
import { useSendFriendRequest } from "../../hooks/useFriend/useSendFriendRequest";
import { useSearchUser } from "../../hooks/useSearch/useSearchUser";
import { selectLoggedInUser } from "../../lib/client/slices/authSlice";
import { useAppSelector } from "../../lib/client/store/hooks";
import { UserListSkeleton } from "../ui/skeleton/UserListSkeleton";
import { UserList } from "./UserList";

const AddFriendForm = () => {
  const [inputVal, setInputVal] = useState<string>("");
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id;

  const { data: friends } = useGetUserFriendRequestsQuery();

  const { sendFriendRequest } = useSendFriendRequest();
  const { searchUser, searchResults, isFetching } = useSearchUser();

  const debouncedInputVal = useDebounce(inputVal, 600);

  useEffect(() => {
    if (debouncedInputVal) {
      searchUser(debouncedInputVal, true);
    }
  }, [debouncedInputVal, searchUser]);

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
        {!isFetching &&
        searchResults &&
        searchResults.length > 0 &&
        friends &&
        loggedInUserId ? (
          <UserList
            users={searchResults}
            friends={friends}
            loggedInUserId={loggedInUserId}
            sendFriendRequest={hanldeSendFriendRequest}
          />
        ) : isFetching ? (
          <UserListSkeleton count={4} />
        ) : (
          !inputVal?.trim() &&
          !searchResults?.length && (
            <p className="text-center mt-16">Go on try the speed!</p>
          )
        )}
      </div>
    </div>
  );
};

export default AddFriendForm;
