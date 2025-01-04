export const LoginForm = () => {
  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <FormInput
            autoComplete="email webauthn"
            placeholder="Email"
            register={register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <FormInput
            type="password"
            autoComplete="current-password webauthn"
            placeholder="Password"
            register={register("password")}
            error={errors.password?.message}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <SubmitButton disabled={isLoading} btnText="Login" />
        </div>

        <div className="flex justify-between items-center flex-wrap gap-1">
          <AuthRedirectLink
            pageName="Signup"
            text="Already a member?"
            to="auth/signup"
          />
          <AuthRedirectLink
            pageName="forgot password"
            text="Need Help?"
            to="auth/forgot-password"
          />
        </div>
      </div>
    </form>
  );
};
