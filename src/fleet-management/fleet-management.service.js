import db from "../drizzle/db";
import { FleetManagementTable, } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const fleetManagementService = {
    list: async () => {
        const fleetItems = await db.query.FleetManagementTable.findMany({
            columns: {
                fleetId: true,
                acquisitionDate: true,
                depreciationRate: true,
                currentValue: true,
                maintenanceCost: true,
                status: true,
            },
            with: {
                vehicle: {
                    columns: {
                        vehicleId: true,
                        rentalRate: true,
                        availability: true,
                    },
                },
            },
        });
        return fleetItems;
    },
    getById: async (id) => {
        const fleetItem = await db.query.FleetManagementTable.findFirst({
            columns: {
                fleetId: true,
                acquisitionDate: true,
                depreciationRate: true,
                currentValue: true,
                maintenanceCost: true,
                status: true,
            },
            where: (fleetManagementTable) => eq(fleetManagementTable.fleetId, id),
            with: {
                vehicle: {
                    columns: {
                        vehicleId: true,
                        rentalRate: true,
                        availability: true,
                    },
                },
            },
        });
        return fleetItem;
    },
    create: async (fleetItem) => {
        const result = await db
            .insert(FleetManagementTable)
            .values(fleetItem)
            .returning({
            vehicleId: FleetManagementTable.vehicleId,
            acquisitionDate: FleetManagementTable.acquisitionDate,
            depreciationRate: FleetManagementTable.depreciationRate,
            currentValue: FleetManagementTable.currentValue,
            maintenanceCost: FleetManagementTable.maintenanceCost,
            status: FleetManagementTable.status,
        })
            .execute();
        return result[0];
    },
    update: async (id, fleetItem) => {
        const result = await db
            .update(FleetManagementTable)
            .set(fleetItem)
            .where(eq(FleetManagementTable.fleetId, id))
            .returning({
            vehicleId: FleetManagementTable.vehicleId,
            acquisitionDate: FleetManagementTable.acquisitionDate,
            depreciationRate: FleetManagementTable.depreciationRate,
            currentValue: FleetManagementTable.currentValue,
            maintenanceCost: FleetManagementTable.maintenanceCost,
            status: FleetManagementTable.status,
        })
            .execute();
        return result[0] || null;
    },
    delete: async (id) => {
        const result = await db
            .delete(FleetManagementTable)
            .where(eq(FleetManagementTable.fleetId, id))
            .returning({
            fleetId: FleetManagementTable.fleetId,
        })
            .execute();
        return result.length > 0;
    },
};
