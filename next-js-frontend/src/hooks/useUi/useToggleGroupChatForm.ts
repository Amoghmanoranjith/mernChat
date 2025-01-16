import { selectGroupChatForm, setNavMenu, setNewgroupChatForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleGroupChatForm = () => {

    const dispatch = useAppDispatch()
    const groupChatForm = useAppSelector(selectGroupChatForm)

    const toggleGroupChatForm = ()=>{
        dispatch(setNavMenu(false))
        dispatch(setNewgroupChatForm(!groupChatForm))
    }

    return {toggleGroupChatForm};
}
