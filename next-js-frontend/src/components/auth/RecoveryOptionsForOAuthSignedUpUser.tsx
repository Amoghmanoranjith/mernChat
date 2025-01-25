import { useSendPrivateKeyRecoveryEmail } from "@/hooks/useAuth/useSendPrivateKeyRecoveryEmail";
import { useStoreLoggedInUserInfoInLocalStorageIfRecoveryEmailSentSuccessful } from "@/hooks/useAuth/useStoreLoggedInUserInfoInLocalStorageIfRecoveryEmailSentSuccessful";
import { User } from "@/interfaces/auth.interface";
import { CircleLoading } from "../shared/CircleLoading";

type PropTypes = {
  loggedInUser: User;
};

export const RecoveryOptionsForOAuthSignedUpUser = ({loggedInUser}:PropTypes) => {
  const { sendPrivateKeyRecoveryEmail, isLoading, isSuccess } = useSendPrivateKeyRecoveryEmail();

  useStoreLoggedInUserInfoInLocalStorageIfRecoveryEmailSentSuccessful({isPrivateKeyRecoveryEmailSentSuccessful:isSuccess,loggedInUser});

  return (
      isSuccess ? (
        <h2 className="text font-bold bg-background p-4 rounded-md">
          We have sent an verification email, please check spam if not received
        </h2>
      ) : (
        <button
          onClick={() => sendPrivateKeyRecoveryEmail()}
          type="submit"
          className={`bg-primary px-14 py-2 self-center rounded-sm ${
            isLoading ? "bg-transparent" : ""
          }`}
        >
          {isLoading ? (
            <CircleLoading size="6" />
          ) : (
            "Initiate private key recovery"
          )}
        </button>
      )
  );
};
