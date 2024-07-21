import { authenticationService } from "./authentications.service";
export const listAuthentications = async (c) => {
    const data = await authenticationService.list();
    if (!data || data.length === 0) {
        return c.text("No authentications found", 404);
    }
    return c.json(data, 200);
};
export const getAuthenticationById = async (c) => {
    const id = c.req.param("id");
    const data = await authenticationService.getById(Number(id));
    if (!data) {
        return c.text("Authentication not found", 404);
    }
    return c.json(data, 200);
};
export const createAuthentication = async (c) => {
    try {
        const authentication = await c.req.json();
        const newAuthentication = await authenticationService.create(authentication);
        return c.json(newAuthentication, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
export const updateAuthentication = async (c) => {
    const id = c.req.param("id");
    const authentication = await c.req.json();
    const updatedAuthentication = await authenticationService.update(Number(id), authentication);
    if (!updatedAuthentication) {
        return c.text("Authentication not found", 404);
    }
    return c.json(updatedAuthentication, 200);
};
export const deleteAuthentication = async (c) => {
    const id = c.req.param("id");
    const deleted = await authenticationService.delete(Number(id));
    if (!deleted) {
        return c.text("Authentication not found", 404);
    }
    return c.text("Authentication deleted", 200);
};
