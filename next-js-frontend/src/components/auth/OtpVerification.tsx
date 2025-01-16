"use client";

import { useSendOtp } from "@/hooks/useAuth/useSendOtp";
import { OtpVerificationForm } from "./OtpVerificationForm";

export const OtpVerification = () => {
  const { sendOtp, isLoading, isSuccess } = useSendOtp();

  return (
    <div>
      {isSuccess ? (
        <OtpVerificationForm />
      ) : (
        <button
          disabled={isLoading}
          onClick={() => sendOtp()}
          type="submit"
          className="bg-primary px-6 py-2 rounded-sm max-sm:w-full"
        >
          Get OTP
        </button>
      )}
    </div>
  );
};
