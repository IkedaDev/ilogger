import { PrismaClient } from "@prisma/client";
// En Mongo no solemos necesitar adapters complejos, el cliente directo funciona bien
export const prisma = new PrismaClient();
