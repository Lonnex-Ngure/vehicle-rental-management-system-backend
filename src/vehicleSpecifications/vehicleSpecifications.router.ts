import { Hono } from "hono";
import {
  listVehicleSpecifications,
  getVehicleSpecificationById,
  createVehicleSpecification,
  updateVehicleSpecification,
  deleteVehicleSpecification,
} from "./vehicleSpecifications.controller";
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecificationSchema } from "../validators";
import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";

export const vehicleSpecRouter = new Hono();

vehicleSpecRouter.get("/vehicle-specifications", listVehicleSpecifications);  
vehicleSpecRouter.get("/vehicle-specifications/:id",  getVehicleSpecificationById); 
vehicleSpecRouter.post("/vehicle-specifications", zValidator("json", vehicleSpecificationSchema), createVehicleSpecification);  
vehicleSpecRouter.put("/vehicle-specifications/:id", zValidator("json", vehicleSpecificationSchema), updateVehicleSpecification);  
vehicleSpecRouter.delete("/vehicle-specifications/:id", deleteVehicleSpecification);  
