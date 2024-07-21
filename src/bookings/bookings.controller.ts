import { Context } from "hono";
import { bookingService } from "./bookings.service";
import { bookingSchema } from "../validators";
import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const listBookings = async (c: Context) => {
  const data = await bookingService.list();
  if (!data || data.length === 0) {
    return c.text("No bookings found", 404);
  }
  return c.json(data, 200);
};

export const getBookingById = async (c: Context) => {
  const id = c.req.param("id");
  const data = await bookingService.getById(Number(id));
  if (!data) {
    return c.text("Booking not found", 404);
  }
  return c.json(data, 200);
};

export const createBooking = async (c: Context) => {
  const booking = await c.req.json();

  // Validate and parse the booking data
  const parsedBooking = bookingSchema.parse({
    ...booking,
    bookingDate: new Date(booking.bookingDate),
    returnDate: new Date(booking.returnDate),
  });

  const newBooking = await bookingService.create(parsedBooking);
  return c.json(newBooking, 201);
};

export const updateBooking = async (c: Context) => {
  const id = c.req.param("id");
  const booking = await c.req.json();

  // Validate and parse the booking data
  const parsedBooking = bookingSchema.parse({
    ...booking,
    bookingDate: new Date(booking.bookingDate),
    returnDate: new Date(booking.returnDate),
  });

  const updatedBooking = await bookingService.update(Number(id), parsedBooking);
  if (!updatedBooking) {
    return c.text("Booking not found", 404);
  }
  return c.json(updatedBooking, 200);
};

export const deleteBooking = async (c: Context) => {
  const id = c.req.param("id");
  const deleted = await bookingService.delete(Number(id));
  if (!deleted) {
    return c.text("Booking not found", 404);
  }
  return c.text("Booking deleted", 200);
};
