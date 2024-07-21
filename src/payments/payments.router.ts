import { Hono } from "hono";
import {
  listPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  createPaymentIntent,
  processPayment,
} from "./payments.controller";
import { zValidator } from "@hono/zod-validator";
import { paymentSchema } from "../validators";
import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const paymentRouter = new Hono();

paymentRouter.get("/payments", listPayments);
paymentRouter.get("/payments/:id", getPaymentById);
paymentRouter.post("/payments", zValidator("json", paymentSchema), createPayment);
paymentRouter.put("/payments/:id", zValidator("json", paymentSchema), updatePayment);
paymentRouter.delete("/payments/:id", deletePayment);
paymentRouter.post("/payments/create-payment-intent",createPaymentIntent);
paymentRouter.post("/payments/process", processPayment);