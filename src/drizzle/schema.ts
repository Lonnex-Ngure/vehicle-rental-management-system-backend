import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// Users Table
export const UsersTable = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Vehicle Specifications Table
export const VehicleSpecificationsTable = pgTable("vehicle_specifications", {
  vehicleSpecId: serial("vehicle_spec_id").primaryKey(),
  manufacturer: varchar("manufacturer", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  fuelType: varchar("fuel_type", { length: 50 }).notNull(),
  engineCapacity: integer("engine_capacity").notNull(),
  transmission: varchar("transmission", { length: 50 }).notNull(),
  seatingCapacity: integer("seating_capacity").notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  features: text("features"),
  imageUrl: text("image_url"),
});

// Vehicles Table
export const VehiclesTable = pgTable("vehicles", {
  vehicleId: serial("vehicle_id").primaryKey(),
  vehicleSpecId: integer("vehicle_spec_id")
    .notNull()
    .references(() => VehicleSpecificationsTable.vehicleSpecId),
  rentalRate: integer("rental_rate").notNull(), // Using integer for cents
  availability: boolean("availability").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Location and Branches Table
export const LocationsTable = pgTable("locations", {
  locationId: serial("location_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  address: text("address").notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Bookings Table
export const BookingsTable = pgTable("bookings", {
  bookingId: serial("booking_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => UsersTable.userId),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => VehiclesTable.vehicleId),
  locationId: integer("location_id")
    .notNull()
    .references(() => LocationsTable.locationId),
  bookingDate: timestamp("booking_date").notNull(),
  returnDate: timestamp("return_date").notNull(),
  totalAmount: integer("total_amount").notNull(), 
  bookingStatus: varchar("booking_status", { length: 20 })
    .notNull()
    .default("Pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Payments Table
export const PaymentsTable = pgTable("payments", {
  paymentId: serial("payment_id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => BookingsTable.bookingId),
  amount: integer("amount").notNull(), // Using integer for cents
  paymentStatus: varchar("payment_status", { length: 20 })
    .notNull()
    .default("Pending"),
  paymentDate: timestamp("payment_date").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  transactionId: varchar("transaction_id", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Authentication Table
export const AuthenticationTable = pgTable("authentications", {
  authId: serial("auth_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => UsersTable.userId),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Customer Support Tickets Table
export const CustomerSupportTicketsTable = pgTable("customer_support_tickets", {
  ticketId: serial("ticket_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => UsersTable.userId),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).default("open").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Fleet Management Table
export const FleetManagementTable = pgTable("fleet_management", {
  fleetId: serial("fleet_id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => VehiclesTable.vehicleId),
  acquisitionDate: timestamp("acquisition_date").notNull(),
  depreciationRate: integer("depreciation_rate").notNull(), // Using integer for basis points
  currentValue: integer("current_value").notNull(), // Using integer for cents
  maintenanceCost: integer("maintenance_cost").notNull(), // Using integer for cents
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(UsersTable, ({ many, one }) => ({
  bookings: many(BookingsTable),
  authentications: one(AuthenticationTable),
  customerSupportTickets: many(CustomerSupportTicketsTable),
}));

export const authenticationRelations = relations(
  AuthenticationTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [AuthenticationTable.userId],
      references: [UsersTable.userId],
    }),
  })
);

export const customerSupportTicketsRelations = relations(
  CustomerSupportTicketsTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [CustomerSupportTicketsTable.userId],
      references: [UsersTable.userId],
    }),
  })
);

export const vehicleSpecificationsRelations = relations(
  VehicleSpecificationsTable,
  ({ one }) => ({
    vehicle: one(VehiclesTable, {
      fields: [VehicleSpecificationsTable.vehicleSpecId],
      references: [VehiclesTable.vehicleId],
    }),
  })
);

export const vehiclesRelations = relations(VehiclesTable, ({ one, many }) => ({
  specification: one(VehicleSpecificationsTable, {
    fields: [VehiclesTable.vehicleSpecId],
    references: [VehicleSpecificationsTable.vehicleSpecId],
  }),
  bookings: many(BookingsTable),
}));

export const bookingsRelations = relations(BookingsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [BookingsTable.userId],
    references: [UsersTable.userId],
  }),
  vehicle: one(VehiclesTable, {
    fields: [BookingsTable.vehicleId],
    references: [VehiclesTable.vehicleId],
  }),
  location: one(LocationsTable, {
    fields: [BookingsTable.locationId],
    references: [LocationsTable.locationId],
  }),
}));

export const paymentsRelations = relations(PaymentsTable, ({ one }) => ({
  booking: one(BookingsTable, {
    fields: [PaymentsTable.bookingId],
    references: [BookingsTable.bookingId],
  }),
}));

export const fleetManagementRelations = relations(
  FleetManagementTable,
  ({ one }) => ({
    vehicle: one(VehiclesTable, {
      fields: [FleetManagementTable.vehicleId],
      references: [VehiclesTable.vehicleId],
    }),
  })
);



// Types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TIVehicleSpecification =
  typeof VehicleSpecificationsTable.$inferInsert;
export type TSVehicleSpecification =
  typeof VehicleSpecificationsTable.$inferSelect;

export type TIVehicle = typeof VehiclesTable.$inferInsert;
export type TSVehicle = typeof VehiclesTable.$inferSelect;

export type TILocation = typeof LocationsTable.$inferInsert;
export type TSLocation = typeof LocationsTable.$inferSelect;

export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;

export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

export type TIAuthentication = typeof AuthenticationTable.$inferInsert;
export type TSAuthentication = typeof AuthenticationTable.$inferSelect;

export type TICustomerSupportTicket =
  typeof CustomerSupportTicketsTable.$inferInsert;
export type TSCustomerSupportTicket =
  typeof CustomerSupportTicketsTable.$inferSelect;

export type TIFleetManagement = typeof FleetManagementTable.$inferInsert;
export type TSFleetManagement = typeof FleetManagementTable.$inferSelect;
