import { useEffect } from "react"
import { convertCryptoKeyToJwk, encryptPrivateKey, generateKeyPair } from "../../utils/encryption"
import { useUpdateUserKeys } from "./useUpdateUserKeys"
import { storePrivateKey } from "@/utils/indexedDB"

export const useGenerateKeyPair = (isSignupSuccess:boolean,loggedInUserId:string | undefined,password:string | undefined,updateLoggedInUserCallBack?: (publicKey?: string) => void) => {

    const {updateUserKeys:updateUserKeysInDatabase,publicKeyReturnedFromServerAfterBeingAdded,updateUserKeysSuccess} = useUpdateUserKeys()


    const handleGenerateKeyPair = async()=>{

        console.log('generate key pair initiated');

        if(loggedInUserId && password){
            
            const keys = await generateKeyPair()
            
            // now converting both the keys to jwk(json web key) format
            // as we can't store the crypto keys directly in the database
            // so we need to convert them to jwk format
            const publicJwkKey = await convertCryptoKeyToJwk(keys.publicKey)
            const privateJwkKey = await convertCryptoKeyToJwk(keys.privateKey)
            
            // now we need to store the generated keys for user in the database in that user's account
            // but we cannot store private key directly in the database
            // so we need to encrypt the private key with the user's password
            
            // encrypting the private key with the user's password
            const encryptedPrivateKey = await encryptPrivateKey(password,privateJwkKey)

            // storing the public key and the encrypted private key in the database
            updateUserKeysInDatabase({publicKey:JSON.stringify(publicJwkKey),privateKey:encryptedPrivateKey})

            // storing the private key in the indexedDB with a key of the user's id
            storePrivateKey(loggedInUserId,privateJwkKey)
        }
    }

    
    useEffect(()=>{
        if(isSignupSuccess && loggedInUserId && password){
            // if the user is new, then generate the key pair
            handleGenerateKeyPair()
        }
    },[isSignupSuccess,loggedInUserId,password])

    useEffect(()=>{
        if(updateUserKeysSuccess && publicKeyReturnedFromServerAfterBeingAdded){
            if(updateLoggedInUserCallBack){
                // when the keys are successfully stored in the database
                // then from backend response we get the public key that we have stored
                // so now we can call the callback function to update the user's public key in the redux store
                updateLoggedInUserCallBack(publicKeyReturnedFromServerAfterBeingAdded)
            }
        }
    },[updateUserKeysSuccess,publicKeyReturnedFromServerAfterBeingAdded])

}
