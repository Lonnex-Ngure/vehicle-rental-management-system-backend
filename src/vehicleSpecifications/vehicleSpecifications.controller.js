import { vehicleSpecificationService } from "./vehicleSpecifications.service";
export const listVehicleSpecifications = async (c) => {
    const data = await vehicleSpecificationService.list();
    if (!data || data.length === 0) {
        return c.text("No vehicle specifications found", 404);
    }
    return c.json(data, 200);
};
export const getVehicleSpecificationById = async (c) => {
    const id = c.req.param("id");
    const data = await vehicleSpecificationService.getById(Number(id));
    if (!data) {
        return c.text("Vehicle specification not found", 404);
    }
    return c.json(data, 200);
};
export const createVehicleSpecification = async (c) => {
    const vehicleSpec = await c.req.json();
    const newVehicleSpec = await vehicleSpecificationService.create(vehicleSpec);
    return c.json(newVehicleSpec, 201);
};
export const updateVehicleSpecification = async (c) => {
    const id = c.req.param("id");
    const vehicleSpec = await c.req.json();
    const updatedVehicleSpec = await vehicleSpecificationService.update(Number(id), vehicleSpec);
    if (!updatedVehicleSpec) {
        return c.text("Vehicle specification not found", 404);
    }
    return c.json(updatedVehicleSpec, 200);
};
export const deleteVehicleSpecification = async (c) => {
    const id = c.req.param("id");
    const deleted = await vehicleSpecificationService.delete(Number(id));
    if (!deleted) {
        return c.text("Vehicle specification not found", 404);
    }
    return c.text("Vehicle specification deleted", 200);
};
