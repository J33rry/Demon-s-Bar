import admin from "../lib/firebase.js";

export const verifyAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        const decoded = await admin.auth().verifyIdToken(token);

        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
