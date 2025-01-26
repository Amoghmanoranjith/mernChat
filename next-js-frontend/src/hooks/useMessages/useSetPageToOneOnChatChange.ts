import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";

type PropTypes = {
  setPage: Dispatch<SetStateAction<number>>;
};

export const useSetPageToOneOnChatChange = ({ setPage }: PropTypes) => {
  const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id;

  useLayoutEffect(() => {
    setPage(1);
  }, [selectedChatId,setPage]);
};
