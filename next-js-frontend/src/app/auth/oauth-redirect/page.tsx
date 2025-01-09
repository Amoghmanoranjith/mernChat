'use client';
import { useGenerateKeyPair } from '@/hooks/useAuth/useGenerateKeyPair';
import { useVerifyOAuthToken } from '@/hooks/useAuth/useVerifyOAuthToken';
import { User } from '@/interfaces/auth.interface';
import { selectLoggedInUser, updateLoggedInUser } from '@/services/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store/hooks';
import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

export default function Page(){

  const searchParams = useSearchParams()
  const token = searchParams.get('token');

  const router = useRouter();

  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);

  useEffect(()=>{
    if(loggedInUser){
      router.replace("/");
    }
  },[loggedInUser])

  const {verifyOAuthToken,isTokenVerificationSucessfull,data,isLoading} = useVerifyOAuthToken()

  useEffect(()=>{
    if(token) verifyOAuthToken({token})
  },[token])

  
    const updateLoggedInUserState = (publicKey?:string)=>{
        if(data?.user){
            let loggedInUserData:User
            loggedInUserData = data.user
            if(publicKey) loggedInUserData = {...loggedInUserData,publicKey}
            dispatch(updateLoggedInUser(loggedInUserData))
        }
    }
    useEffect(()=>{
        if(!isLoading && data && isTokenVerificationSucessfull && !data.combinedSecret){
             // in normal flow we encrypt the private key
            // if combined secret is not present then it means the user already exists
            updateLoggedInUserState()
        }
    },[data,isTokenVerificationSucessfull,isLoading])

    useGenerateKeyPair(data?.combinedSecret?.length?true:false,data?.user._id,data?.combinedSecret,updateLoggedInUserState)

  useEffect(()=>{

  },[isTokenVerificationSucessfull])



  return (
    <div className="bg-background w-full h-full text-text text-xl">Redirecting...</div>
  )
}