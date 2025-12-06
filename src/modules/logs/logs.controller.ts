import { Context } from "hono";
import { LogsService } from "./logs.service";
import { ApiResponse } from "../../core/api-response";

export class LogsController {
  constructor(private service: LogsService) {}

  ingest = async (c: Context) => {
    try {
      const body = await c.req.valid("json" as never);

      // Capturamos la IP real (útil si estás detrás de Nginx/Cloudflare)
      const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip");

      const newLog = await this.service.create(body, ip);

      return ApiResponse.success(c, newLog, "Log archived successfully", 201);
    } catch (error) {
      return ApiResponse.error(c, "Failed to ingest log", error, 500);
    }
  };
}
