import { SignupForm } from "@/components/auth/SignupForm";
import { SocialLogin } from "@/components/auth/SocialLogin";

const page = () => {
  return (
    <>
      <div className="flex flex-col gap-y-8">
        <h3 className="text-4xl font-bold text-fluid-h4">Signup</h3>
        <SocialLogin googleLink={`${process.env.BASE_URL}/auth/google`} />
      </div>

      <SignupForm />
    </>
  );
};

export default page;
