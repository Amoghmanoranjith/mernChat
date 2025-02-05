import { useEffect } from "react";
import { useUpdateUserKeysInDatabase } from "./useUpdateUserKeysInDatabase";

type PropTypes = {
    encryptedPrivateKey: string | null;
    publicKeyJWK: JsonWebKey | null;
}

export const useStoreUserKeysInDatabase = ({encryptedPrivateKey,publicKeyJWK}:PropTypes) => {
    const {updateKeysInDatabase,publicKeyReturnedFromServerAfterBeingStored,updateUserKeysIsSuccess} = useUpdateUserKeysInDatabase();

    useEffect(()=>{
        if(encryptedPrivateKey && publicKeyJWK){
            updateKeysInDatabase({privateKey:encryptedPrivateKey,publicKey:JSON.stringify(publicKeyJWK)});
        }
    },[encryptedPrivateKey, publicKeyJWK, updateKeysInDatabase]);

    return {
        publicKeyReturnedFromServerAfterBeingStored,
        userKeysStoredInDatabaseSuccess:updateUserKeysIsSuccess
    }

}
