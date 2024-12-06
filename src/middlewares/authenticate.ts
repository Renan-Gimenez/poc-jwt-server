import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      username: string;
      email: string;
    };
  }
}

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}

export function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply
        .status(401)
        .send({ message: "Token de autenticação não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      request.user = {
        id: decoded.sub,
        username: decoded.username,
        email: decoded.email,
      };

      done();
    } catch (error) {
      console.error("Token inválido ou expirado");
      return reply.status(401).send({ message: "Token inválido ou expirado" });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Erro ao autenticar usuário" });
  }
}
