import { createMiddleware } from "hono/factory";
import { ApiResponse } from "../core/api-response";

export const apiKeyGuard = createMiddleware(async (c, next) => {
  const apiKey = c.req.header("x-api-key");

  // En producción esto debe venir de process.env.LOGGER_API_KEY
  // Por ahora ponemos un valor por defecto para desarrollo
  const MASTER_KEY = process.env.LOGGER_API_KEY || "ikeda_master_key_v1";

  if (!apiKey || apiKey !== MASTER_KEY) {
    return ApiResponse.error(
      c,
      "Unauthorized: Invalid or missing API Key",
      null,
      401
    );
  }

  await next();
});
