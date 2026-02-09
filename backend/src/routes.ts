import { RouteSchema } from "@upstart.samuelmasse.com/common";
import { FastifyInstance } from "fastify";
import z from "zod";
import { Req, Res } from "./types";

export class Routes {
  constructor(private app: FastifyInstance) {}

  public add<ReqBody, ResBody>(schema: RouteSchema, handler: (req: Req<ReqBody>) => Promise<Res<ResBody>>) {
    this.app.route({
      method: schema.route.method,
      url: schema.route.target,
      handler: async (req, reply) => {
        try {
          console.log();
          console.log(schema.route.method, schema.route.target);

          const body: Record<string, unknown> = {
            ...((req.body as Record<string, unknown>) || {}),
            ...((req.params as Record<string, unknown>) || {}),
            ...((req.query as Record<string, unknown>) || {}),
          };

          console.log("body", body);

          const validBody = schema.req.safeParse(body);
          if (!validBody.success) {
            return reply.code(400).send({
              message: "Schema error",
              error: z.treeifyError(validBody.error),
            });
          }

          console.log("req", validBody.data);

          const res = await handler({ body: validBody.data as ReqBody });
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
  }
}
