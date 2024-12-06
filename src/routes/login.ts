import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

import { prisma } from "../utils/prismaClient";

import bcrypt from "bcrypt";

export async function login(app: FastifyInstance) {
  app.withTypeProvider().post("/login", {}, async (request, reply) => {
    try {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      const user = await prisma.users.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return reply.code(401).send({ message: "Usuário ou senha inválidos" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return reply.code(401).send({ message: "Usuário ou senha inválidos" });
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return reply.code(200).send({ token: token, user: payload });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: "Erro ao efetuar login" });
    }
  });
}
