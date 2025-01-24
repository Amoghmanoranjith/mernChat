"use client";
import { User } from "@/interfaces/auth.interface";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { ChatDetails } from "./ChatDetails";

type PropTypes = {
  loggedInUser: User;
};

export const ChatDetailsLoaderWrapper = ({ loggedInUser }: PropTypes) => {
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  if (selectedChatDetails)
    return (
      <ChatDetails
        selectedChatDetails={selectedChatDetails}
        loggedInUser={loggedInUser}
      />
    );
  return null;
};
