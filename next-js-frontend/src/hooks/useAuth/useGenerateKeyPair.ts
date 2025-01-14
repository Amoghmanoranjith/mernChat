import { User } from "@/interfaces/auth.interface";
import { generateKeyPair } from "@/utils/encryption";
import { useEffect, useState } from "react";

type PropTypes = {
  user: User | undefined | boolean
};

export const useGenerateKeyPair = ({ user }: PropTypes) => {
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);

  const generateKeyPairAndConvertItInJwkFormat = async () => {
    const { privateKey, publicKey } = await generateKeyPair();
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
  };

  useEffect(() => {
    if (user) {
      generateKeyPairAndConvertItInJwkFormat();
    }
  }, [user]);

  return { privateKey, publicKey };
};
