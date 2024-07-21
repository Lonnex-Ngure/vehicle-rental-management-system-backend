import db from "../drizzle/db";
import { BookingsTable, UsersTable, VehiclesTable, LocationsTable, TIBooking, TSBooking } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Define the custom type for the booking details we are returning
type BookingWithDetails = Omit<TSBooking, "userId" | "vehicleId" | "locationId" | "createdAt" | "updatedAt"> & {
  user: {
    userId: number;
    fullName: string;
    email: string;
    contactPhone: string;
    address: string;
  };
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
};

export const bookingService = {
  list: async (): Promise<BookingWithDetails[]> => {
    const bookings = await db.query.BookingsTable.findMany({
      columns: {
        bookingId: true,
        bookingDate: true,
        returnDate: true,
        totalAmount: true,
        bookingStatus: true,
 
      },
      with: {
        user: {
          columns: {
            userId: true,
            fullName: true,
            email: true,
            contactPhone: true,
            address: true,
          },
        },
        vehicle: {
          columns: {
            vehicleSpecId: true,
            rentalRate: true,
            availability: true,
          },
        },
        location: {
          columns: {
            locationId: true,
            name: true,
            address: true,
            contactPhone: true,
          },
        },
      },
    });

    return bookings as BookingWithDetails[];
  },
  getById: async (id: number): Promise<BookingWithDetails | undefined> => {
    const booking = await db.query.BookingsTable.findFirst({
      columns: {
        bookingId: true,
        bookingDate: true,
        returnDate: true,
        totalAmount: true,
        bookingStatus: true, 
      },
      where: (bookingsTable) => eq(bookingsTable.bookingId, id),
      with: {
        user: {
          columns: {
            userId: true,
            fullName: true,
            email: true,
            contactPhone: true,
            address: true,
          },
        },
        vehicle: {
          columns: {
            vehicleSpecId: true,
            rentalRate: true,
            availability: true,
          },
        },
        location: {
          columns: {
            locationId: true,
            name: true,
            address: true,
            contactPhone: true,
          },
        },
      },
    });

    return booking as BookingWithDetails | undefined;
  },
  create: async (booking: TIBooking): Promise<TIBooking> => {
    const result = await db
      .insert(BookingsTable)
      .values(booking)
      .returning({
        bookingId: BookingsTable.bookingId,
        bookingDate: BookingsTable.bookingDate,
        returnDate: BookingsTable.returnDate,
        totalAmount: BookingsTable.totalAmount,
        bookingStatus: BookingsTable.bookingStatus,
        userId: BookingsTable.userId,
        vehicleId: BookingsTable.vehicleId,
        locationId: BookingsTable.locationId,
       
      })
      .execute();
    return result[0];
  },
  update: async (id: number, booking: TIBooking): Promise<TIBooking | null> => {
    const result = await db
      .update(BookingsTable)
      .set(booking)
      .where(eq(BookingsTable.bookingId, id))
      .returning({
        bookingDate: BookingsTable.bookingDate,
        returnDate: BookingsTable.returnDate,
        totalAmount: BookingsTable.totalAmount,
        bookingStatus: BookingsTable.bookingStatus,
        userId: BookingsTable.userId,
        vehicleId: BookingsTable.vehicleId,
        locationId: BookingsTable.locationId,
        bookingId: BookingsTable.bookingId
      })
      .execute();
    return result[0] || null;
  },
  delete: async (id: number): Promise<boolean> => {
    const result = await db
      .delete(BookingsTable)
      .where(eq(BookingsTable.bookingId, id))
      .returning({
        bookingId: BookingsTable.bookingId,
      })
      .execute();
    return result.length > 0;
  },
};
