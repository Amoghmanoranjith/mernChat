"use client";
import {
  forgotPasswordSchema,
  forgotPasswordSchemaType,
} from "@/lib/shared/zod/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useForgotPassword } from "../../hooks/useAuth/useForgotPassword";
import { SubmitButton } from "../ui/SubmitButton";

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { forgotPassword, isLoading } = useForgotPassword();

  const onSubmit: SubmitHandler<forgotPasswordSchemaType> = ({ email }) => {
    forgotPassword({ email });
    setValue("email", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <input
        {...register("email")}
        className="p-3 rounded outline outline-1 outline-secondary-dark text-text bg-background hover:outline-primary"
        placeholder="Registered Email"
      />
      {errors.email?.message && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      <SubmitButton
        isLoading={isLoading}
        btnText="Send reset link"
      ></SubmitButton>
    </form>
  );
};
