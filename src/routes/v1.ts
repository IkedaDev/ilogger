import { OpenAPIHono } from "@hono/zod-openapi";
import { logsRoutes, logsHandlers } from "../modules/logs/logs.routes";
import { apiKeyGuard } from "../middlewares/api-key.middleware";

const v1 = new OpenAPIHono();

// Aplicamos seguridad a TODO este router (o solo a rutas especificas)
v1.use("/*", apiKeyGuard);

// Logs Module
v1.openapi(logsRoutes.ingest, logsHandlers.ingest);

export default v1;
