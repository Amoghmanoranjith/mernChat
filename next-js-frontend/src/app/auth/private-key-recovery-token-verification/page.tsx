'use client';
import useNavigateToRecoverySuccessfulPageOnPrivateKeyRestoration from "@/hooks/useAuth/useNavigateToRecoverySuccessfulPageOnPrivateKeyRestoration";
import { useVerifyPrivateKeyRecoveryToken } from "@/hooks/useAuth/useVerifyPrivateKeyRecoveryToken";
import { useSearchParams } from "next/navigation";

export default function page() {

    const searchParams = useSearchParams()
    const token = searchParams.get('token');

    const {isPrivateKeyRestoredInIndexedDB} = useVerifyPrivateKeyRecoveryToken({recoveryToken:token});
    useNavigateToRecoverySuccessfulPageOnPrivateKeyRestoration({isPrivateKeyRestoredInIndexedDB});


  return (
    <span>Verifying link....</span>
  )
}
