"use client";
import { selectLoggedInUser } from "../../lib/client/slices/authSlice";
import { useAppSelector } from "../../lib/client/store/hooks";
import { PrivateKeyRecoveryFromPrimaryInfo } from "./PrivateKeyRecoveryFromPrimaryInfo";
import { RecoveryOptionsForManualSignedUpUser } from "./RecoveryOptionsForManualSignedUpUser";
import { RecoveryOptionsForOAuthSignedUpUser } from "./RecoveryOptionsForOAuthSignedUpUser";

const RecoverPrivateKeyForm = () => {
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const hasUserSignedUpViaOAuth = loggedInUser?.oAuthSignup;

  return (
    <div className="flex flex-col gap-y-6">
      <PrivateKeyRecoveryFromPrimaryInfo
        hasUserSignedUpViaOAuth={hasUserSignedUpViaOAuth}
      />
      {hasUserSignedUpViaOAuth ? (
        <RecoveryOptionsForOAuthSignedUpUser loggedInUser={loggedInUser} />
      ) : (
        <RecoveryOptionsForManualSignedUpUser loggedInUser={loggedInUser} />
      )}
    </div>
  );
};

export default RecoverPrivateKeyForm;
