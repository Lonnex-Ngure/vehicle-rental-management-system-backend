import { locationService } from "./locations.service";
export const listLocations = async (c) => {
    const data = await locationService.list();
    if (!data || data.length === 0) {
        return c.text("No locations found", 404);
    }
    return c.json(data, 200);
};
export const getLocationById = async (c) => {
    const id = c.req.param("id");
    const data = await locationService.getById(Number(id));
    if (!data) {
        return c.text("Location not found", 404);
    }
    return c.json(data, 200);
};
export const createLocation = async (c) => {
    const location = await c.req.json();
    const newLocation = await locationService.create(location);
    return c.json(newLocation, 201);
};
export const updateLocation = async (c) => {
    const id = c.req.param("id");
    const location = await c.req.json();
    const updatedLocation = await locationService.update(Number(id), location);
    if (!updatedLocation) {
        return c.text("Location not found", 404);
    }
    return c.json(updatedLocation, 200);
};
export const deleteLocation = async (c) => {
    const id = c.req.param("id");
    const deleted = await locationService.delete(Number(id));
    if (!deleted) {
        return c.text("Location not found", 404);
    }
    return c.text("Location deleted", 200);
};
