'use client';
import { useConvertPrivateAndPublicKeyInJwkFormat } from '@/hooks/useAuth/useConvertPrivateAndPublicKeyInJwkFormat';
import { useEncryptPrivateKeyWithUserPassword } from '@/hooks/useAuth/useEncryptPrivateKeyWithUserPassword';
import { useGenerateKeyPair } from '@/hooks/useAuth/useGenerateKeyPair';
import { useStoreUserKeysInDatabase } from '@/hooks/useAuth/useStoreUserKeysInDatabase';
import { useStoreUserPrivateKeyInIndexedDB } from '@/hooks/useAuth/useStoreUserPrivateKeyInIndexedDB';
import { useUpdateLoggedInUserPublicKeyInState } from '@/hooks/useAuth/useUpdateLoggedInUserPublicKeyInState';
import { useUpdateLoggedInUserState } from '@/hooks/useAuth/useUpdateLoggedInUserState';
import { useVerifyOAuthToken } from '@/hooks/useAuth/useVerifyOAuthToken';
import { useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated } from '@/hooks/useUtils/useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated';
import { useSearchParams } from 'next/navigation';

import { Suspense, useEffect, useState } from 'react';

function OAuthRedirectPageContent(){

  const searchParams = useSearchParams()
  const token = searchParams.get('token');

  useRedirectUserToHomepageAfterLoggedInUserStateIsPopulated();
  
  const {verifyOAuthToken,isTokenVerificationSucessfull,data} = useVerifyOAuthToken()
  useUpdateLoggedInUserState({isSuccess:isTokenVerificationSucessfull,user:data?.user})

  const [isOAuthNewUser,setOAuthNewUser] = useState<boolean>(false);

  useEffect(()=>{
    if(token){
      verifyOAuthToken({token});
    }
  },[token, verifyOAuthToken])

  useEffect(()=>{
    if(data && isTokenVerificationSucessfull){
      // basically oAuth users dont have a password
      // so whenever any user registers via OAuth (i.e make a new account via OAuth)
      // so like the normal flow we need to generate their key pairs and store them in database
      // but in normal flow we encrypt the user private key with their password and then store it in database
      // but in OAuth flow we dont have a password for the user, so we use a "combinedSecret" which is a combination of their googleId and a secret
      // so we use this "combinedSecret" as their password to encrypt their private key and then store it in database

      // so basically for this OAuth flow we only need to generate keys for that user if combinedSecret is sent to us
      // as combinedSecret is only sent by the server when the user is a new user
      
      if(data.combinedSecret){
        setOAuthNewUser(true);
      }
    }
  },[data,isTokenVerificationSucessfull])


  // as discussed above, we are using the "combinedSecret" as the password to encrypt the private key for OAuth users
  const password  = data?.combinedSecret;

  // and this generate key pair for the user will be called only if the user is a new user
  // and rest of all the flow is dependent on this "useGenerateKeyPair" hook
  

  // so if "isOAuthNewUser is false", then the keys will not be generated and the rest of the flow will not be executed
  const {privateKey,publicKey} = useGenerateKeyPair({user:isOAuthNewUser});
  const {privateKeyJWK,publicKeyJWK} = useConvertPrivateAndPublicKeyInJwkFormat({privateKey,publicKey});
  const {encryptedPrivateKey} = useEncryptPrivateKeyWithUserPassword({password,privateKeyJWK});
  const {publicKeyReturnedFromServerAfterBeingStored,userKeysStoredInDatabaseSuccess} = useStoreUserKeysInDatabase({encryptedPrivateKey,publicKeyJWK});
  useStoreUserPrivateKeyInIndexedDB({privateKey:privateKeyJWK,userKeysStoredInDatabaseSuccess,userId:data?.user._id});
  useUpdateLoggedInUserPublicKeyInState({publicKey:publicKeyReturnedFromServerAfterBeingStored})
  
  return (
    <div className="bg-background w-full h-full text-text text-xl">Redirecting...</div>
  )
}

export default function Page(){
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthRedirectPageContent/>
    </Suspense>
  )
}