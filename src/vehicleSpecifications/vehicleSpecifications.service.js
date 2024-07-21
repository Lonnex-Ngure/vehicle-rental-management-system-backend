import db from "../drizzle/db";
import { VehicleSpecificationsTable, } from "../drizzle/schema";
import { eq } from "drizzle-orm";
export const vehicleSpecificationService = {
    list: async () => {
        const vehicleSpecifications = await db.query.VehicleSpecificationsTable.findMany({
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
        return vehicleSpecifications.map((spec) => ({
            ...spec,
            vehicles: spec.vehicle ? [spec.vehicle] : [],
        }));
    },
    getById: async (id) => {
        return await db.query.VehicleSpecificationsTable.findFirst({
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
            where: (vehicleSpecificationsTable) => eq(vehicleSpecificationsTable.vehicleSpecId, id),
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
    },
    create: async (vehicleSpec) => {
        const result = await db
            .insert(VehicleSpecificationsTable)
            .values(vehicleSpec)
            .returning({
            vehicleSpecId: VehicleSpecificationsTable.vehicleSpecId,
            manufacturer: VehicleSpecificationsTable.manufacturer,
            model: VehicleSpecificationsTable.model,
            year: VehicleSpecificationsTable.year,
            fuelType: VehicleSpecificationsTable.fuelType,
            engineCapacity: VehicleSpecificationsTable.engineCapacity,
            transmission: VehicleSpecificationsTable.transmission,
            seatingCapacity: VehicleSpecificationsTable.seatingCapacity,
            color: VehicleSpecificationsTable.color,
            features: VehicleSpecificationsTable.features,
        })
            .execute();
        return result[0];
    },
    update: async (id, vehicleSpec) => {
        const result = await db
            .update(VehicleSpecificationsTable)
            .set(vehicleSpec)
            .where(eq(VehicleSpecificationsTable.vehicleSpecId, id))
            .returning({
            vehicleSpecId: VehicleSpecificationsTable.vehicleSpecId,
            manufacturer: VehicleSpecificationsTable.manufacturer,
            model: VehicleSpecificationsTable.model,
            year: VehicleSpecificationsTable.year,
            fuelType: VehicleSpecificationsTable.fuelType,
            engineCapacity: VehicleSpecificationsTable.engineCapacity,
            transmission: VehicleSpecificationsTable.transmission,
            seatingCapacity: VehicleSpecificationsTable.seatingCapacity,
            color: VehicleSpecificationsTable.color,
            features: VehicleSpecificationsTable.features,
        })
            .execute();
        return result[0] || null;
    },
    delete: async (id) => {
        const result = await db
            .delete(VehicleSpecificationsTable)
            .where(eq(VehicleSpecificationsTable.vehicleSpecId, id))
            .returning({
            vehicleSpecId: VehicleSpecificationsTable.vehicleSpecId,
        })
            .execute();
        return result.length > 0;
    },
};
