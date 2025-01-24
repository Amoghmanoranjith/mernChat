import { useStoreLoggedInUserInfoInLocalStorageIfCorrectPasswordIsEntered } from "@/hooks/useAuth/useStoreLoggedInUserInfoInLocalStorageIfCorrectPasswordIsEntered";
import { useStorePasswordInLocalStorageIfCorrectPasswordIsEntered } from "@/hooks/useAuth/useStorePasswordInLocalStorageIfCorrectPasswordIsEntered";
import { useVerifyPassword } from "@/hooks/useAuth/useVerifyPassword";
import { User } from "@/interfaces/auth.interface";
import { keyRecoverySchema, keyRecoverySchemaType } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CircleLoading } from "../shared/CircleLoading";
import { FormInput } from "../ui/FormInput";

type PropTypes = {
    loggedInUser: User | null;
}

export const RecoveryOptionsForManualSignedUpUser = ({loggedInUser}:PropTypes) => {

  const {verifyPassword,isLoading,isSuccess} = useVerifyPassword();

  const { register, handleSubmit,watch ,formState: { errors }} = useForm<keyRecoverySchemaType>({resolver:zodResolver(keyRecoverySchema)})
  const onSubmit: SubmitHandler<keyRecoverySchemaType> = ({password}) => verifyPassword({password});

  useStorePasswordInLocalStorageIfCorrectPasswordIsEntered({isSuccess,passwordRef:watch("password")});
  useStoreLoggedInUserInfoInLocalStorageIfCorrectPasswordIsEntered({isSuccess,loggedInUser});

  return (    
        isSuccess ? 
        (
            <h2 className="text font-bold bg-background p-4 rounded-md">
                We have sent an verification email, please check spam if not received
            </h2>
        )
        : 
        (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                <div className='flex flex-col gap-y-2'>
                    <FormInput
                        register={{...register("password")}}
                        autoComplete='current-password webauthn'
                        placeholder='Password'
                        type='password'
                        error={errors.password?.message}
                    />
                </div>              
                <button type='submit' className={`bg-primary px-14 py-2 self-center rounded-sm ${isLoading?'bg-transparent':""}`}>
                {isLoading ? <CircleLoading size='6'/> : "Verify Password"}
                </button>
            </form>
        )
    )
}
