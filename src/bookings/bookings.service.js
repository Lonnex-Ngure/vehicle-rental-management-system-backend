import db from "../drizzle/db";
import { BookingsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const bookingService = {
    list: async () => {
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
        return bookings;
    },
    getById: async (id) => {
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
        return booking;
    },
    create: async (booking) => {
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
    update: async (id, booking) => {
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
    delete: async (id) => {
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
