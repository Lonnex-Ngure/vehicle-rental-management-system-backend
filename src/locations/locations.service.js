import db from "../drizzle/db";
import { LocationsTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const locationService = {
    list: async () => {
        return await db.query.LocationsTable.findMany({
            columns: {
                locationId: true,
                name: true,
                address: true,
                contactPhone: true,
            },
        });
    },
    getById: async (id) => {
        return await db.query.LocationsTable.findFirst({
            columns: {
                locationId: true,
                name: true,
                address: true,
                contactPhone: true,
            },
            where: (locationsTable) => eq(locationsTable.locationId, id),
        });
    },
    create: async (location) => {
        const result = await db
            .insert(LocationsTable)
            .values(location)
            .returning({
            name: LocationsTable.name,
            address: LocationsTable.address,
            contactPhone: LocationsTable.contactPhone,
        })
            .execute();
        return result[0];
    },
    update: async (id, location) => {
        const result = await db
            .update(LocationsTable)
            .set(location)
            .where(eq(LocationsTable.locationId, id))
            .returning({
            name: LocationsTable.name,
            address: LocationsTable.address,
            contactPhone: LocationsTable.contactPhone,
        })
            .execute();
        return result[0] || null;
    },
    delete: async (id) => {
        const result = await db
            .delete(LocationsTable)
            .where(eq(LocationsTable.locationId, id))
            .returning({
            locationId: LocationsTable.locationId,
        })
            .execute();
        return result.length > 0;
    },
};
