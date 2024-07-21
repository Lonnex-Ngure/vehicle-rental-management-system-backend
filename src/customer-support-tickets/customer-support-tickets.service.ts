import db from "../drizzle/db";
import {
  CustomerSupportTicketsTable,
  UsersTable,
  TICustomerSupportTicket,
  TSCustomerSupportTicket,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

type TicketWithUser = Omit<TSCustomerSupportTicket, "createdAt" | "updatedAt"> & {
  user: {
    userId: number;
    fullName: string;
    email: string;
  };
};

export const customerSupportTicketService = {
  list: async (): Promise<TicketWithUser[]> => {
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

    return tickets as TicketWithUser[];
  },

  getById: async (id: number): Promise<TicketWithUser | undefined> => {
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

    return ticket as TicketWithUser | undefined;
  },

  create: async (ticket: TICustomerSupportTicket): Promise<TICustomerSupportTicket> => {
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

  update: async (id: number, ticket: TICustomerSupportTicket): Promise<TICustomerSupportTicket | null> => {
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

  delete: async (id: number): Promise<boolean> => {
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