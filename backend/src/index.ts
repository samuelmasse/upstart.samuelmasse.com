import Fastify from "fastify";
import { App } from "./app";

const app = Fastify();
new App(app);
await app.listen({ port: 3000 });
