import type { ChatMember } from "@/interfaces/chat.interface";
import {
  convertCryptoKeyToJwk,
  convertJwkToCryptoKey,
  deriveSharedSecretKey,
} from "../../utils/encryption";
import {
  getStoredSharedKeyFromIndexedDB,
  getUserPrivateKeyFromIndexedDB,
  storeSharedKeyInIndexedDB,
} from "../../utils/indexedDB";

export const useGetSharedKey = () => {

  const getSharedKey =  async ({loggedInUserId,otherMember}:{loggedInUserId: string, otherMember: ChatMember}) => {


    // first we check the indexedDB for the shared key
    const existingSharedKeyInJwkFormat = await getStoredSharedKeyFromIndexedDB({userId1:loggedInUserId,userId2:otherMember._id});

    if (existingSharedKeyInJwkFormat) {
      // if it is found, we convert it to crypto format and return it
      const sharedSecretKeyInCryptoFormat = await convertJwkToCryptoKey({isPrivateKey:false,KeyInJwkFormat:existingSharedKeyInJwkFormat});
      return sharedSecretKeyInCryptoFormat;
    } 
    else {
      // if it is not found, we derive a new shared key

      // get the user's private key from indexedDB and the other member's public key
      // other member means the user to whom current user is sending the message
      const userPrivateKeyInJwkFormat = await getUserPrivateKeyFromIndexedDB({userId:loggedInUserId});
      const otherMemberPublicKeyInJwkFormat = otherMember.publicKey;

      if (userPrivateKeyInJwkFormat && otherMemberPublicKeyInJwkFormat) {
        // convert the keys to crypto format
        const [userPrivateKeyInCryptoFormat,otherMemberPublicKeyInCryptoFormat] = await Promise.all([convertJwkToCryptoKey({isPrivateKey:true,KeyInJwkFormat:userPrivateKeyInJwkFormat}),await convertJwkToCryptoKey({isPrivateKey:false,KeyInJwkFormat:JSON.parse(otherMember.publicKey)})])
        
        // after the userPrivateKey and otherMemberPublicKey are convereted into crypto format, we derive the shared key or the shared secret
        const sharedSecretKeyInCrytoFormat = await deriveSharedSecretKey({privateKey:userPrivateKeyInCryptoFormat,publicKey:otherMemberPublicKeyInCryptoFormat})
        
        // convert the shared key to JWK format and store it in indexedDB, so that next time if it is found in the indexedDB, we can directly use it
        // instead of deriving it again
        const sharedSecretKeyInJwkFormat = await convertCryptoKeyToJwk({cryptoKey:sharedSecretKeyInCrytoFormat});
        storeSharedKeyInIndexedDB({sharedKeyJwk:sharedSecretKeyInJwkFormat,userId1:loggedInUserId,userId2:otherMember._id});
        
        // return the shared key in crypto format
        return sharedSecretKeyInCrytoFormat;
      }
    }
  };

  return {getSharedKey}
};
