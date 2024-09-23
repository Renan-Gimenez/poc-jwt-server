import type { FastifyInstance } from "fastify";

import { prisma } from "@/utils/prismaClient";

import bcrypt from "bcrypt";

export async function login(app: FastifyInstance) {
  app.withTypeProvider().post("/login", {}, async (request) => {
    try {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return { message: "Usuário ou senha inválidos" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { message: "Usuário ou senha inválidos" };
      }

      return { user };
    } catch (error) {
      console.error(error);
      return { message: "Erro ao efetuar login" };
    }
  });
}
