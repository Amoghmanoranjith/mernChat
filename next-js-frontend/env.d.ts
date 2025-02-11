// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_TENOR_API_KEY: string;
        NEXT_PUBLIC_FIREBASE_API_KEY: string;
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
        NEXT_PUBLIC_FIREBASE_APP_ID: string;
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
        NEXT_PUBLIC_FIREBASE_VAPID_KEY: string;
        NEXT_PUBLIC_BASE_URL: string;
        NEXT_PUBLIC_ABSOLUTE_BASE_URL: string;
        SESSION_SECRET:string;
        NEXT_PUBLIC_CLIENT_URL: string;
        EMAIL:string;
        PASSWORD:string;
        PRIVATE_KEY_RECOVERY_SECRET:string;
    }
}