"use server";
import { DEFAULT_AVATAR } from "@/constants";
import { sendEmail } from "@/lib/server/email/SendEmail";
import { prisma } from "@/lib/server/prisma";
import { FetchUserInfoResponse } from "@/lib/server/services/userService";
import { createSession, decrypt, deleteSession, encrypt } from "@/lib/server/session";
import bcrypt from "bcryptjs";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    if (!email || !password) {
      return {
        errors: {
          message: "Invalid Credentails",
        },
        redirect:false
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        errors: {
          message: "Invalid Credentials",
        },
        redirect:false,
      };
    }

    if (await bcrypt.compare(password, user.hashedPassword)) {
      await createSession(user.id);
      return {
        errors: {
          message:null,
        },
        redirect: true,
      }
    } else {
      return {
        errors: {
          message: "Invalid Credentials",
        },
        redirect:false,
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function signup(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      errors: {
        message: "User already exists",
      },
    };
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    return {
      errors: {
        message: "Username is already taken",
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      username,
      avatar: DEFAULT_AVATAR,
      name,
    },
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      emailVerified: true,
      publicKey: true,
      notificationsEnabled: true,
      verificationBadge: true,
      fcmToken: true,
      oAuthSignup: true,
    },
  });

  await createSession(newUser.id);

  return {
    errors: null,
    data:newUser
  };
}

export async function logout(){
  await deleteSession();
}

export async function sendPrivateKeyRecoveryEmail(prevState:any,user:Pick<FetchUserInfoResponse, "id" | "email" | "username">){

  try {
    const {email,id,username} = user;

    const privateKeyRecoveryToken =  await encrypt({userId:id,expiresAt:new Date(Date.now()+1000*60*60*24*30)});
    const privateKeyRecoveryHashedToken = await bcrypt.hash(privateKeyRecoveryToken,10);
  
    await prisma.privateKeyRecoveryToken.deleteMany({
      where:{userId:id}
    })
    await prisma.privateKeyRecoveryToken.create({
      data:{userId:id,hashedToken:privateKeyRecoveryHashedToken,expiresAt:new Date(Date.now()+1000*60*60*24*30)}
    })
  
    const privateKeyRecoveryUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/private-key-recovery-token-verification?token=${privateKeyRecoveryToken}`
  
    await sendEmail({emailType:"privateKeyRecovery",to:email,username,verificationUrl:privateKeyRecoveryUrl})
    return {
      errors:{
        message:null
      },
      success:{
        message:"Private key recovery email sent successfully"
      }
    }
  }
  catch (error) {
    console.log('error sending private key recovery email',error);
    return {
      errors:{
        message:"Error sending private key recovery email"
      },
      success:{
        message:null
      }
    }
  }

}

export async function verifyPrivateKeyRecoveryToken(prevState:any,data:{recoveryToken:string,userId:string}){
  try {
    
    const recoveryTokenExists =  await prisma.privateKeyRecoveryToken.findFirst({
        where:{userId:data.userId}
    })

    if(!recoveryTokenExists){
        return {
            errors:{
                message:'Verification link is not valid'
            },
            data:null
        }
    }

    if(recoveryTokenExists.expiresAt < new Date){
        return {
            errors:{
                message:'Verification link has expired'
            },
            data:null
        }
    }
    
    if(!(await bcrypt.compare(data.recoveryToken,recoveryTokenExists.hashedToken))){
        return {
            errors:{
                message:'Verification link is not valid'
            },
            data:null
        }
    }
    const decodedData = await decrypt(data.recoveryToken);
    
    if(decodedData.userId !== data.userId){
        return {
            errors:{
                message:'Verification link is not valid'
            },
            data:null
        }
    }

    const user = await prisma.user.findUnique({where:{id:data.userId},select:{id:true,privateKey:true,oAuthSignup:true,googleId:true}});

    if(!user){
        return {
            errors:{
                message:'User not found, verification link is not valid'
            },
            data:null
        }
    }

    const payload:{privateKey?:string,combinedSecret?:string} = {
        privateKey:user.privateKey!
    }

    if(user.oAuthSignup) payload['combinedSecret'] = user.googleId+process.env.PRIVATE_KEY_RECOVERY_SECRET;

    await prisma.privateKeyRecoveryToken.deleteMany({where:{userId:data.userId}})

    return {
        errors:{
            message:null
        },
        data:payload
    }

  } catch (error) {
    console.log('error verifying private key recovery token',error);
    return {
        errors:{
            message:'Error verifying private key recovery token'
        },
        data:null
    }
  }
}

export async function verifyPassword(prevState:any,data:{userId:string,password:string}){

  try {

    const {password,userId} = data;

    const user =  await prisma.user.findUnique({where:{id:userId}});

    if(!user){
      return {
        errors:{
          message:'User not found'
        },
        success:{
          message:null
        }
      }
    }

    if(!await bcrypt.compare(password,user.hashedPassword)){
      return {
        errors:{
          message:'Invalid password'
        },
        success:{
          message:null
        }
      }
    }

    const privateKeyRecoveryToken =  await encrypt({userId,expiresAt:new Date(Date.now()+1000*60*60*24*30)});
    const privateKeyRecoveryHashedToken = await bcrypt.hash(privateKeyRecoveryToken,10);
  
    await prisma.privateKeyRecoveryToken.deleteMany({
      where:{userId}
    })
    await prisma.privateKeyRecoveryToken.create({
      data:{userId,hashedToken:privateKeyRecoveryHashedToken,expiresAt:new Date(Date.now()+1000*60*60*24*30)}
    })
  
    const privateKeyRecoveryUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/private-key-recovery-token-verification?token=${privateKeyRecoveryToken}`
    await sendEmail({emailType:"privateKeyRecovery",to:user.email,username:user.username,verificationUrl:privateKeyRecoveryUrl})

    return {
      errors:{
        message:null
      },
      success:{
        message:`Private key recovery email sent successfully on ${user.email}`
      }
    }

  }
  catch (error) {
    console.log('error verifying password',error);
    return {
      errors:{
        message:'Error verifying password'
      },
      success:{
        message:null
      }
    }
  }

}

export async function verifyOAuthToken(prevState:any,token:string){

  try {
    
    const decodedInfo =  await decrypt(token) as {user:string,oAuthNewUser:boolean}
    const {oAuthNewUser,user} = decodedInfo;
    
    const existingUser =  await prisma.user.findUnique({
        where:{id:user},
        select:{
            id:true,
            googleId:true,
        }
    })
    if(!existingUser){
        return {
            errors:{
                message:'User not found'
            },
            data:null
        }
    }
    
    await createSession(existingUser.id);
  
    const responsePayload:{combinedSecret?:string,user:{id:string}} = {user:{id:existingUser.id}};
  
    if(oAuthNewUser){
        const combinedSecret = existingUser.googleId+process.env.PRIVATE_KEY_RECOVERY_SECRET;
        responsePayload['combinedSecret'] = combinedSecret
    }

    return {
      errors:{
        message:null
      },
      data:responsePayload
    }

  } catch (error) {
    console.log('error verifying oAuth token',error);
    return {
      errors:{
        message:'Error verifying oAuth token'
      },
      data:null
    }
  }
}
