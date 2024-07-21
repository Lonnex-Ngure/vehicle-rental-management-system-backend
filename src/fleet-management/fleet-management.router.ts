import { Hono } from "hono";
import {
  listFleetItems,
  getFleetItemById,
  createFleetItem,
  updateFleetItem,
  deleteFleetItem,
} from "./fleet-management.controller";
import { zValidator } from "@hono/zod-validator";
import { fleetManagementSchema } from "../validators";
import { adminRoleAuth } from "../middleware/bearAuth";

export const fleetManagementRouter = new Hono();

fleetManagementRouter.get("/fleet-management", listFleetItems);
fleetManagementRouter.get("/fleet-management/:id", getFleetItemById);
fleetManagementRouter.post("/fleet-management", zValidator("json", fleetManagementSchema), createFleetItem);
fleetManagementRouter.put("/fleet-management/:id", zValidator("json", fleetManagementSchema), updateFleetItem);
fleetManagementRouter.delete("/fleet-management/:id", deleteFleetItem);