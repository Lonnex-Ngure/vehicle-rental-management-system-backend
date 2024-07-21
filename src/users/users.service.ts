import db from "../drizzle/db";
import {
  UsersTable,
  BookingsTable,
  CustomerSupportTicketsTable,
  VehiclesTable,
  LocationsTable,
  TIUser,
  TSUser,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

type UserWithDetails = Omit<TSUser, "userId" | "createdAt" | "updatedAt"> & {
  bookings: {
    bookingDate: Date;
    returnDate: Date;
    totalAmount: number;
    bookingStatus: string;
    vehicle: {
      vehicleSpecId: number;
      rentalRate: number;
      availability: boolean;
    };
    location: {
      name: string;
      address: string;
      contactPhone: string;
    };
  }[];
  customerSupportTickets: {
    subject: string;
    description: string;
    status: string;
  }[];
};

export const userService = {
  list: async (): Promise<UserWithDetails[]> => {
    const users = await db.query.UsersTable.findMany({
      columns: {
        userId: true,
        fullName: true,
        email: true,
        contactPhone: true,
        address: true,
        role: true,
      },
      with: {
        bookings: {
          columns: {
            bookingDate: true,
            returnDate: true,
            totalAmount: true,
            bookingStatus: true,
          },
          with: {
            vehicle: {
              columns: {
                vehicleSpecId: true,
                rentalRate: true,
                availability: true,
              },
            },
            location: {
              columns: {
                name: true,
                address: true,
                contactPhone: true,
              },
            },
          },
        },
        customerSupportTickets: {
          columns: {
            subject: true,
            description: true,
            status: true,
          },
        },
      },
    });

    return users as UserWithDetails[];
  },
  getById: async (id: number): Promise<TIUser | undefined> => {
    return await db.query.UsersTable.findFirst({
      columns: {
        userId: true,
        fullName: true,
        email: true,
        contactPhone: true,
        address: true,
        role: true,
      },
      where: (usersTable) => eq(usersTable.userId, id),
      with: {
        bookings: {
          columns: {
            bookingDate: true,
            returnDate: true,
            totalAmount: true,
            bookingStatus: true,
          },
          with: {
            vehicle: {
              columns: {
                vehicleSpecId: true,
                rentalRate: true,
                availability: true,
              },
            },
            location: {
              columns: {
                name: true,
                address: true,
                contactPhone: true,
              },
            },
          },
        },
        customerSupportTickets: {
          columns: {
            subject: true,
            description: true,
            status: true,
          },
        },
      },
    });
  },
  create: async (user: TIUser): Promise<TIUser> => {
    const result = await db
      .insert(UsersTable)
      .values(user)
      .returning({
        userId: UsersTable.userId,
        fullName: UsersTable.fullName,
        email: UsersTable.email,
        contactPhone: UsersTable.contactPhone,
        address: UsersTable.address,
        role: UsersTable.role,
      })
      .execute();
    return result[0];
  },
  update: async (id: number, user: TIUser): Promise<TIUser | null> => {
    const result = await db
      .update(UsersTable)
      .set(user)
      .where(eq(UsersTable.userId, id))
      .returning({
        userId: UsersTable.userId,
        fullName: UsersTable.fullName,
        email: UsersTable.email,
        contactPhone: UsersTable.contactPhone,
        address: UsersTable.address,
        role: UsersTable.role,
      })
      .execute();
    return result[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const result = await db
      .delete(UsersTable)
      .where(eq(UsersTable.userId, id))
      .returning({
        userId: UsersTable.userId,
      })
      .execute();
    return result.length > 0;
  },
};