import type { FastifyInstance } from "fastify";

export async function helloWorld(app: FastifyInstance) {
  app.withTypeProvider().get("/", {}, async (request) => {
    return { message: "Hello World" };
  });
}
