import type { FastifyInstance } from "fastify";

import { prisma } from "@/utils/prismaClient";
import { authenticate } from "@/middlewares/authenticate";

export async function getUsers(app: FastifyInstance) {
  app
    .withTypeProvider()
    .get(
      "/get-users",
      { preHandler: [authenticate] },
      async (request, reply) => {
        try {
          const users = await prisma.user.findMany();

          return { users };
        } catch {
          return reply.code(500).send({ message: "Erro ao buscar usuários" });
        }
      }
    );
}
