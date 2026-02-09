import { Schema } from "@upstart.samuelmasse.com/common";
import { FastifyInstance } from "fastify";
import z from "zod";
import { TodoApi } from "./todo-api";
import { TodoDb } from "./todo-db";
import { Req, Res } from "./types";

export class App {
  constructor(private app: FastifyInstance) {
    const todoDb = new TodoDb();
    const todoApi = new TodoApi(todoDb);

    this.register(Schema.createTodo, todoApi.createTodo.bind(todoApi));
    this.register(Schema.getTodo, todoApi.getTodo.bind(todoApi));
    this.register(Schema.listTodos, todoApi.listTodos.bind(todoApi));
    this.register(Schema.deleteTodo, todoApi.deleteTodo.bind(todoApi));
    this.register(Schema.putTodo, todoApi.putTodo.bind(todoApi));
  }

  private register = (
    schema: { route: { method: string; target: string }; req: z.ZodObject; res: z.ZodObject },
    handler: (req: Req<any>) => Promise<Res<any>>,
  ) => {
    this.app.route({
      method: schema.route.method,
      url: schema.route.target,
      handler: async (req, reply) => {
        try {
          console.log();
          console.log(schema.route.method, schema.route.target);

          console.log(req.query);
          const body: any = { ...req.body, ...req.params, ...req.query };
          console.log("body", body);

          const validBody = schema.req.safeParse(body);
          if (!validBody.success) {
            return reply.code(400).send({
              message: "Schema error",
              error: z.treeifyError(validBody.error),
            });
          }

          console.log("req", validBody.data);

          const res = await handler({ body: validBody.data });
          console.log("res", res);

          const validRes = schema.res.parse(res.body);
          const status = res.status || 200;

          return reply.code(status).send(validRes);
        } catch (e) {
          console.error(e);
          return reply.code(500).send();
        }
      },
    });
  };
}
