import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const page = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-3">
        <h3 className="text-4xl text-fluid-h3 font-bold">Let us help you</h3>
        <p className="text-lg text-fluid-p">
          You&apos;ll receive a password reset link if your email is registered
          with us
        </p>
      </div>
      <ForgotPasswordForm />
      <AuthRedirectLink pageName="Login" text="Go back?" to="auth/login" />
    </div>
  );
};

export default page;
