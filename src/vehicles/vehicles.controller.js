import { vehicleService } from "./vehicles.service";
export const listVehicles = async (c) => {
    const data = await vehicleService.list();
    if (!data || data.length === 0) {
        return c.text("No vehicles found", 404);
    }
    return c.json(data, 200);
};
export const getVehicleById = async (c) => {
    const id = c.req.param("id");
    const vehicleId = parseInt(id, 10);
    if (isNaN(vehicleId)) {
        return c.json({ error: "Invalid vehicle ID" }, 400);
    }
    try {
        const data = await vehicleService.getById(vehicleId);
        if (!data) {
            return c.json({ error: "Vehicle not found" }, 404);
        }
        return c.json(data, 200);
    }
    catch (error) {
        console.error("Error fetching vehicle:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};
export const createVehicle = async (c) => {
    const vehicle = await c.req.json();
    const newVehicle = await vehicleService.create(vehicle);
    return c.json(newVehicle, 201);
};
export const updateVehicle = async (c) => {
    const id = c.req.param("id");
    const vehicle = await c.req.json();
    const updatedVehicle = await vehicleService.update(Number(id), vehicle);
    if (!updatedVehicle) {
        return c.text("Vehicle not found", 404);
    }
    return c.json(updatedVehicle, 200);
};
export const deleteVehicle = async (c) => {
    const id = c.req.param("id");
    const deleted = await vehicleService.delete(Number(id));
    if (!deleted) {
        return c.text("Vehicle not found", 404);
    }
    return c.text("Vehicle deleted", 200);
};
