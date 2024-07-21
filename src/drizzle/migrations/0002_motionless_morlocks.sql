ALTER TABLE "customer_support_tickets" ALTER COLUMN "status" SET DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "location";