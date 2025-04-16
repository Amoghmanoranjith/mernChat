import admin from "firebase-admin";
import fs from "fs";
const credentials = JSON.parse(fs.readFileSync("D:/Programming/wp/nextjs-chat-app/backend/build/firebase-admin-cred.json", "utf-8"));
// Define the type for serviceAccount
const serviceAccount = {
    projectId: credentials.project_id,
    privateKey: credentials.private_key,
    clientEmail: credentials.client_email,
};
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
export const messaging = admin.messaging();

