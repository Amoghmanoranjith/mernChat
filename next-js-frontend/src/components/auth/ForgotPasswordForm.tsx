'use client';
import { FormInput } from "../ui/FormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForgotPassword } from "../../hooks/useAuth/useForgotPassword"
import { SubmitButton } from "../ui/SubmitButton"
import { forgotPasswordSchema, forgotPasswordSchemaType } from "@/schemas/auth.schema"
import { SubmitHandler, useForm } from "react-hook-form"

export const ForgotPasswordForm = () => {

    const { register, handleSubmit,formState: { errors } ,setValue} = useForm<forgotPasswordSchemaType>({resolver:zodResolver(forgotPasswordSchema)})

    const {forgotPassword,isLoading} = useForgotPassword()

    const onSubmit: SubmitHandler<forgotPasswordSchemaType> = ({email})=>{
        forgotPassword({email})
        setValue("email",'')
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <FormInput
          autoComplete="email"
          placeholder="Registered email"
          register={{...register("email")}}
          error={errors.email?.message}
          />
        <SubmitButton isLoading={isLoading} btnText="Send reset link"></SubmitButton>
    </form>
  )
}
