import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated = () => {

    const loggedInUser =  useAppSelector(selectLoggedInUser);
    const router = useRouter();

    useEffect(()=>{
        if(loggedInUser){
            router.replace("/");
        }
    },[loggedInUser]);
}
