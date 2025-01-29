import { OtpVerification } from "@/components/auth/OtpVerification";

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
