"use client";

import { sendOtp } from "@/actions/auth.actions";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { CircleLoading } from "../shared/CircleLoading";
import { OtpVerificationForm } from "./OtpVerificationForm";

type PropTypes = {
  email: string;
  loggedInUserId: string;
  username: string;
}

export const OtpVerification = ({email,loggedInUserId,username}:PropTypes) => {

  const [state,sendOtpAction] = useActionState(sendOtp,undefined);

  useEffect(()=>{
    if(state?.errors.message?.length) toast.error(state.errors.message);
    if(state?.success.message?.length) toast.success(state.success.message);
  },[state])

  const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    startTransition(()=>{
      sendOtpAction({email,loggedInUserId,username});
    })
  }

  return (
    state?.success.message?.length ? (
      <OtpVerificationForm loggedInUserId={loggedInUserId}/>
    )
    :
    (
    <form onSubmit={handleSubmit}>
      <SubmitButton/>
    </form>
    )
  );
};

function SubmitButton(){

  const {pending} = useFormStatus();

  return (
    <button
    disabled={pending}
    type="submit"
    className={`${pending?"bg-transparent":"bg-primary"} px-6 py-2 rounded-sm max-sm:w-full`}
  >
    {pending ? <CircleLoading/> : "Get OTP"}
  </button>
  )
}
