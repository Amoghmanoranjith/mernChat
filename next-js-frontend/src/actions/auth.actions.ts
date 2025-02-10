"use server";
import { DEFAULT_AVATAR } from "@/constants";
import { sendEmail } from "@/lib/server/email/SendEmail";
import { prisma } from "@/lib/server/prisma";
import { FetchUserInfoResponse } from "@/lib/server/services/userService";
import { createSession, deleteSession, encrypt } from "@/lib/server/session";
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
  
    const privateKeyRecoveryUrl = `${process.env.CLIENT_URL}/auth/private-key-recovery-token-verification?token=${privateKeyRecoveryToken}`
  
    await sendEmail({emailType:"privateKeyRecovery",to:email,username,verificationUrl:privateKeyRecoveryUrl})
  }
  catch (error) {
    console.log(error);
  }

}
