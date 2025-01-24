import { useRouter } from "next/navigation";
import { useEffect } from "react"

type PropTypes = {
    isPrivateKeyRestoredInIndexedDB:boolean;
}

export default function useNavigateToRecoverySuccessfulPageOnPrivateKeyRestoration({isPrivateKeyRestoredInIndexedDB}:PropTypes) {

    const router = useRouter();

    useEffect(()=>{
        if(isPrivateKeyRestoredInIndexedDB){
            console.log('is Private key restored or not',isPrivateKeyRestoredInIndexedDB);
            router.replace("/auth/private-key-restoration-success")
        }
    },[isPrivateKeyRestoredInIndexedDB])
}
