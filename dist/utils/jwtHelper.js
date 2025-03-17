import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../env.js";
export const signToken = (payload, expireIn) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expireIn });
};
export const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return payload;
    }
    catch (err) {
        return null;
    }
};
