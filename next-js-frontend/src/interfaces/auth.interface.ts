export interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  publicKey: string;
  createdAt: Date;
  updatedAt: Date;
  verified?: boolean;
  notificationsEnabled: boolean;
  verificationBadge: boolean;
  lastSeen: Date;
  fcmTokenExists: boolean;
  oAuthSignup: boolean;
}

export interface Auth {
  loggedInUser: User | null;
}

export interface ResetPassword {
  token: string;
  userId: string;
  newPassword: string;
}

export interface Otp {
  otp: string;
}
