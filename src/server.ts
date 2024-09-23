import fastify from "fastify";
import { env } from "process";

import { login } from "./routes/login";
import { createUser } from "./routes/create-user";
import { getUsers } from "./routes/get-users";

const app = fastify();

app.register(login);
app.register(createUser);
app.register(getUsers);

const PORT = Number(env.PORT) || 3000;
app.listen({ port: PORT }).then(() => {
  console.log(`Server running on port ${PORT}`);
});
