import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Forgot Password - Mernchat",
  description: "Forgot your password? Reset it securely on MernChat and regain access to your account.",
  keywords: [
    "Mernchat password reset", 
    "forgot password", 
    "reset password", 
    "recover account", 
    "secure password reset"
  ],
  openGraph: {
    title: "Forgot Password - Mernchat",
    description: "Forgot your password? Reset it securely on Mernchat and regain access to your account.",
    url: "https://mernchat.in/auth/forgot-password",
    siteName: "Mernchat",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Forgot Password - Mernchat",
    description: "Forgot your password? Reset it securely on Mernchat and regain access to your account.",
  },
};

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
