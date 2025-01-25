'use client';
import { useNavigateToLoginPageOnResetPasswordSuccessOrError } from "@/hooks/useAuth/useNavigateToLoginPageOnResetPasswordSuccessOrError";
import { resetPasswordSchema, resetPasswordSchemaType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useResetPassword } from "../../hooks/useAuth/useResetPassword";
import { FormInput } from "../ui/FormInput";
import { SubmitButton } from "../ui/SubmitButton";

type PropTypes = {
    token:string,
}

export const ResetPasswordForm = ({token}:PropTypes) => {

  const {resetPassword,isLoading,isError,isSuccess} = useResetPassword()

  const { register, handleSubmit, formState: { errors } } = useForm<resetPasswordSchemaType>({resolver:zodResolver(resetPasswordSchema)})

  const onSubmit: SubmitHandler<resetPasswordSchemaType> = ({newPassword}) => resetPassword({newPassword,token});

  useNavigateToLoginPageOnResetPasswordSuccessOrError({isError,isSuccess});

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <FormInput
          type="password"
          placeholder="New password"
          register={{...register("newPassword")}}
          error={errors.newPassword?.message}
          />
        <FormInput
          type="password"
          placeholder="Confirm new password"
          register={{...register("confirmPassword")}}
          error={errors.confirmPassword?.message}
          />
        <SubmitButton isLoading={isLoading} btnText="Update Password"/>
    </form>
  )
}
