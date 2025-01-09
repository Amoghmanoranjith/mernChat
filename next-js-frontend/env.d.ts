// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        TENOR_API_KEY: string;
        FIREBASE_API_KEY: string;
        FIREBASE_AUTH_DOMAIN: string;
        FIREBASE_PROJECT_ID: string;
        FIREBASE_STORAGE_BUCKET: string;
        FIREBASE_MESSAGING_SENDER_ID: string;
        FIREBASE_APP_ID: string;
        FIREBASE_MEASUREMENT_ID: string;
        FIREBASE_VAPID_KEY: string;
        NEXT_PUBLIC_BASE_URL: string;
        NEXT_PUBLIC_ABSOLUTE_BASE_URL: string;
        CLIENT_URL: string;
    }
}