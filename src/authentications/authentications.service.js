import db from "../drizzle/db";
import { AuthenticationTable, } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const authenticationService = {
    list: async () => {
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
        return authentications;
    },
    getById: async (id) => {
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
        return authentication;
    },
    create: async (authentication) => {
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
    update: async (id, authentication) => {
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
    delete: async (id) => {
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
