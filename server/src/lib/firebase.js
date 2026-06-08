import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./demon-bar.json", "utf8"));

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase initialized");
} catch (err) {
    console.error(err);
}

export default admin;
