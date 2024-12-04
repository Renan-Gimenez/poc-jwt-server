import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";

export async function recoverUser(app: FastifyInstance) {
  app.withTypeProvider().get("/recover-user", {}, async (request, reply) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];

      if (!token) {
        return reply.code(401).send({ message: "Token inválido" });
      }
      console.log({ token });

      const user = jwt.decode(token);

      return reply.send(user);
    } catch (error) {
      return reply.code(501).send({
        message: "Erro inesperado ao recuperar informações do usuário",
      });
    }
  });
}
