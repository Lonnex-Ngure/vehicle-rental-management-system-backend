import db from "../drizzle/db";
import {
  AuthenticationTable,
  UsersTable,
  TIAuthentication,
  TSAuthentication,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

type AuthenticationWithUser = Omit<TSAuthentication, "createdAt" | "updatedAt"> & {
  user: {
    fullName: string;
    email: string;
    role: string;
  };
};

export const authenticationService = {
  list: async (): Promise<AuthenticationWithUser[]> => {
    const authentications = await db.query.AuthenticationTable.findMany({
      columns: {
        userId: true,
        password: true,
      },
      with: {
        user: {
          columns: {
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return authentications as AuthenticationWithUser[];
  },

  getById: async (id: number): Promise<AuthenticationWithUser | undefined> => {
    const authentication = await db.query.AuthenticationTable.findFirst({
      columns: {
        userId: true,
        password: true,
      },
      where: (authenticationTable) => eq(authenticationTable.authId, id),
      with: {
        user: {
          columns: {
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return authentication as AuthenticationWithUser | undefined;
  },

  create: async (authentication: TIAuthentication): Promise<TIAuthentication> => {
    const result = await db
      .insert(AuthenticationTable)
      .values(authentication)
      .returning({
        authId: AuthenticationTable.authId,
        userId: AuthenticationTable.userId,
        password: AuthenticationTable.password,
      })
      .execute();
    return result[0];
  },

  update: async (id: number, authentication: TIAuthentication): Promise<TIAuthentication | null> => {
    const result = await db
      .update(AuthenticationTable)
      .set(authentication)
      .where(eq(AuthenticationTable.authId, id))
      .returning({
        authId: AuthenticationTable.authId,
        userId: AuthenticationTable.userId,
        password: AuthenticationTable.password,
      })
      .execute();
    return result[0] || null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await db
      .delete(AuthenticationTable)
      .where(eq(AuthenticationTable.authId, id))
      .returning({
        authId: AuthenticationTable.authId,
      })
      .execute();
    return result.length > 0;
  },
};