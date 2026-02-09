import Fastify from "fastify";
import { ZodError } from "zod";
import { itemsRoutes } from "./routes/items";
import { ItemsStore } from "./store/itemsStore";

const app = Fastify({ logger: true });
const store = new ItemsStore();

app.setErrorHandler((err, _req, reply) => {
  if (err instanceof ZodError) {
    return reply.code(400).send({
      code: "BadRequest",
      message: "Validation failed",
      details: err.issues,
    });
  }

  app.log.error(err);
  return reply
    .code(500)
    .send({ code: "InternalError", message: "Unexpected error" });
});

app.get("/health", async () => ({ ok: true }));

await itemsRoutes(app, store);

await app.listen({ port: 3000 });
