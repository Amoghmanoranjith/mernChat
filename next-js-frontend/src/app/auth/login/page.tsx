import { LoginForm } from "@/components/auth/LoginForm";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Metadata } from "next";

export const metadata:Metadata = {  // ✅ Corrected name
  title: "Login - Mernchat",
  description: "Securely log in to Mernchat, a privacy-focused encrypted chat app.",
  keywords: ["Mernchat login", "secure chat login", "encrypted messaging", "private chat login", "end-to-end encryption login"],
  openGraph: {
    title: "Login - Mernchat",
    description: "Securely log in to Mernchat, a privacy-focused encrypted chat app.",
    url: "https://mernchat.in/auth/login",
    siteName: "Mernchat",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login - Mernchat",
    description: "Securely log in to Mernchat, a privacy-focused encrypted chat app.",
  },
};

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
