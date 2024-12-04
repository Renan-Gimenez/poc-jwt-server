import fastify from "fastify";
import { env } from "process";

import { login } from "./routes/login";
import { createUser } from "./routes/create-user";
import { getUsers } from "./routes/get-users";
import { recoverUser } from "./routes/recover-user";

const app = fastify();

app.register(login);
app.register(createUser);
app.register(getUsers);
app.register(recoverUser);

const PORT = Number(env.PORT) || 3000;
app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log(`Server running on port ${PORT}`);
});
