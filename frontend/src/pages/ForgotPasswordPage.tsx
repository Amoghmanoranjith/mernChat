import { AuthRedirectLink } from "../components/auth/AuthRedirectLink"
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm"


export const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col gap-y-6">

        <div className="flex flex-col gap-y-3">
            <h4 className="text-4xl text-fluid-h4 font-bold">Let us help you</h4>
            <p className="text-lg text-fluid-p">You'll receive a password reset link if your email is registered with us</p>
        </div>

        <div>
            <ForgotPasswordForm/>
        </div>

        <AuthRedirectLink
          pageName="Login"
          text="Go back?"
          to="auth/login"
        />
    </div>

  )
}
