'use client';
import { useConvertPrivateAndPublicKeyInJwkFormat } from "@/hooks/useAuth/useConvertPrivateAndPublicKeyInJwkFormat";
import { useEncryptPrivateKeyWithUserPassword } from "@/hooks/useAuth/useEncryptPrivateKeyWithUserPassword";
import { useGenerateKeyPair } from "@/hooks/useAuth/useGenerateKeyPair";
import { useStoreUserKeysInDatabase } from "@/hooks/useAuth/useStoreUserKeysInDatabase";
import { useStoreUserPrivateKeyInIndexedDB } from "@/hooks/useAuth/useStoreUserPrivateKeyInIndexedDB";
import { useUpdateLoggedInUserPublicKeyInState } from "@/hooks/useAuth/useUpdateLoggedInUserPublicKeyInState";
import { useUpdateLoggedInUserState } from "@/hooks/useAuth/useUpdateLoggedInUserState";
import { useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated } from "@/hooks/useUtils/useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated";
import type { signupSchemaType } from "@/schemas/auth.schema";
import { signupSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSignup } from "../../hooks/useAuth/useSignup";
import { FormInput } from "../ui/FormInput";
import { SubmitButton } from "../ui/SubmitButton";
import { AuthRedirectLink } from "./AuthRedirectLink";

export const SignupForm = () => {
  const { signup, isSuccess, data:user, isLoading } = useSignup();
  useUpdateLoggedInUserState({user,isSuccess});
  useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<signupSchemaType>({ resolver: zodResolver(signupSchema) });

  const password = watch("password");

  const {privateKey,publicKey} = useGenerateKeyPair({user});
  const {privateKeyJWK,publicKeyJWK} = useConvertPrivateAndPublicKeyInJwkFormat({privateKey,publicKey});
  const {encryptedPrivateKey} = useEncryptPrivateKeyWithUserPassword({password,privateKeyJWK});
  const {publicKeyReturnedFromServerAfterBeingStored,userKeysStoredInDatabaseSuccess} = useStoreUserKeysInDatabase({encryptedPrivateKey,publicKeyJWK});
  useStoreUserPrivateKeyInIndexedDB({privateKey:privateKeyJWK,userKeysStoredInDatabaseSuccess,userId:user?._id});
  useUpdateLoggedInUserPublicKeyInState({publicKey:publicKeyReturnedFromServerAfterBeingStored})

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
          <SubmitButton btnText="Signup" isLoading={isLoading}/>
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
