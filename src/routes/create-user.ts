import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

import { prisma } from "@/utils/prismaClient";

import bcrypt from "bcrypt";

import { env } from "process";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider().post("/create-user", {}, async (request, reply) => {
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

      const payload = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      };

      const token = jwt.sign(payload, env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return { token: token, user: newUser };
    } catch (error) {
      return reply.code(500).send({ message: "Erro ao criar usuário" });
    }
  });
}
