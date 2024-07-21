import db from "../drizzle/db";
import {
  VehiclesTable,
  VehicleSpecificationsTable,
  TSVehicle,
  TIVehicle,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Define the custom type for the vehicle details we are returning
type VehicleWithDetails = Omit<TSVehicle, "vehicleId" | "createdAt" | "updatedAt"> & {
  specification: {
    manufacturer: string;
    model: string;
    year: number;
    fuelType: string;
    engineCapacity: number;
    transmission: string;
    seatingCapacity: number;
    color: string;
    features?: string;
    imageUrl?: string;
  };
};

export const vehicleService = {
  list: async (): Promise<VehicleWithDetails[]> => {
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

    return vehicles as VehicleWithDetails[];
  },
  getById: async (id: number): Promise<TIVehicle | undefined> => {
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
  create: async (vehicle: TIVehicle): Promise<TIVehicle> => {
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
  update: async (id: number, vehicle: TIVehicle): Promise<TIVehicle | null> => {
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
  delete: async (id: number): Promise<boolean> => {
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