import { selectChatDetailsBar, setChatDetailsBar } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleChatDetailsBar = () => {
    
    const dispatch = useAppDispatch()
    const chatDetailsBar = useAppSelector(selectChatDetailsBar)

    const toggleChatDetailsBar=()=>{
        dispatch(setChatDetailsBar(!chatDetailsBar))
    }
    return {toggleChatDetailsBar};
}
