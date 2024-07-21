import "dotenv/config";
import { createAuthUserService, userLoginService } from "./auth.service";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import { userService } from "../users/users.service";
export const registerUser = async (c) => {
    try {
        const userData = await c.req.json();
        const { password, ...userInfo } = userData;
        const createdUser = await userService.create(userInfo);
        const hashedPassword = await bcrypt.hash(password, 10);
        await createAuthUserService(createdUser.userId, hashedPassword);
        return c.json({ msg: "User registered successfully", user: createdUser }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
export const loginUser = async (c) => {
    try {
        const { email, password } = await c.req.json();
        const userExist = await userLoginService(email, password);
        if (!userExist)
            return c.json({ error: "Invalid credentials" }, 401);
        const payload = {
            sub: userExist.userId.toString(),
            role: userExist.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 180,
        };
        const secret = process.env.JWT_SECRET;
        const token = await sign(payload, secret);
        return c.json({ token, user: { ...userExist, role: userExist.role } }, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
