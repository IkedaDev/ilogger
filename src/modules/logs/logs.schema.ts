import { z } from "@hono/zod-openapi";
import { LogLevel, Environment } from "@prisma/client";

const LevelSchema = z.nativeEnum(LogLevel).openapi({ example: "INFO" });
const EnvSchema = z.nativeEnum(Environment).openapi({ example: "PRODUCTION" });

// Input: Crear Log
export const createLogSchema = z.object({
  projectId: z.string().min(2).openapi({ example: "anami-backend" }),
  environment: EnvSchema.default("DEVELOPMENT"),
  level: LevelSchema.default("INFO"),
  message: z.string().min(1).openapi({ example: "User logged in" }),
  metadata: z
    .record(z.string(), z.any())
    .optional()
    .openapi({ example: { userId: "123", latency: 50 } }),
  ip: z.string().optional(), // Opcional, si el cliente quiere enviarla explícitamente
});

// Output: Respuesta Log
export const logResponseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  level: LevelSchema,
  message: z.string(),
  createdAt: z.string(),
});
