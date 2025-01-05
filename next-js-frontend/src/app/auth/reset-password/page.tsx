"use client";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation'

const page = () => {

  const searchParams = useSearchParams()
  const user = searchParams.get('user')
  const token = searchParams.get('token')

  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push("/auth/login");
    }
  }, [token, user,router]);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-3">
        <h3 className="text-4xl text-fluid-h3 font-bold">
          Reset your password
        </h3>
        <p className="text-lg text-fluid-p">
          Once your password is reset you can login with your new password
        </p>
      </div>

      <div>
        {token && user && (
          <ResetPasswordForm token={token as string} user={user as string} />
        )}
      </div>
    </div>
  );
};

export default page;
