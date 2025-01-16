import { OtpVerification } from "@/components/auth/OtpVerification";

const page = async() => {
  
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4">
        <h4 className="text-4xl text-fluid-h4 font-bold">
          Verify your email address
        </h4>
        <p className="text-lg text-fluid-p">
          You'll receive an otp that will {" "}
          {/* <span className="font-semibold">{user?.email}</span> that will */}
          help us verify that this email is your's
        </p>
      </div>
      <OtpVerification/>
    </div>
  );
};

export default page;
