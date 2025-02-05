"use server";
import { DEFAULT_AVATAR } from "@/constants";
import { prisma } from "@/lib/server/prisma";
import { createSession, deleteSession } from "@/lib/server/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    if (!email || !password) {
      return {
        errors: {
          message: "Invalid Credentails",
        },
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
      };
    }

    if (await bcrypt.compare(password, user.hashedPassword)) {
      await createSession(user.id);
    } else {
      return {
        errors: {
          message: "Invalid Credentials",
        },
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
      data: null,
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
      data: null,
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
    data: newUser,
  };
}

export async function logout(){
  await deleteSession();
  redirect("/");
}
