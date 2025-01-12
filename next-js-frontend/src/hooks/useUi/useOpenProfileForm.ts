import { setNavMenu, setProfileForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useOpenProfileForm = () => {

    const dispatch = useAppDispatch()

    const openProfileForm = ()=>{
        dispatch(setNavMenu(false))
        dispatch(setProfileForm(true))
    }
    return {openProfileForm};
}
