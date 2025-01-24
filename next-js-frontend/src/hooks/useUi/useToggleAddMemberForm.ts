import { selectAddMemberForm, setAddMemberForm } from "@/services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"

export const useToggleAddMemberForm = () => {

    const dispatch = useAppDispatch()
    const addMemberForm = useAppSelector(selectAddMemberForm)

    const toggleAddMemberForm = ()=>{
        dispatch(setAddMemberForm(!addMemberForm))
    }

    return {toggleAddMemberForm};
}
