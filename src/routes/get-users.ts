import type { FastifyInstance } from "fastify";

import { prisma } from "@/utils/prismaClient";

export async function getUsers(app: FastifyInstance) {
  app.withTypeProvider().get("/get-users", {}, async (request) => {
    try {
      const users = await prisma.user.findMany();

      return { users };
    } catch {
      return { message: "Erro ao buscar usuários" };
    }
  });
}
