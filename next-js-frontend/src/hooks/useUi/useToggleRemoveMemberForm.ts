import { selectRemoveMemberForm, setRemoveMemberForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"

export const useToggleRemoveMemberForm = () => {

    const dispatch = useAppDispatch()
    const removeMemberForm = useAppSelector(selectRemoveMemberForm)

    const toggleRemoveMember = ()=>{
        dispatch(setRemoveMemberForm(!removeMemberForm))
    }

    return {toggleRemoveMember};
}
