import db from "../drizzle/db";
import { CustomerSupportTicketsTable, } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const customerSupportTicketService = {
    list: async () => {
        const tickets = await db.query.CustomerSupportTicketsTable.findMany({
            columns: {
                ticketId: true,
                subject: true,
                description: true,
                status: true,
            },
            with: {
                user: {
                    columns: {
                        userId: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return tickets;
    },
    getById: async (id) => {
        const ticket = await db.query.CustomerSupportTicketsTable.findFirst({
            columns: {
                ticketId: true,
                subject: true,
                description: true,
                status: true,
            },
            where: (ticketsTable) => eq(ticketsTable.ticketId, id),
            with: {
                user: {
                    columns: {
                        userId: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        return ticket;
    },
    create: async (ticket) => {
        const result = await db
            .insert(CustomerSupportTicketsTable)
            .values(ticket)
            .returning({
            ticketId: CustomerSupportTicketsTable.ticketId,
            userId: CustomerSupportTicketsTable.userId,
            subject: CustomerSupportTicketsTable.subject,
            description: CustomerSupportTicketsTable.description,
            status: CustomerSupportTicketsTable.status,
        })
            .execute();
        return result[0];
    },
    update: async (id, ticket) => {
        const result = await db
            .update(CustomerSupportTicketsTable)
            .set(ticket)
            .where(eq(CustomerSupportTicketsTable.ticketId, id))
            .returning({
            ticketId: CustomerSupportTicketsTable.ticketId,
            userId: CustomerSupportTicketsTable.userId,
            subject: CustomerSupportTicketsTable.subject,
            description: CustomerSupportTicketsTable.description,
            status: CustomerSupportTicketsTable.status,
        })
            .execute();
        return result[0] || null;
    },
    delete: async (id) => {
        const result = await db
            .delete(CustomerSupportTicketsTable)
            .where(eq(CustomerSupportTicketsTable.ticketId, id))
            .returning({
            ticketId: CustomerSupportTicketsTable.ticketId,
        })
            .execute();
        return result.length > 0;
    },
};
