import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { userRouter } from "./users/users.router";
import { vehicleSpecRouter } from "./vehicleSpecifications/vehicleSpecifications.router";
import { vehicleRouter } from "./vehicles/vehicles.router";
import { locationRouter } from "./locations/locations.router";
import { bookingRouter } from "./bookings/bookings.router";
import { paymentRouter } from "./payments/payments.router";
import { authenticationRouter } from "./authentications/authentications.router";
import { customerSupportTicketRouter } from "./customer-support-tickets/customer-support-tickets.router";
import { fleetManagementRouter } from "./fleet-management/fleet-management.router";
import { authRouter } from "./auth/auth.router";
import { cors } from 'hono/cors';


const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*', 
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", userRouter);
app.route("/api", vehicleSpecRouter);
app.route("/api", vehicleRouter);
app.route("/api", locationRouter);
app.route("/api", bookingRouter);
app.route("/api", paymentRouter);
app.route("/api", authenticationRouter);
app.route("/api", customerSupportTicketRouter );
app.route("/api", fleetManagementRouter );
app.route("/api/auth", authRouter)

console.log(`Server is running on port ${process.env.PORT}`);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
