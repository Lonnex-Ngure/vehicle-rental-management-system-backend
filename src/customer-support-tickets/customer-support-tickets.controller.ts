import { Context } from "hono";
import { customerSupportTicketService } from "./customer-support-tickets.service";

export const listTickets = async (c: Context) => {
  const data = await customerSupportTicketService.list();
  if (!data || data.length === 0) {
    return c.text("No customer support tickets found", 404);
  }
  return c.json(data, 200);
};

export const getTicketById = async (c: Context) => {
  const id = c.req.param("id");
  const data = await customerSupportTicketService.getById(Number(id));
  if (!data) {
    return c.text("Customer support ticket not found", 404);
  }
  return c.json(data, 200);
};

export const createTicket = async (c: Context) => {
  try {
    const ticket = await c.req.json();
    const newTicket = await customerSupportTicketService.create(ticket);
    return c.json(newTicket, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateTicket = async (c: Context) => {
  const id = c.req.param("id");
  const ticket = await c.req.json();
  const updatedTicket = await customerSupportTicketService.update(Number(id), ticket);
  if (!updatedTicket) {
    return c.text("Customer support ticket not found", 404);
  }
  return c.json(updatedTicket, 200);
};

export const deleteTicket = async (c: Context) => {
  const id = c.req.param("id");
  const deleted = await customerSupportTicketService.delete(Number(id));
  if (!deleted) {
    return c.text("Customer support ticket not found", 404);
  }
  return c.text("Customer support ticket deleted", 200);
};