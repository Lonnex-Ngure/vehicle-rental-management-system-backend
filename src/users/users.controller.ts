import { Context } from "hono";
import { userService } from "./users.service";
import { createAuthUserService } from "../auth/auth.service";

export const listUsers = async (c: Context) => {
  const data = await userService.list();
  if (!data || data.length === 0) {
    return c.text("No users found", 404);
  }
  return c.json(data, 200);
};

export const getUserById = async (c: Context) => {
  const id = c.req.param("id");
  const data = await userService.getById(Number(id));
  if (!data) {
    return c.text("User not found", 404);
  }
  return c.json(data, 200);
};

export const createUser = async (c: Context) => {
  try {
    const userData = await c.req.json();
    const newUser = await userService.create(userData);
    return c.json(newUser, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateUser = async (c: Context) => {
  const id = c.req.param("id");
  const user = await c.req.json();
  const updatedUser = await userService.update(Number(id), user);
  if (!updatedUser) {
    return c.text("User not found", 404);
  }
  return c.json(updatedUser, 200);
};

export const deleteUser = async (c: Context) => {
  const id = c.req.param("id");
  const deleted = await userService.delete(Number(id));
  if (!deleted) {
    return c.text("User not found", 404);
  }
  return c.text("User deleted", 200);
};