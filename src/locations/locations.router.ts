import { Hono } from "hono";
import {
  listLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "./locations.controller";
import { zValidator } from "@hono/zod-validator";
import { locationSchema } from "../validators";
import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const locationRouter = new Hono();

locationRouter.get("/locations", listLocations);
locationRouter.get("/locations/:id", userRoleAuth, getLocationById);
locationRouter.post("/locations", zValidator("json", locationSchema), createLocation);
locationRouter.put("/locations/:id", zValidator("json", locationSchema), updateLocation);
locationRouter.delete("/locations/:id", deleteLocation);
