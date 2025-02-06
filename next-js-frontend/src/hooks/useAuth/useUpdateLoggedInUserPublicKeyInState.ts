import { updateLoggedInUserPublicKey } from "@/lib/client/slices/authSlice";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useEffect } from "react";

type PropTypes = {
  publicKey: string | undefined;
};

export const useUpdateLoggedInUserPublicKeyInState = ({
  publicKey,
}: PropTypes) => {
  const disptach = useAppDispatch();

  useEffect(() => {
    if (publicKey) {
      disptach(
        updateLoggedInUserPublicKey({ publicKey: JSON.parse(publicKey) })
      );
    }
  }, [disptach, publicKey]);
};
