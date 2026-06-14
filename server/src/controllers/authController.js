import { users } from "../db/schema.js";
import admin from "../lib/firebase.js";
import { db } from "../lib/db.js";
import { eq } from "drizzle-orm";
export const syncUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);

        const firebaseUid = decoded.uid;

        // Create a Firebase Session Cookie
        const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days
        const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.firebaseUid, firebaseUid));
        if (existingUser.length > 0) {
            console.log("User already exists");
            existingUser[0].newuser = false;
            // console.log(existingUser);
            res.cookie("auth_token", sessionCookie, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: expiresIn,
            });
            console.log(existingUser[0]);
            return res.json({
                message: "Login successful",
                user: existingUser[0],
            });
        }
        const user = await db
            .insert(users)
            .values({
                email: decoded.email,
                name: decoded.name,
                phone: decoded.phone_number,
                avatar: decoded.avatar,
                firebaseUid: firebaseUid,
            })
            .returning();
        console.log("login successful");
        res.cookie("auth_token", sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresIn,
        });
        user[0].newuser = true;
        console.log(user[0]);
        return res.json({ message: "Login successful", user: user[0] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error syncing user" });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error logging out" });
    }
};
export const getMe = async (req, res) => {
    const userId = req.user.uid;
    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.firebaseUid, userId));
        return res.json({ user: user[0] });
    } catch (error) {
        return res.status(500).json({ message: "Error getting user" });
    }
};
