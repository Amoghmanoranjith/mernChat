import { useEffect } from "react"
import type { User } from "@/interfaces/auth.interface"
import { updateLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"

export const useUpdateLogin = (isSuccess:boolean,data:User | null | undefined) => {

    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(isSuccess && data){
            dispatch(updateLoggedInUser(data))
        }
    },[isSuccess])

}
