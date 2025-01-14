import { encryptPrivateKey } from "@/utils/encryption";
import { useEffect, useState } from "react";

type PropTypes = {
    password:string | null;
    privateKeyJWK:JsonWebKey | null;
    publicKeyJWK:JsonWebKey | null;
}

export const useEncryptPrivateKeyWithUserPassword = ({password,privateKeyJWK,publicKeyJWK}:PropTypes) => {

    const [encryptedPrivateKey,setEncryptedPrivateKey] = useState<string | null>(null);

    const handleEncryptPrivateKey = async(password:string,privateKeyJWK:JsonWebKey)=>{
        const encryptedPrivateKey =  await encryptPrivateKey(password,privateKeyJWK);
        setEncryptedPrivateKey(encryptedPrivateKey);
    }

    useEffect(()=>{
        if(password && privateKeyJWK && publicKeyJWK){
            handleEncryptPrivateKey(password,privateKeyJWK);
        }
    },[password,privateKeyJWK,publicKeyJWK])

    return {encryptedPrivateKey};
};
