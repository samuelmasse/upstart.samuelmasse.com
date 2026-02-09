import Fastify from "fastify";
import { Api } from "./api";
import { Routes } from "./routes";
import { Server } from "./server";

const app = Fastify();

const server = new Server();
const routes = new Routes(app);
new Api(server, routes);

await app.listen({ port: 3000 });
