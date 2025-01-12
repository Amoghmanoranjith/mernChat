import { setNavMenu, setNewgroupChatForm } from "@/services/redux/slices/uiSlice";
import { useAppDispatch } from "@/services/redux/store/hooks";

export const useOpenGroupChatForm = () => {
    const dispatch = useAppDispatch();
    const openGroupChatForm = ()=>{
        dispatch(setNavMenu(false));
        dispatch(setNewgroupChatForm(true));
    }
    return {openGroupChatForm};
}
