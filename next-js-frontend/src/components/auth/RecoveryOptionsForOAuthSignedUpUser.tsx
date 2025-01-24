import { useSendPrivateKeyRecoveryEmail } from "@/hooks/useAuth/useSendPrivateKeyRecoveryEmail";
import { CircleLoading } from "../shared/CircleLoading";

export const RecoveryOptionsForOAuthSignedUpUser = () => {
  const { sendPrivateKeyRecoveryEmail, isLoading, isSuccess } = useSendPrivateKeyRecoveryEmail();

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
