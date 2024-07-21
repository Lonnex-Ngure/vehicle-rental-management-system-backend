import "dotenv/config";
import { verify } from "hono/jwt";
export const verifyToken = async (token, secret) => {
    try {
        const decoded = await verify(token, secret);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
export const authMiddleware = async (c, next, requiredRole) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
        return c.json({ error: "Token not provided" }, 401);
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    if (!decoded)
        return c.json({ error: "Invalid token" }, 401);
    if (decoded.role !== requiredRole)
        return c.json({ error: "Unauthorized" }, 403);
    return next();
};
export const adminRoleAuth = async (c, next) => await authMiddleware(c, next, "admin");
export const userRoleAuth = async (c, next) => await authMiddleware(c, next, "user");
