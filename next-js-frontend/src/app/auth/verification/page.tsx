import { OtpVerification } from "@/components/auth/OtpVerification";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - Mernchat",
  description: "Enter the OTP sent to your email to verify your account on Mernchat.",
  keywords: [
    "Mernchat email verification", 
    "verify email OTP", 
    "secure chat verification", 
    "email authentication", 
    "OTP login security"
  ],
  openGraph: {
    title: "Verify Email - Mernchat",
    description: "Enter the OTP sent to your email to verify your account on Mernchat.",
    url: "https://mernchat.in/auth/verify-email",
    siteName: "Mernchat",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Verify Email - Mernchat",
    description: "Enter the OTP sent to your email to verify your account on MernChat.",
  },
};

export default async function Page(){
  
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4">
        <h4 className="text-4xl text-fluid-h4 font-bold">
          Verify your email address
        </h4>
        <p className="text-lg text-fluid-p">
          You&apos;ll receive an otp that will {" "}
          help us verify that this email is your&apos;s
        </p>
      </div>
      <OtpVerification/>
    </div>
  );
};
