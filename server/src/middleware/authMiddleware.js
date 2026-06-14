import admin from "../lib/firebase.js";

export const loginAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        const decoded = await admin.auth().verifyIdToken(token);

        req.user = decoded;
        // console.log(decoded);

        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const verifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = await admin.auth().verifySessionCookie(token, true);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Session verification failed:", error);
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        return res.status(401).json({ message: "Unauthorized" });
    }
};
