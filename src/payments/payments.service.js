import db from "../drizzle/db";
import stripe from '../stripe';
import { PaymentsTable, BookingsTable, } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const paymentService = {
    list: async () => {
        const payments = await db.query.PaymentsTable.findMany({
            columns: {
                amount: true,
                paymentStatus: true,
                paymentDate: true,
                paymentMethod: true,
                transactionId: true,
            },
            with: {
                booking: {
                    columns: {
                        bookingDate: true,
                        returnDate: true,
                        totalAmount: true,
                        bookingStatus: true,
                    },
                    with: {
                        user: {
                            columns: {
                                fullName: true,
                                email: true,
                            },
                        },
                        vehicle: {
                            columns: {
                                vehicleSpecId: true,
                                rentalRate: true,
                            },
                        },
                    },
                },
            },
        });
        return payments;
    },
    getById: async (id) => {
        const payment = await db.query.PaymentsTable.findFirst({
            columns: {
                amount: true,
                paymentStatus: true,
                paymentDate: true,
                paymentMethod: true,
                transactionId: true,
            },
            where: (paymentsTable) => eq(paymentsTable.paymentId, id),
            with: {
                booking: {
                    columns: {
                        bookingDate: true,
                        returnDate: true,
                        totalAmount: true,
                        bookingStatus: true,
                    },
                    with: {
                        user: {
                            columns: {
                                fullName: true,
                                email: true,
                            },
                        },
                        vehicle: {
                            columns: {
                                vehicleSpecId: true,
                                rentalRate: true,
                            },
                        },
                    },
                },
            },
        });
        return payment;
    },
    create: async (payment) => {
        const result = await db
            .insert(PaymentsTable)
            .values(payment)
            .returning({
            paymentId: PaymentsTable.paymentId,
            bookingId: PaymentsTable.bookingId,
            amount: PaymentsTable.amount,
            paymentStatus: PaymentsTable.paymentStatus,
            paymentDate: PaymentsTable.paymentDate,
            paymentMethod: PaymentsTable.paymentMethod,
            transactionId: PaymentsTable.transactionId,
        })
            .execute();
        return result[0];
    },
    update: async (id, payment) => {
        const result = await db
            .update(PaymentsTable)
            .set(payment)
            .where(eq(PaymentsTable.paymentId, id))
            .returning({
            paymentId: PaymentsTable.paymentId,
            bookingId: PaymentsTable.bookingId,
            amount: PaymentsTable.amount,
            paymentStatus: PaymentsTable.paymentStatus,
            paymentDate: PaymentsTable.paymentDate,
            paymentMethod: PaymentsTable.paymentMethod,
            transactionId: PaymentsTable.transactionId,
        })
            .execute();
        return result[0] || null;
    },
    delete: async (id) => {
        const result = await db
            .delete(PaymentsTable)
            .where(eq(PaymentsTable.paymentId, id))
            .returning({
            paymentId: PaymentsTable.paymentId,
        })
            .execute();
        return result.length > 0;
    },
    createStripePaymentIntent: async (amount, currency = 'usd') => {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });
        return paymentIntent.client_secret;
    },
    processPayment: async (bookingId, paymentMethodId) => {
        // Fetch booking details
        const booking = await db.query.BookingsTable.findFirst({
            where: (bookingsTable) => eq(bookingsTable.bookingId, bookingId),
            with: {
                user: true
            }
        });
        if (!booking) {
            throw new Error('Booking not found');
        }
        try {
            // Create a Stripe Customer
            const customer = await stripe.customers.create({
                email: booking.user.email,
                name: booking.user.fullName,
                payment_method: paymentMethodId,
            });
            // Create a PaymentIntent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: booking.totalAmount * 100, // Stripe expects amount in cents
                currency: 'usd',
                customer: customer.id,
                payment_method: paymentMethodId,
                off_session: true,
                confirm: true,
            });
            if (paymentIntent.status === 'succeeded') {
                // Update booking status
                await db.update(BookingsTable)
                    .set({ bookingStatus: 'Confirmed' })
                    .where(eq(BookingsTable.bookingId, bookingId))
                    .execute();
                // Create payment record
                const payment = {
                    bookingId: bookingId,
                    amount: booking.totalAmount,
                    paymentStatus: 'Paid',
                    paymentDate: new Date(),
                    paymentMethod: 'Credit Card',
                    transactionId: paymentIntent.id,
                };
                const createdPayment = await db.insert(PaymentsTable)
                    .values(payment)
                    .returning()
                    .execute();
                return createdPayment[0];
            }
            else {
                throw new Error('Payment failed');
            }
        }
        catch (error) {
            console.error('Error processing payment:', error);
            // If an error occurs, attempt to revert the booking status
            await db.update(BookingsTable)
                .set({ bookingStatus: 'Pending' })
                .where(eq(BookingsTable.bookingId, bookingId))
                .execute();
            throw error;
        }
    }
};
