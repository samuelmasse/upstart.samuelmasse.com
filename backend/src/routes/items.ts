import {
  ItemCreateSchema,
  ItemUpdateSchema,
} from "@upstart.samuelmasse.com/common";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ItemsStore } from "../store/itemsStore";

const IdSchema = z.object({ id: z.string().min(1) });

export async function itemsRoutes(app: FastifyInstance, store: ItemsStore) {
  app.get("/items", async () => {
    return { items: store.list() };
  });

  app.get("/items/:id", async (req, reply) => {
    const { id } = IdSchema.parse(req.params);
    const item = store.get(id);

    if (!item)
      return reply
        .code(404)
        .send({ code: "NotFound", message: "Item not found" });
    return item;
  });

  app.post("/items", async (req, reply) => {
    const data = ItemCreateSchema.parse(req.body);
    const item = store.create(data);
    return reply.code(201).send(item);
  });

  app.patch("/items/:id", async (req, reply) => {
    const { id } = IdSchema.parse(req.params);
    const patch = ItemUpdateSchema.parse(req.body);

    const item = store.update(id, patch);
    if (!item)
      return reply
        .code(404)
        .send({ code: "NotFound", message: "Item not found" });

    return item;
  });

  app.delete("/items/:id", async (req, reply) => {
    const { id } = IdSchema.parse(req.params);
    const ok = store.remove(id);

    if (!ok)
      return reply
        .code(404)
        .send({ code: "NotFound", message: "Item not found" });
    return reply.code(204).send();
  });
}
