import { updateLoggedInUserPublicKey } from "@/lib/client/slices/authSlice";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PropTypes = {
  publicKey: string | undefined;
};

export const useUpdateLoggedInUserPublicKeyInState = ({
  publicKey,
}: PropTypes) => {
  const disptach = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      disptach(
        updateLoggedInUserPublicKey({ publicKey: JSON.parse(publicKey) })
      );
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  }, [disptach, publicKey, router]);
};
