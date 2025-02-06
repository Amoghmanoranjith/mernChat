"use client";
import { User } from "@/interfaces/auth.interface";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppSelector } from "@/lib/client/store/hooks";
import { ChatDetails } from "./ChatDetails";

type PropTypes = {
  loggedInUser: User;
};

export const ChatDetailsLoaderWrapper = ({ loggedInUser }: PropTypes) => {
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  return (
    selectedChatDetails && (
      <ChatDetails
        selectedChatDetails={selectedChatDetails}
        loggedInUser={loggedInUser}
      />
    )
  );
};
