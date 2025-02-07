import { User } from "@/interfaces/auth.interface";
import { useVerifyPrivateKeyTokenMutation } from "@/lib/client/rtk-query/auth.api";
import { storeUserPrivateKeyInIndexedDB } from "@/lib/client/indexedDB";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { decryptPrivateKey } from "../../lib/client/encryption";
import { useToast } from "../useUI/useToast";

type PropTypes = {
  recoveryToken: string | null;
};

export const useVerifyPrivateKeyRecoveryToken = ({
  recoveryToken,
}: PropTypes) => {
  const [isPrivateKeyRestoredInIndexedDB, setIsPrivateKeyRestoredInIndexedDB] =
    useState(false);

  const [loggedInUser, setLoggedInUser] = useState<User>();

  const [
    verifyRecoveryToken,
    { error, isError, isLoading, isSuccess, isUninitialized, data },
  ] = useVerifyPrivateKeyTokenMutation();
  useToast({
    error,
    isError,
    isLoading,
    isSuccess,
    isUninitialized,
    successMessage: "Verification successful",
    successToast: true,
  });

  const handleDecrptPrivateKey = async () => {
    if ((data?.privateKey || data?.combinedSecret) && loggedInUser) {
      let password;

      if (data.combinedSecret) {
        // as for oAuth signed up users there is no password so we use combinedSecret as their password which is a combo of
        // googleId + someSecretValue(stored on server)
        // so basically
        // combinedSecret = googleId + someSecretValue(stored on server)
        // and this combined secret is being used as their password
        password = data.combinedSecret;
      } else {
        // if combined secret did not came
        // then it means that user has signed up manually
        // so we will use their password
        const passInLocalStorage = localStorage.getItem("tempPassword");

        if (passInLocalStorage) {
          password = passInLocalStorage;
        } else {
          toast.error("Some error occured");
        }
      }

      if (password) {
        // now as we have the password of user
        // we will decrypt the privateKey using this password (as the privateKey was also encrypted using this password)
        const privateKeyInJwk = await decryptPrivateKey(
          password,
          data.privateKey
        );
        // and then we will store the decrypted privateKey in indexedDB
        await storeUserPrivateKeyInIndexedDB({
          privateKey: privateKeyInJwk,
          userId: loggedInUser.id,
        });

        // and then we will remove the tempPassword and loggedInUser from localStorage
        localStorage.removeItem("tempPassword");
        localStorage.removeItem("loggedInUser");
        setIsPrivateKeyRestoredInIndexedDB(true);
      } else {
        toast.error("Some error occured while recovering");
      }
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      const loggedInUser = JSON.parse(userData) as User;
      if (loggedInUser) {
        setLoggedInUser(loggedInUser);
      }
    }
  }, []);

  useEffect(() => {
    if (recoveryToken && loggedInUser) {
      verifyRecoveryToken({ recoveryToken });
    }
  }, [recoveryToken, loggedInUser]);

  useEffect(() => {
    if (isSuccess && loggedInUser) {
      handleDecrptPrivateKey();
    }
  }, [isSuccess, loggedInUser]);

  return {
    isPrivateKeyRestoredInIndexedDB:
      isPrivateKeyRestoredInIndexedDB && isSuccess,
  };
};
