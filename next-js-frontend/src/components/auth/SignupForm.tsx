import { useEncryptPrivateKeyWithUserPassword } from "@/hooks/useAuth/useEncryptPrivateKeyWithUserPassword";
import { useGenerateKeyPairAndReturnThemInJwkFormat } from "@/hooks/useAuth/useGenerateKeyPairAndReturnThemInJwkFormat";
import { useStoreUserKeysInDatabase } from "@/hooks/useAuth/useStoreUserKeysInDatabase";
import type { signupSchemaType } from "@/schemas/auth.schema";
import { signupSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSignup } from "../../hooks/useAuth/useSignup";
import { useUpdateLogin } from "../../hooks/useAuth/useUpdateLogin";
import { FormInput } from "../ui/FormInput";
import { SubmitButton } from "../ui/SubmitButton";
import { AuthRedirectLink } from "./AuthRedirectLink";

export const SignupForm = () => {
  const { signup, isSuccess, data:user, isLoading } = useSignup();
  useUpdateLogin(isSuccess, user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<signupSchemaType>({ resolver: zodResolver(signupSchema) });

  const password = watch("password");

  const {privateKeyJWK,publicKeyJWK} = useGenerateKeyPairAndReturnThemInJwkFormat({user});
  const {encryptedPrivateKey} = useEncryptPrivateKeyWithUserPassword({password,privateKeyJWK,publicKeyJWK});
  const {publicKeyReturnedFromServerAfterBeingStored,userKeysStoredInDatabaseSuccess} = useStoreUserKeysInDatabase({encryptedPrivateKey,publicKeyJWK});


  const onSubmit: SubmitHandler<signupSchemaType> = (data) => {
    const { confirmPassword, ...credentials } = data;
    signup(credentials);
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <FormInput
            name="name"
            autoComplete="name webauthn"
            placeholder="Name"
            register={register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <FormInput
            name="username"
            autoComplete="username"
            placeholder="Username"
            register={register("username")}
            error={errors.username?.message}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <FormInput
            name="email"
            autoComplete="email"
            placeholder="Email"
            register={register("email")}
            error={errors.email?.message}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            register={register("password")}
            error={errors.password?.message}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <FormInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <SubmitButton btnText="Signup" disabled={isLoading} />
          <p className="text-gray-400 font-light">
            By creating this account, you agree that you have read and accepted
            our Terms of Use and Privacy Policy.
          </p>
        </div>
        <AuthRedirectLink
          pageName="Login"
          text="Already a member?"
          to="auth/login"
        />
      </div>
    </form>
  );
};
