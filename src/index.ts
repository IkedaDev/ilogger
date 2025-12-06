import { serve } from "@hono/node-server";
import app from "./server";

const port = Number(process.env.PORT) || 4002;

console.log(`👁️ IkedaDev Logger running on port ${port}`);
console.log(`📄 Docs available at http://localhost:${port}/reference`);

serve({ fetch: app.fetch, port });
