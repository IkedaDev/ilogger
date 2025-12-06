import { prisma } from "../../core/prisma";
import { z } from "zod";
import { createLogSchema } from "./logs.schema";

export class LogsService {
  async create(data: z.infer<typeof createLogSchema>, clientIp?: string) {
    // Si el cliente no mandó IP explícita, usamos la detectada por el servidor
    const finalIp = data.ip || clientIp || "unknown";

    return await prisma.log.create({
      data: {
        projectId: data.projectId,
        environment: data.environment,
        level: data.level,
        message: data.message,
        metadata: data.metadata || {}, // Prisma maneja el JSON nativo de Mongo
        ip: finalIp,
      },
    });
  }

  // (Opcional) Método para leer logs recientes de un proyecto
  async findRecent(projectId: string, limit = 50) {
    return await prisma.log.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
