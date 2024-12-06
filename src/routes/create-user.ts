import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../utils/prismaClient";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider().post("/create-user", {}, async (request, reply) => {
    try {
      const { username, password, email } = request.body as {
        username: string;
        password: string;
        email: string;
      };

      const existingUser = await prisma.users.findUnique({
        where: { username: username },
      });
      if (existingUser) {
        return reply.code(409).send({ message: "Usuário já cadastrado" });
      }

      const existingEmail = await prisma.users.findUnique({
        where: { email: email },
      });
      if (existingEmail) {
        return reply.code(409).send({ message: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT)
      );

      const newUser = await prisma.users.create({
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

      const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return { token: token, user: newUser };
    } catch (error) {
      return reply
        .code(501)
        .send({ message: "Erro inesperado ao criar usuário" });
    }
  });
}
