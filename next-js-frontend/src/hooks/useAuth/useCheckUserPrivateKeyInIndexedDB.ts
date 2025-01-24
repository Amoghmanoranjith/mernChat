import { User } from "@/interfaces/auth.interface";
import { getUserPrivateKeyFromIndexedDB } from "@/utils/indexedDB";
import { useEffect } from "react";
import { useToggleRecoverPrivateKeyForm } from "../useUI/useToggleRecoverPrivateKeyForm";


type PropTypes = {
    loggedInUser:User
}

export const useCheckUserPrivateKeyInIndexedDB = ({loggedInUser}:PropTypes) => {

   const {toggleRecoverPrivateKeyForm} = useToggleRecoverPrivateKeyForm()

   const checkPrivateKeyInIndexedDB = async()=>{
      const userPrivateKey = await getUserPrivateKeyFromIndexedDB({userId:loggedInUser._id})
      if(userPrivateKey==null){
        toggleRecoverPrivateKeyForm();
      }      
   }

   useEffect(()=>{
      checkPrivateKeyInIndexedDB();
   },[])
};
