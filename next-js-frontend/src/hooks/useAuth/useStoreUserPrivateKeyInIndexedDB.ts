import { storeUserPrivateKeyInIndexedDB } from "@/lib/client/indexedDB";
import { useEffect } from "react";

type PropTypes = {
  userKeysStoredInDatabaseSuccess: boolean;
  privateKey: JsonWebKey | null;
  userId: string | undefined | null;
};

export const useStoreUserPrivateKeyInIndexedDB = ({
  userKeysStoredInDatabaseSuccess,
  privateKey,
  userId,
}: PropTypes) => {
  
  useEffect(() => {
    if (userKeysStoredInDatabaseSuccess && privateKey && userId) {
      storeUserPrivateKeyInIndexedDB({ privateKey, userId });
    }
  }, [userKeysStoredInDatabaseSuccess, privateKey, userId]);
};
