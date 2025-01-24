type PropTypes = {
  hasUserSignedUpViaOAuth: boolean | undefined;
};

export const DisplayAppropriatePrivateKeyRecoveryMessage = ({
  hasUserSignedUpViaOAuth,
}: PropTypes) => {
  if (hasUserSignedUpViaOAuth) {
    return (
      <p>
        It looks like we've detected that your private key is missing. Don't
        worry, you can easily recover it by verifying your email. Simply click
        the button below to initiate the recovery process. You will receive a
        verification email shortly. Please click on the verify button in that
        email. Once verified, we will restore your private key, and you'll be
        back to normal in no time.
      </p>
    );
  } else {
    return (
      <p>
        It looks like we've detected that your private key is missing. Don't
        worry, you can easily recover it by entering your account password.
        After entering your correct password, you will receive a verification
        email. Please click on the verify button in that email. Once verified,
        we will restore your private key, and you'll be back to normal in no
        time.
      </p>
    );
  }
};
