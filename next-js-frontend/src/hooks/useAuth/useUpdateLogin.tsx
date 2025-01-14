'use client';
import { useEffect } from "react"
import type { User } from "@/interfaces/auth.interface"
import { updateLoggedInUser } from "../../services/redux/slices/authSlice"
import { useAppDispatch } from "../../services/redux/store/hooks"
import { useRouter } from "next/navigation";

export const useUpdateLogin = (isSuccess:boolean,data:User | null | undefined) => {

    const dispatch = useAppDispatch()
    const router = useRouter();

    useEffect(()=>{
        if(isSuccess && data){
            dispatch(updateLoggedInUser(data));
            router.replace("/");
        }
    },[isSuccess])

}
