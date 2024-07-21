import db from "../drizzle/db";
import { LocationsTable, TSLocation, TILocation } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Define a type for the selected columns
type TSLocationSubset = {
  name: string;
  address: string;
  contactPhone: string;
};

export const locationService = {
  list: async (): Promise<TSLocationSubset[]> => {
    return await db.query.LocationsTable.findMany({
      columns: {
        locationId: true,
        name: true,
        address: true,
        contactPhone: true,
      },
    });
  },
  getById: async (id: number): Promise<TSLocationSubset | undefined> => {
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
  create: async (location: TILocation): Promise<TILocation> => {
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
  update: async (id: number, location: TILocation): Promise<TILocation | null> => {
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
  delete: async (id: number): Promise<boolean> => {
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
