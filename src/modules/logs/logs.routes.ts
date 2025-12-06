import { createRoute, z } from "@hono/zod-openapi";
import { LogsController } from "./logs.controller";
import { LogsService } from "./logs.service";
import { createLogSchema, logResponseSchema } from "./logs.schema";

const service = new LogsService();
const controller = new LogsController(service);

// Definición de la ruta
const ingestRoute = createRoute({
  method: "post",
  path: "/ingest", // La ruta final será /v1/ingest
  tags: ["Logs"],
  summary: "Ingest a new log entry",
  description: "Saves a log entry into MongoDB. Requires API Key.",
  security: [{ apiKey: [] }], // <--- Indica en Scalar que requiere el candadito
  request: {
    body: {
      content: {
        "application/json": { schema: createLogSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Log saved",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            data: logResponseSchema,
          }),
        },
      },
    },
    401: { description: "Invalid API Key" },
    500: { description: "Server Error" },
  },
});

export const logsRoutes = { ingest: ingestRoute };
export const logsHandlers = { ingest: controller.ingest };
