import fastify from "fastify";

import { helloWorld } from "./routes/hello-world";

const app = fastify();

app.register(helloWorld);

const PORT = 3333;
app.listen({ port: PORT }).then(() => {
  console.log(`Server running on port ${PORT}`);
});
