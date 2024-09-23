import type { FastifyInstance } from "fastify";

import { prisma } from "@/utils/prismaClient";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider().post("/create-user", {}, async (request) => {
    try {
      const { username, password, email } = request.body as {
        username: string;
        password: string;
        email: string;
      };

      const newUser = await prisma.user.create({
        data: {
          username,
          password,
          email,
        },
      });

      return { newUser };
    } catch (error) {
      return { message: "Erro ao criar usuário" };
    }
  });
}
