import { convertCryptoKeyToJwk } from "@/utils/encryption";
import { useEffect, useState } from "react";

type PropTypes = {
  privateKey: CryptoKey | null;
  publicKey: CryptoKey | null;
}

export const useConvertPrivateAndPublicKeyInJwkFormat = ({privateKey,publicKey}:PropTypes) => {

  const [privateKeyJWK, setPrivateKeyJWK] = useState<JsonWebKey | null>(null);
  const [publicKeyJWK, setPublicKeyJWK] = useState<JsonWebKey | null>(null);

  const handleConvertPrivateAndPublicKeyToJwk = async(privateKey:CryptoKey,publicKey:CryptoKey)=>{
    const [privateKeyJWK,publicKeyJWK] = await Promise.all([convertCryptoKeyToJwk(privateKey),convertCryptoKeyToJwk(publicKey)]);
    setPrivateKeyJWK(privateKeyJWK);
    setPublicKeyJWK(publicKeyJWK);
  }

  useEffect(()=>{
    if(privateKey && publicKey){
      handleConvertPrivateAndPublicKeyToJwk(privateKey,publicKey)
    }
  },[privateKey,publicKey]);

  return {privateKeyJWK,publicKeyJWK};

}
