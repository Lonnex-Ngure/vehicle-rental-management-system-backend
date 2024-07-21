import "dotenv/config";

import db, { client } from "./db";
import { migrate } from "drizzle-orm/neon-http/migrator";

console.log("Database_URL:", process.env.DATABASE_URL!);
async function migration() {
  await migrate(db, { migrationsFolder: __dirname + "/migrations" });

  console.log("======== Migrations ended ========");
  process.exit(0);
}

migration();


// //postgres
// import "dotenv/config";
// import { migrate } from "drizzle-orm/node-postgres/migrator";
// import db, { client } from "./db";

// async function migration() {
//   await migrate(db, { migrationsFolder: __dirname + "/migrations" });
//   await client.end();
// }

// migration().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
