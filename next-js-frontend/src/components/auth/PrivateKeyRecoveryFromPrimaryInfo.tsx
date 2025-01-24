import { useHandleLogoutClickOnKeyRecoveryForm } from "@/hooks/useAuth/useHandleLogoutClickOnKeyRecoveryForm";
import { LogoutIcon } from "../ui/icons/LogoutIcon";
import { DisplayAppropriatePrivateKeyRecoveryMessage } from "./DisplayAppropriatePrivateKeyRecoveryMessage";

type PropTypes = {
  hasUserSignedUpViaOAuth: boolean | undefined;
};

export const PrivateKeyRecoveryFromPrimaryInfo = ({
  hasUserSignedUpViaOAuth,
}: PropTypes) => {
  const { handleLogoutClick } = useHandleLogoutClickOnKeyRecoveryForm();

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <h2 className="text-xl font-bold mr-5">Recover Your Private Key</h2>
        <button
          type="button"
          onClick={handleLogoutClick}
          className="flex items-center gap-x-1"
        >
          <span>Logout instead</span>
          <LogoutIcon />
        </button>
      </div>

      <DisplayAppropriatePrivateKeyRecoveryMessage
        hasUserSignedUpViaOAuth={hasUserSignedUpViaOAuth}
      />
    </div>
  );
};
