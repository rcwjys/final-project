import fs from "fs";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load .env

const serviceAccountPath = process.env.FIREBASE_KEY_PATH;

if (!serviceAccountPath) {
  throw new Error("FIREBASE_KEY_PATH not set in .env");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "digital-twin-befa1.appspot.com" // ganti sesuai nama bucket kamu
});

export const bucket = admin.storage().bucket();
