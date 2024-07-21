import db from "../drizzle/db";
import { VehiclesTable, } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const vehicleService = {
    list: async () => {
        const vehicles = await db.query.VehiclesTable.findMany({
            columns: {
                vehicleId: true,
                vehicleSpecId: true,
                rentalRate: true,
                availability: true,
            },
            with: {
                specification: {
                    columns: {
                        manufacturer: true,
                        model: true,
                        year: true,
                        fuelType: true,
                        engineCapacity: true,
                        transmission: true,
                        seatingCapacity: true,
                        color: true,
                        features: true,
                        imageUrl: true,
                    },
                },
            },
        });
        return vehicles;
    },
    getById: async (id) => {
        return await db.query.VehiclesTable.findFirst({
            columns: {
                vehicleSpecId: true,
                rentalRate: true,
                availability: true,
            },
            where: (vehiclesTable) => eq(vehiclesTable.vehicleId, id),
            with: {
                specification: {
                    columns: {
                        manufacturer: true,
                        model: true,
                        year: true,
                        fuelType: true,
                        engineCapacity: true,
                        transmission: true,
                        seatingCapacity: true,
                        color: true,
                        features: true,
                        imageUrl: true,
                    },
                },
            },
        });
    },
    create: async (vehicle) => {
        const result = await db
            .insert(VehiclesTable)
            .values(vehicle)
            .returning({
            vehicleId: VehiclesTable.vehicleId,
            vehicleSpecId: VehiclesTable.vehicleSpecId,
            rentalRate: VehiclesTable.rentalRate,
            availability: VehiclesTable.availability,
        })
            .execute();
        return result[0];
    },
    update: async (id, vehicle) => {
        const result = await db
            .update(VehiclesTable)
            .set(vehicle)
            .where(eq(VehiclesTable.vehicleId, id))
            .returning({
            vehicleId: VehiclesTable.vehicleId,
            vehicleSpecId: VehiclesTable.vehicleSpecId,
            rentalRate: VehiclesTable.rentalRate,
            availability: VehiclesTable.availability,
        })
            .execute();
        return result[0] || null;
    },
    delete: async (id) => {
        const result = await db
            .delete(VehiclesTable)
            .where(eq(VehiclesTable.vehicleId, id))
            .returning({
            vehicleId: VehiclesTable.vehicleId,
        })
            .execute();
        return result.length > 0;
    },
};
