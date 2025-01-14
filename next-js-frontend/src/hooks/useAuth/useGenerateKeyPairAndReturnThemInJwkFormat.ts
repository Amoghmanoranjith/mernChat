import { User } from "@/interfaces/auth.interface";
import { convertCryptoKeyToJwk, generateKeyPair } from "@/utils/encryption";
import { useEffect, useState } from "react";

type PropTypes = {
  user:User | undefined;
}

export const useGenerateKeyPairAndReturnThemInJwkFormat = ({user}:PropTypes) => {

  const [privateKeyJWK,setPrivateKeyJWK] = useState<JsonWebKey | null>(null);
  const [publicKeyJWK,setpublicKeyJWK] = useState<JsonWebKey | null>(null);

  const generateKeyPairAndConvertItInJwkFormat = async()=>{
    const {privateKey,publicKey} = await generateKeyPair();
    const [privateKeyJWK,publicKeyJWK] = await Promise.all([convertCryptoKeyToJwk(privateKey),convertCryptoKeyToJwk(publicKey)]);
    setPrivateKeyJWK(privateKeyJWK);
    setpublicKeyJWK(publicKeyJWK);
  }

  useEffect(()=>{
    if(user){
      generateKeyPairAndConvertItInJwkFormat();
    }
  },[user])

  return {privateKeyJWK,publicKeyJWK};
}
