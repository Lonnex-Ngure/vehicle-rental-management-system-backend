import { Hono } from "hono";
import {
  listTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "./customer-support-tickets.controller";
import { zValidator } from "@hono/zod-validator";
import { customerSupportTicketSchema } from "../validators";
import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const customerSupportTicketRouter = new Hono();

customerSupportTicketRouter.get("/customer-support-tickets", listTickets);
customerSupportTicketRouter.get("/customer-support-tickets/:id", getTicketById);
customerSupportTicketRouter.post("/customer-support-tickets", zValidator("json", customerSupportTicketSchema), createTicket);
customerSupportTicketRouter.put("/customer-support-tickets/:id", zValidator("json", customerSupportTicketSchema), updateTicket);
customerSupportTicketRouter.delete("/customer-support-tickets/:id", deleteTicket);