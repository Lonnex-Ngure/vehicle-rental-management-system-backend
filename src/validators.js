import { z } from "zod";
// Users Table Validators
export const userSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    contactPhone: z.string().min(1, "Contact phone is required").max(20),
    address: z.string().min(1, "Address is required"),
    role: z.enum(["user", "admin"]).default("user").optional(),
});
// Vehicle Specifications Table Validators
export const vehicleSpecificationSchema = z.object({
    manufacturer: z.string().min(1, "Manufacturer is required").max(100),
    model: z.string().min(1, "Model is required").max(100),
    year: z.number().int().min(1886, "Year is not valid"), // The first automobile was made in 1886
    fuelType: z.string().min(1, "Fuel type is required").max(50),
    engineCapacity: z.number().int().positive("Engine capacity must be positive"),
    transmission: z.string().min(1, "Transmission is required").max(50),
    seatingCapacity: z
        .number()
        .int()
        .positive("Seating capacity must be positive"),
    color: z.string().min(1, "Color is required").max(50),
    features: z.string()
        .min(1, "Features are required")
        .refine((val) => val.includes("2-wheeler") || val.includes("4-wheeler"), { message: "Features must include either '2-wheeler' or '4-wheeler'" }),
});
// Vehicles Table Validators
export const vehicleSchema = z.object({
    vehicleSpecId: z
        .number()
        .int()
        .positive("Vehicle specification ID must be positive"),
    rentalRate: z.number().int().positive("Rental rate must be positive"),
    availability: z.boolean().default(true),
});
// Locations Table Validators
export const locationSchema = z.object({
    name: z.string(),
    address: z.string(),
    contactPhone: z.string(),
});
// Bookings Table Validators
export const bookingSchema = z.object({
    userId: z.number().int().positive("User ID must be positive"),
    vehicleId: z.number().int().positive("Vehicle ID must be positive"),
    locationId: z.number().int().positive("Location ID must be positive"),
    bookingDate: z.preprocess((arg) => new Date(arg), z.date()),
    returnDate: z.preprocess((arg) => new Date(arg), z.date()),
    totalAmount: z.number().int().positive("Total amount must be positive"),
    bookingStatus: z.string().min(1, "Booking status is required").max(20).default("Pending"),
});
// Payments Table Validators
export const paymentSchema = z.object({
    bookingId: z.number().int().positive("Booking ID must be positive"),
    amount: z.number().int().positive("Amount must be positive"),
    paymentStatus: z
        .string()
        .min(1, "Payment status is required")
        .max(20)
        .default("Pending"),
    paymentDate: z.preprocess((arg) => new Date(arg), z.date()),
    paymentMethod: z.string().min(1, "Payment method is required").max(50),
    transactionId: z.string().min(1, "Transaction ID is required").max(100),
});
// Authentication Table Validators
export const authenticationSchema = z.object({
    userId: z.number().int().positive("User ID must be positive").optional(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(255),
});
// Customer Support Tickets Table Validators
export const customerSupportTicketSchema = z.object({
    userId: z.number().int().positive("User ID must be positive"),
    subject: z.string().min(1, "Subject is required").max(255),
    description: z.string().min(1, "Description is required"),
    //status: z.string().min(1, "Status is required").max(20),
});
// Fleet Management Table Validators
export const fleetManagementSchema = z.object({
    vehicleId: z.number().int().positive("Vehicle ID must be positive"),
    acquisitionDate: z.preprocess((arg) => new Date(arg), z.date()),
    depreciationRate: z
        .number()
        .int()
        .positive("Depreciation rate must be positive"),
    currentValue: z.number().int().positive("Current value must be positive"),
    maintenanceCost: z
        .number()
        .int()
        .positive("Maintenance cost must be positive"),
    status: z.string().min(1, "Status is required").max(50),
});
export const registrationSchema = userSchema.extend({
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});
