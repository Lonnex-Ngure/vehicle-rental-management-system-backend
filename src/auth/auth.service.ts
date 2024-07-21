import { UsersTable, AuthenticationTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const createAuthUserService = async (userId: number, hashedPassword: string) => {
  await db.insert(AuthenticationTable).values({
    userId,
    password: hashedPassword,
  }).execute();
};

export const userLoginService = async (email: string, password: string) => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.email, email),
  });

  if (!user) return null;

  const auth = await db.query.AuthenticationTable.findFirst({
    where: eq(AuthenticationTable.userId, user.userId),
  });

  if (!auth) return null;

  const passwordMatch = await bcrypt.compare(password, auth.password);
  if (!passwordMatch) return null;

  return user;
};
