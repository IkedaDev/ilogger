import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { Scalar } from "@scalar/hono-api-reference";
import { apiKeyGuard } from "./middlewares/api-key.middleware";
import { logsRoutes, logsHandlers } from "./modules/logs/logs.routes";
import "dotenv/config";

const app = new OpenAPIHono();
const publicPath = process.env.API_PUBLIC_PATH || "";

// Middlewares Globales
app.use(logger());
app.use("/*", cors());

// --- ROUTER V1 ---
const v1 = new OpenAPIHono();

// Aplicamos seguridad a TODO el router v1 (excepto si quieres un health check público)
v1.use("/*", apiKeyGuard);

// Registramos rutas
v1.openapi(logsRoutes.ingest, logsHandlers.ingest);

// Montamos v1 en la app principal
app.route("/v1", v1);

app.openAPIRegistry.registerComponent("securitySchemes", "x-api-key", {
  type: "apiKey",
  in: "header",
  name: "x-api-key",
});

// --- DOCUMENTACIÓN ---
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "IkedaDev Logger API",
    version: "1.0.0",
    description: "Centralized logging system for all IkedaDev services.",
  },
  servers: [{ url: `${publicPath}`, description: "Logger Server" }],
});

app.get(
  "/reference",
  Scalar({
    theme: "purple",
    spec: { url: `${publicPath}/doc` },
  } as any)
);

export default app;
