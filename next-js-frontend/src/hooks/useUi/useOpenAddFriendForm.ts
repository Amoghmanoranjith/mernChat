import { setAddFriendForm, setNavMenu } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useOpenAddFriendForm = () => {

    const dispatch = useAppDispatch()

    const openAddFriendForm=()=>{
        dispatch(setNavMenu(false))
        dispatch(setAddFriendForm(true))
    }
    return {openAddFriendForm};
}
