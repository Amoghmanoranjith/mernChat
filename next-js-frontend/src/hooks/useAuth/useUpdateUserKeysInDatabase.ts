import { useUpdateUserKeysInDatabaseMutation } from "@/services/api/auth.api"
import { useToast } from "../useUI/useToast"

export const useUpdateUserKeysInDatabase = () => {

    const [updateKeysInDatabase, {error,isError,isLoading,isSuccess, isUninitialized,data}] = useUpdateUserKeysInDatabaseMutation()
    useToast({error,isError,isLoading,isSuccess, isUninitialized})

    return {
        updateKeysInDatabase,
        updateUserKeysIsSuccess:isSuccess,
        publicKeyReturnedFromServerAfterBeingStored:data?.publicKey
    }
}
