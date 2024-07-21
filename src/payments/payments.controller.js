import { paymentService } from "./payments.service";
import { paymentSchema } from "../validators";
export const listPayments = async (c) => {
    const data = await paymentService.list();
    if (!data || data.length === 0) {
        return c.text("No payments found", 404);
    }
    return c.json(data, 200);
};
export const getPaymentById = async (c) => {
    const id = c.req.param("id");
    const data = await paymentService.getById(Number(id));
    if (!data) {
        return c.text("Payment not found", 404);
    }
    return c.json(data, 200);
};
export const createPayment = async (c) => {
    const payment = await c.req.json();
    const parsedPayment = paymentSchema.parse({
        ...payment,
        paymentDate: new Date(payment.paymentDate),
    });
    const newPayment = await paymentService.create(parsedPayment);
    return c.json(newPayment, 201);
};
export const updatePayment = async (c) => {
    const id = c.req.param("id");
    const payment = await c.req.json();
    const parsedPayment = paymentSchema.parse({
        ...payment,
        paymentDate: new Date(payment.paymentDate),
    });
    const updatedPayment = await paymentService.update(Number(id), parsedPayment);
    if (!updatedPayment) {
        return c.text("Payment not found", 404);
    }
    return c.json(updatedPayment, 200);
};
export const deletePayment = async (c) => {
    const id = c.req.param("id");
    const deleted = await paymentService.delete(Number(id));
    if (!deleted) {
        return c.text("Payment not found", 404);
    }
    return c.text("Payment deleted", 200);
};
export const createPaymentIntent = async (c) => {
    const { amount } = await c.req.json();
    const clientSecret = await paymentService.createStripePaymentIntent(amount);
    return c.json({ clientSecret }, 200);
};
export const processPayment = async (c) => {
    const { bookingId, paymentMethodId } = await c.req.json();
    try {
        const payment = await paymentService.processPayment(Number(bookingId), paymentMethodId);
        return c.json(payment, 200);
    }
    catch (error) {
        console.error('Payment processing error:', error);
        if (error instanceof Error) {
            return c.json({ error: error.message }, 400);
        }
        else {
            return c.json({ error: 'An unknown error occurred' }, 500);
        }
    }
};
