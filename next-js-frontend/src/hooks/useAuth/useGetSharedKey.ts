import type { ChatMember } from "@/interfaces/chat.interface";
import {
  convertJwkToCryptoKey,
  deriveSharedSecret,
} from "../../utils/encryption";
import {
  getPrivateKey,
  getStoredSharedKey,
  storeSharedKey,
} from "../../utils/indexedDB";

export const useGetSharedKey = () => {
  const getSharedKey =  async (loggedInUserId: string, otherMember: ChatMember) => {
    let sharedSecret;

    const existingSharedKey = await getStoredSharedKey(
      loggedInUserId,
      otherMember._id
    );

    if (existingSharedKey) {
      sharedSecret = await convertJwkToCryptoKey(existingSharedKey, true);
      return sharedSecret;
    } else {
      const privateKey = await getPrivateKey(loggedInUserId);

      if (privateKey) {
        const cryptoPrivateKey = await convertJwkToCryptoKey(privateKey, true);
        const otherMemberPublicCryptoKey = await convertJwkToCryptoKey(
          JSON.parse(otherMember.publicKey),
          false
        );
        sharedSecret = (await deriveSharedSecret(
          cryptoPrivateKey,
          otherMemberPublicCryptoKey
        )) as CryptoKey;
        await storeSharedKey(loggedInUserId, otherMember._id, sharedSecret);

        return sharedSecret;
      }
    }
  };

  return {getSharedKey}
};
