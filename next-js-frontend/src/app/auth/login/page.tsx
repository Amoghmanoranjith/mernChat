import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLogin } from "@/components/auth/SocialLogin";

export default function LoginPage() {
  return (
    <>
    <div className="flex flex-col gap-y-8">
      <h3 className="text-4xl font-bold text-fluid-h3">Login</h3>
      <SocialLogin googleLink={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`} />
    </div>
    <LoginForm/>
    </>
  );
}
