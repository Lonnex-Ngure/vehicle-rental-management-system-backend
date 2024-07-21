import { Context } from "hono";
import { fleetManagementService } from "./fleet-management.service";
import { fleetManagementSchema } from "../validators";

export const listFleetItems = async (c: Context) => {
  const data = await fleetManagementService.list();
  if (!data || data.length === 0) {
    return c.text("No fleet management items found", 404);
  }
  return c.json(data, 200);
};

export const getFleetItemById = async (c: Context) => {
  const id = c.req.param("id");
  const data = await fleetManagementService.getById(Number(id));
  if (!data) {
    return c.text("Fleet management item not found", 404);
  }
  return c.json(data, 200);
};

export const createFleetItem = async (c: Context) => {
  try {
    const fleetItem = await c.req.json();
    const parsedFleetItem = fleetManagementSchema.parse({
      ...fleetItem,
      acquisitionDate: new Date(fleetItem.acquisitionDate),
    });
    const newFleetItem = await fleetManagementService.create(parsedFleetItem);
    return c.json(newFleetItem, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateFleetItem = async (c: Context) => {
  const id = c.req.param("id");
  const fleetItem = await c.req.json();
  const parsedFleetItem = fleetManagementSchema.parse({
    ...fleetItem,
    acquisitionDate: new Date(fleetItem.acquisitionDate),
  });
  const updatedFleetItem = await fleetManagementService.update(Number(id), parsedFleetItem);
  if (!updatedFleetItem) {
    return c.text("Fleet management item not found", 404);
  }
  return c.json(updatedFleetItem, 200);
};

export const deleteFleetItem = async (c: Context) => {
  const id = c.req.param("id");
  const deleted = await fleetManagementService.delete(Number(id));
  if (!deleted) {
    return c.text("Fleet management item not found", 404);
  }
  return c.text("Fleet management item deleted", 200);
};