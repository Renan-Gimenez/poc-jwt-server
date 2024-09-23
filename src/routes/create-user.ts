import type { FastifyInstance } from "fastify";

import { prisma } from "@/utils/prismaClient";

import bcrypt from "bcrypt";

import { env } from "process";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider().post("/create-user", {}, async (request) => {
    try {
      const { username, password, email } = request.body as {
        username: string;
        password: string;
        email: string;
      };

      const hashedPassword = await bcrypt.hash(password, Number(env.SALT));

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          email,
        },
      });

      return { newUser };
    } catch (error) {
      return { message: "Erro ao criar usuário" };
    }
  });
}
